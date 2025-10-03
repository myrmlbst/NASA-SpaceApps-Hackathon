import React, { useRef, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const MetricCard = ({ title, value, description }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      card.classList.add('scale-105', 'ring-2', 'ring-test-400');
    };

    const handleMouseLeave = () => {
      card.classList.remove('scale-105', 'ring-2', 'ring-test-400');
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="bg-gray-800/70 p-4 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-test-400/20 group"
      title={description}
    >
      <div className="text-2xl font-bold text-test-400 group-hover:text-test-300 transition-colors">
        {value}
      </div>
      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
        {title}
      </div>
    </div>
  );
};

import BackButton from '../components/ui/BackButton';

function AboutModel() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
      <div className="container mx-auto">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
        <BackButton />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-test-500">About the Model</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Our advanced machine learning model has been trained on extensive astronomical data from the Kepler Space Telescope to identify potential exoplanets with high accuracy (≃80% accuracy).
          </p>
          <div className="w-full max-w-3xl h-1 bg-test-500 mx-auto my-4"></div>
        </div>
        
        <div className="prose prose-invert w-full max-w-none lg:max-w-5xl xl:max-w-7xl space-y-10">

        <section className="bg-gray-900/30 p-6 sm:p-8 rounded-xl border border-gray-800/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-test-400 border-b border-gray-800 pb-3">1. Data Pipeline</h2>
          <p className="mb-3 sm:mb-4">The system processes data through several stages:</p>
          
          <div className="ml-2 sm:ml-6 space-y-4">
            <div>
              <h3 className="font-semibold text-base sm:text-lg">Data Collection</h3>
              <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-base sm:text-lg text-gray-300">
                <li>Uses <code className="bg-gray-800 px-1 rounded text-xs sm:text-sm">lightkurve</code> to fetch light curve data from the Kepler mission</li>
                <li>Retrieves stellar parameters (temperature, radius, mass, etc.) from the NASA Exoplanet Archive</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg">Feature Engineering</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">(<code className="text-xs sm:text-sm">star_aggregator.py</code>)</p>
              <p className="text-sm sm:text-base">Processes raw light curve data to extract meaningful features:</p>
              <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-base sm:text-lg text-gray-300">
                <li>Flux statistics (mean, std, skewness, kurtosis)</li>
                <li>Error statistics</li>
                <li>Transit characteristics (depth, duration, ingress/egress times)</li>
                <li>Stellar properties (effective temperature, radius, mass, metallicity)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg">Data Formatting</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">(<code className="text-xs sm:text-sm">format-data.py</code>)</p>
              <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-base sm:text-lg text-gray-300">
                <li>Processes individual star data</li>
                <li>Detects transit events in light curves</li>
                <li>Calculates transit properties like depth, duration, and symmetry</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gray-900/30 p-6 sm:p-8 rounded-xl border border-gray-800/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-test-400 border-b border-gray-800 pb-3">2. Machine Learning Model</h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">(<code className="text-xs sm:text-sm">ml-model.py</code>)</p>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">The core model is a Logistic Regression classifier with the following characteristics:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-4">
            <div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:3 text-test-300">Architecture</h3>
              <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-base sm:text-lg text-gray-300">
                <li>Uses L2 regularization (Ridge)</li>
                <li>Implements class weighting to handle imbalanced data</li>
                <li>Includes a sigmoid calibration layer for better probability estimates</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:3 text-test-300">Preprocessing</h3>
              <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-base sm:text-lg text-gray-300">
                <li>Standard scaling of features (mean=0, std=1)</li>
                <li>5-fold cross-validation for calibration</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 bg-gray-900/40 p-6 rounded-xl border border-gray-800/50">
            <h3 className="font-semibold text-xl sm:text-2xl mb-6 text-test-400 border-b border-gray-800 pb-3">Performance Metrics</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-center text-lg font-medium mb-4">Model Performance Overview</h4>
                <div className="h-64">
                  <Radar 
                    data={{
                      labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC AUC', 'Balanced Acc.'],
                      datasets: [{
                        label: 'Score (%)',
                        data: [78.1, 76.0, 80.9, 78.4, 80.8, 78.2],
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        borderColor: 'rgba(99, 102, 241, 0.8)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
                      }]
                    }}
                    options={{
                      scales: {
                        r: {
                          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' },
                          pointLabels: { color: 'rgba(255, 255, 255, 0.8)', font: { size: 12 } },
                          min: 70,
                          max: 90,
                          ticks: {
                            display: false,
                            stepSize: 5
                          },
                          beginAtZero: false
                        }
                      },
                      plugins: {
                        legend: {
                          labels: {
                            color: 'rgba(255, 255, 255, 0.8)'
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw}%`
                          }
                        }
                      },
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-4">
                <MetricCard 
                  title="Accuracy" 
                  value="78.1%" 
                  description="Overall correctness of the model's predictions"
                />
                <MetricCard 
                  title="Precision" 
                  value="76.0%" 
                  description="Correct positive predictions among all positive predictions"
                />
                <MetricCard 
                  title="Recall" 
                  value="80.9%" 
                  description="Correctly identified positive instances among all actual positives"
                />
                <MetricCard 
                  title="F1 Score" 
                  value="78.4%" 
                  description="Harmonic mean of precision and recall"
                />
                <MetricCard 
                  title="ROC AUC" 
                  value="80.8%" 
                  description="Area under the ROC curve - model's ability to distinguish between classes"
                />
                <MetricCard 
                  title="Balanced Acc." 
                  value="78.2%" 
                  description="Average of recall obtained on each class"
                />
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-400">
              <p>Metrics are calculated using 5-fold cross-validation on the test dataset. Higher values indicate better performance.</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-900/30 p-6 sm:p-8 rounded-xl border border-gray-800/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-test-400 border-b border-gray-800 pb-3">3. Model Usage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-3 sm:p-4 rounded-lg bg-gray-800/50">
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:3 text-test-300">Training</h3>
              <pre className="bg-black p-2 sm:p-3 rounded overflow-x-auto text-xs sm:text-sm">
                <code>python ml-model.py</code>
              </pre>
            </div>
            
            <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:3 text-test-300">Inference</h3>
              <pre className="bg-black p-2 sm:p-3 rounded overflow-x-auto text-xs sm:text-sm mb-2">
                <code>python input-test.py</code>
              </pre>
              <p className="text-xs sm:text-sm text-gray-400 font-light">Input: <code className="">data/test-data.csv</code></p>
              <p className="text-xs sm:text-sm text-gray-400 font-light">Output: Probability of exoplanet presence</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-900/30 p-6 sm:p-8 rounded-xl border border-gray-800/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-test-400 border-b border-gray-800 pb-3">4. Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-4">
            <div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:3 text-test-300">Stellar Properties</h3>
              <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-base sm:text-lg text-gray-300">
                <li>Effective temperature (teff)</li>
                <li>Surface gravity (logg)</li>
                <li>Metallicity (feh)</li>
                <li>Mass and radius</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:3 text-test-300">Light Curve Features</h3>
              <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-base sm:text-lg text-gray-300">
                <li>Flux statistics (mean, std, skewness, kurtosis)</li>
                <li>Error statistics</li>
                <li>Transit depth and duration</li>
                <li>Ingress/egress characteristics</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gray-900/30 p-6 sm:p-8 rounded-xl border border-gray-800/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-test-400 border-b border-gray-800 pb-3">5. Strengths and Limitations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-4">
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-green-300">Strengths</h3>
              <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-base sm:text-lg text-gray-300">
                <li>Simple and interpretable model</li>
                <li>Handles class imbalance</li>
                <li>Good performance metrics</li>
                <li>Includes uncertainty calibration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-yellow-200/80">Limitations</h3>
              <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-base sm:text-lg text-gray-300">
                <li>Moderate accuracy (78%)</li>
                <li>Detection is limited by the planet's dimensions</li>
                <li>Limited to the parameter space of the training data</li>
                <li>Collected data is limited by instrumental noise</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-test-400 border-b border-gray-800 pb-3">6. Data Flow</h2>
          <div className="space-y-2 text-sm sm:text-base">
            
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="w-24 sm:w-1/4">Raw light curve data</span>
              <span className="mx-1">→</span>
              <code className="bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm whitespace-nowrap">format-data.py</code>
              <span className="mx-1">→</span>
              <span className="whitespace-nowrap">Processed features</span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="w-24 sm:w-1/4">Feature aggregation</span>
              <span className="mx-1">→</span>
              <code className="bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm whitespace-nowrap">star_aggregator.py</code>
              <span className="mx-1">→</span>
              <span className="whitespace-nowrap">Training data</span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="w-24 sm:w-1/4">Training</span>
              <span className="mx-1">→</span>
              <code className="bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm whitespace-nowrap">ml-model.py</code>
              <span className="mx-1">→</span>
              <span className="whitespace-nowrap">Trained model (<code className="text-xs sm:text-sm">model.pkl</code>)</span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="w-24 sm:w-1/4">Inference</span>
              <span className="mx-1">→</span>
              <code className="bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm whitespace-nowrap">input-test.py</code>
              <span className="mx-1">→</span>
              <span className="whitespace-nowrap">Prediction results</span>
            </div>
          </div>
          
          <p className="mt-4 sm:mt-6 text-sm sm:text-base">
            The model is designed to be a practical tool for astronomers to quickly assess the likelihood of exoplanet presence around observed stars, which can then be followed up with more detailed observations.
          </p>
          
          <div className="mt-10 sm:mt-12 pt-6 border-t border-gray-800 text-center">
            <div className="relative group inline-block">
              <a 
                href="https://github.com/myrmlbst/a-world-away_hunting-for-exoplanets" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 transform group"
              >
                <FaGithub className="w-5 h-5 mr-2" />
                <span>View on GitHub</span>
              </a>
            </div>

            <p className="mt-3 text-xs text-gray-400">This project is currently open source and under the MIT license. Feel free to explore our codebase and contribute!</p>
          </div>

        </section>

        </div>
      </div>
      </div>
    </div>
  );
}

export default AboutModel;
