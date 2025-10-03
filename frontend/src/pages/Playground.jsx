import React, { useState } from 'react';
import BackButton from '../components/ui/BackButton';
import HabitableCalculator from '../components/calculator/HabitableCalculator';
import ExoplanetGame from '../components/game/ExoplanetGame';

function Playground() {
  const [activeTab, setActiveTab] = useState('habitability');
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
      <div className="container mx-auto">
        <BackButton />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-test-500">Playground</h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Interact with our model and explore potential exoplanet candidates in real-time.
            </p>
            <div className="w-full max-w-3xl h-1 bg-test-500 mx-auto my-4"></div>
          </div>
          
          <div className="w-full max-w-7xl">
            <div className="mb-8">
              <div className="flex flex-wrap border-b border-gray-700 mb-6">
                {['Habitability', 'Discovery Game'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-6 py-3 font-medium text-sm md:text-base transition-colors ${
                      activeTab === tab.toLowerCase()
                        ? 'border-b-2 border-test-500 text-test-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[500px] bg-gray-900/30 rounded-xl p-4 sm:p-6">
                {activeTab === 'habitability' && <HabitableCalculator />}
                {activeTab === 'discovery game' && <ExoplanetGame />}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Playground;
