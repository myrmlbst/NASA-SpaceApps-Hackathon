import React, { useState } from 'react';
import BackButton from '../components/ui/BackButton';
import HabitableCalculator from '../components/calculator/HabitableCalculator';
import ExoplanetGame from '../components/game/ExoplanetGame';

function Playground() {
  const [activeTab, setActiveTab] = useState('habitability');
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
      <div className="container mx-auto">
        <BackButton />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-test-500">Playground</h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Interact with our model and explore potential exoplanet candidates in real-time.
            </p>
            <div className="w-full max-w-3xl h-1 bg-test-500 mx-auto my-6"></div>
          </div>
          
          <div className="space-y-8">
            <section className="bg-gray-900/30 rounded-xl border border-gray-800/50 overflow-hidden">
              <div className="flex flex-wrap border-b border-gray-800/50">
                {['Habitability', 'Discovery Game'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-6 py-4 font-medium text-sm sm:text-base transition-colors ${
                      activeTab === tab.toLowerCase()
                        ? 'text-test-400 border-b-2 border-test-500 bg-gray-800/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="p-4 sm:p-6 md:p-8">
                <div className="min-h-[500px] rounded-lg bg-gray-800/20 p-4 sm:p-6">
                  {activeTab === 'habitability' && <HabitableCalculator />}
                  {activeTab === 'discovery game' && <ExoplanetGame />}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playground;