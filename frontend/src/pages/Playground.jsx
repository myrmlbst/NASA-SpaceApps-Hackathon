import React from 'react';

import BackButton from '../components/ui/BackButton';

function Playground() {
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
        
        <div className="prose prose-invert max-w-7xl">
          {/* Add interactive components here */}
        </div>
      </div>
      </div>
    </div>
  );
}

export default Playground;
