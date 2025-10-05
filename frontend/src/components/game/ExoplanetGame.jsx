import React, { useState, useEffect } from 'react';
import { scaleToUnit, median, downsampleYToN } from '../../lib/utils';

const ExoplanetGame = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start'); // start, playing, levelComplete, gameOver
  const [currentData, setCurrentData] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [hintUsed, setHintUsed] = useState(false);

  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [rounds, setRounds] = useState([]); // each item: { id, score, finishedAt }


  async function fetchRandomBlock() {
    const res = await fetch(`http://20.187.48.226:5050/lightcurve/random`);
    if (!res.ok) throw new Error("Failed to load light curve");
    const json = await res.json();
    console.log(JSON.stringify(json));
    
    return json;
  }

  // Start a new level
  const startLevel = () => {
    setGameState('playing');
    setTimeLeft(30);
    setHintUsed(false);
    setFeedback('');
    setSelectedPlanet(null);
    
    // Select a random exoplanet for this level
    fetchRandomBlock().then(setCurrentData).catch(console.error);
  };

  // Handle planet selection
  const handlePlanetSelect = (hasPlanet) => {
    if (gameState !== 'playing') { 
      return;
    }
    setSelectedPlanet(hasPlanet);
    
    // Check if correct
    const correct = hasPlanet === (currentData.label === 1);
    if (correct) {
      const points = hintUsed ? 5 : 10;
      // setScore(prev => prev + points);
      const finalScore = score + points;           // compute before setState
      setScore(finalScore);
      setFeedback(`Correct! Planet detected! +${points} points`);
      
      // Move to next level or complete game
      if (level < 3) {
        setGameState('levelComplete');
      } else {
        // Round (3 levels) completed
        setRounds(prev => [
          ...prev,
          { id: prev.length + 1, score: finalScore, finishedAt: Date.now() }
        ]);

        setGameState('gameOver');
        // setRoundsCompleted(r => r + 1);
      }
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setFeedback('No planet detected here. Try again!');
    }
  };

  // Handle hint
  const useHint = () => {
    if (hintUsed || gameState !== 'playing') return;
    
    setHintUsed(true);
    setScore(prev => Math.max(0, prev - 3));
    
    // Show a hint about where the planet might be
    const hintArea = currentData.data.map((val, i) => 
      val < 0.99 ? i : null
    ).filter(Boolean);
    
    if (hintArea.length > 0) {
      setFeedback(`Hint: Check around data point ${hintArea[0]}-${hintArea[hintArea.length-1]}`);
    } else {
      setFeedback('Hint: Look for a small dip in the light curve');
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  // Start the first level when component mounts
  useEffect(() => {
    startLevel();
  }, [level]);

  // Render the light curve
  const renderLightCurve = () => {
    if (!currentData) return null;
    const oneHundred = downsampleYToN(currentData.data, 100);

    const flux = Object.values(oneHundred);

    const { scaled } = scaleToUnit(flux, { robust: true });

    const base = median(flux);
    
    return (
      <div className="w-full h-64 bg-gray-900 rounded-lg p-4 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-gray-700"></div>
        </div>
        <div className="relative h-full w-full">
          {scaled.map((h, idx) => {
            const raw = flux[idx]; // keep raw for color logic if desired
            const isDip = raw < base * 0.995; // ~0.5% below baseline → dip

            return (
              <div
                key={idx}
                className="absolute bottom-0 w-1 z-10"
                style={{
                  left: `${idx}%`,
                  height: `${h * 100}%`,          // scaled height fits container
                  transform: 'translateX(-50%)',
                  backgroundColor: isDip ? '#3B82F6' : '#3B82F680',
                }}
              />
            );
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
          <span>0 days</span>
          <span>{currentData.period / 2} days</span>
          <span>{currentData.period} days</span>
        </div>
      </div>
    );
  };

  // Render game screen based on state
  const renderGameScreen = () => {
    switch (gameState) {
      case 'start':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Exoplanet Discovery Game</h2>
            <p className="mb-6 text-gray-300">
              Analyze light curves to detect exoplanets. Look for the telltale dips in brightness!
            </p>
            <button
              onClick={startLevel}
              className="bg-test-600 hover:bg-test-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              Start Game
            </button>
          </div>
        );

      case 'playing':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Level {level}/3</div>
              <div className="text-lg font-semibold">Score: {score}</div>
              <div className="text-lg font-semibold">Time: {timeLeft}s</div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Analyze the Light Curve</h3>
              <p className="text-sm text-gray-400 mb-4">
                Does this data show evidence of an exoplanet transit?
              </p>
            </div>

            {renderLightCurve()}

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => handlePlanetSelect(true)}
                className={`px-6 py-2 rounded-full font-medium ${
                  selectedPlanet === true 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-900/50 text-green-400 hover:bg-green-800/50'
                }`}
              >
                Planet Detected
              </button>
              <button
                onClick={() => handlePlanetSelect(false)}
                className={`px-6 py-2 rounded-full font-medium ${
                  selectedPlanet === false 
                    ? 'bg-red-600 text-white' 
                    : 'bg-red-900/50 text-red-400 hover:bg-red-800/50'
                }`}
              >
                No Planet
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={useHint}
                disabled={hintUsed || selectedPlanet !== null}
                className={`text-sm px-4 py-1 rounded-full ${
                  hintUsed || selectedPlanet !== null
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-blue-400 hover:text-blue-300'
                }`}
              >
                {hintUsed ? 'Hint Used' : 'Get Hint (-3 points)'}
              </button>
            </div>

            {feedback && (
              <div className="mt-4 p-3 rounded-lg text-center">
                <p className={feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'}>
                  {feedback}
                </p>
              </div>
            )}
          </div>
        );

      case 'levelComplete':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Level Complete!</h2>
            <p className="mb-6 text-gray-300">
              You found the exoplanet! Your current score is {score}.
            </p>
            <button
              onClick={() => {
                setLevel(prev => prev + 1);
              }}
              className="bg-test-600 hover:bg-test-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              Next Level
            </button>
          </div>
        );

      case 'gameOver':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              {level === 3 ? 'Mission Complete!' : 'Time\'s Up!'}
            </h2>
            <p className="text-4xl font-bold text-test-400 mb-2">Score: {score}</p>
            <p className="mb-6 text-gray-300">
              {level === 3 
                ? 'You\'ve completed all levels! Great job, exoplanet hunter!'
                : 'Better luck next time! Try to be faster in your analysis.'}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setLevel(1);
                  setScore(0);
                  startLevel();
                }}
                className="bg-test-600 hover:bg-test-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => {
                  setLevel(1);
                  setScore(0);
                  setGameState('start');
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
              >
                Main Menu
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };


  return (
    <div>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-test-400 text-center">
          Exoplanet Discovery Game
        </h2>
        
        <div className="max-w-3xl mx-auto">
          {renderGameScreen()}
        </div>
        
        {(gameState === 'playing' || gameState === 'start') && (
          <div className="mt-8 p-4 bg-gray-900/50 rounded-lg">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Analyze the light curve for periodic dips in brightness</li>
              <li>• Click "Planet Detected" if you see a consistent dip pattern</li>
              <li>• Click "No Planet" if the data looks like random noise</li>
              <li>• Use hints if you're stuck, but they'll cost you points!</li>
              <li>• Be quick! You have limited time for each level</li>
            </ul>
          </div>
        )}
      </div>
     

      {(gameState === 'levelComplete' || gameState === 'gameOver') && (
        <section className="mt-8">
          <div className="mx-auto max-w-4xl rounded-2xl bg-gray-800/50 backdrop-blur-sm p-6 shadow-xl ring-1 ring-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Attempts (takes 2/3 width on md+) */}
              <div className="md:col-span-2 min-w-0">
                <h2 className="text-xl font-semibold mb-3 text-test-400">Attempts</h2>
                <ul className="space-y-2 max-h-56 overflow-y-auto pr-2">
                  {rounds.length === 0 ? (
                    <li className="text-gray-500 text-sm">No completed rounds yet.</li>
                  ) : (
                    rounds.map((r) => (
                      <li
                        key={r.id}
                        className="rounded-lg bg-gray-900/60 px-3 py-2 flex items-center justify-between"
                      >
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-test-500/20 text-test-400 text-xs font-semibold">
                            {r.id}
                          </span>
                          
                          <div className="min-w-0">
                            <p className="truncate">Round {r.id}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(r.finishedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold tabular-nums">{r.score} pts</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Score (1/3 width on md+) */}
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold mb-3 text-test-400">Score</h2>
                <div className="flex items-center justify-center rounded-xl bg-gray-900/60 py-8">
                  <span className="text-5xl font-bold tracking-tight tabular-nums text-white">
                    {score}
                  </span>
                </div>
                <div className="mt-3 text-xs text-gray-400 text-center">
                  Completed rounds:{' '}
                  <span className="font-medium text-gray-200">{rounds.length}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default ExoplanetGame;