import React from 'react';

function Playground() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-test-500">Playground</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Interact with our model and explore potential exoplanet candidates in real-time.
          </p>
        </div>
        <div className="prose prose-invert max-w-7xl">
          {/* Add interactive components here */}
        </div>
      </div>
    </div>
  );
}

export default Playground;
