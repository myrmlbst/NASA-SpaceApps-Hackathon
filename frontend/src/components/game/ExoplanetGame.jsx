import React, { useState, useEffect } from 'react';

const ExoplanetGame = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start'); // start, playing, levelComplete, gameOver
  const [currentData, setCurrentData] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [hintUsed, setHintUsed] = useState(false);

  const exoplanetData = [
    // Level 1 - Easy (obvious dips)
    {
      id: 1,
      name: 'Kepler-186f',
      period: 129.9, // days
      depth: 0.03, // %
      data: Array(100).fill(1).map((_, i) => {
        // Create a light curve with a clear dip
        if (i > 40 && i < 60) return 0.97 + (Math.random() * 0.02);
        return 1 - (Math.random() * 0.01);
      })
    },
    // Level 2 - Medium (slightly less obvious)
    {
      id: 2,
      name: 'TRAPPIST-1e',
      period: 6.1,
      depth: 0.08,
      data: Array(100).fill(1).map((_, i) => {
        if (i > 45 && i < 55) return 0.92 + (Math.random() * 0.03);
        return 1 - (Math.random() * 0.02);
      })
    },
    // Level 3 - Hard (very subtle)
    {
      id: 3,
      name: 'Proxima Centauri b',
      period: 11.2,
      depth: 0.02,
      data: Array(100).fill(1).map((_, i) => {
        if (i > 48 && i < 52) return 0.98 + (Math.random() * 0.01);
        return 1 - (Math.random() * 0.01);
      })
    }
  ];

  // Start a new level
  const startLevel = () => {
    setGameState('playing');
    setTimeLeft(30);
    setHintUsed(false);
    setFeedback('');
    setSelectedPlanet(null);
    
    // Select a random exoplanet for this level
    const levelData = exoplanetData[level - 1];
    setCurrentData(levelData);
  };

  // Handle planet selection
  const handlePlanetSelect = (hasPlanet) => {
    if (gameState !== 'playing') { 
      return;
    }
    
    setSelectedPlanet(hasPlanet);
    
    // Check if correct
    const correct = hasPlanet;
    if (correct) {
      const points = hintUsed ? 5 : 10;
      setScore(prev => prev + points);
      setFeedback(`Correct! Planet detected! +${points} points`);
      
      // Move to next level or complete game
      if (level < 3) {
        setGameState('levelComplete');
      } else {
        setGameState('gameOver');
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
    
    return (
      <div className="w-full h-64 bg-gray-900 rounded-lg p-4 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-gray-700"></div>
        </div>
        <div className="relative h-full w-full">
          {currentData.data.map((value, i) => (
            <div 
              key={i}
              className="absolute bottom-0 w-1 h-full bg-test-500/30"
              style={{
                left: `${i}%`,
                height: `${value * 100}%`,
                transform: 'translateX(-50%)',
                backgroundColor: value < 0.99 ? '#3B82F6' : '#3B82F680'
              }}
            />
          ))}
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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-test-400 text-center">Exoplanet Discovery Game</h2>
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
  );
};

export default ExoplanetGame;