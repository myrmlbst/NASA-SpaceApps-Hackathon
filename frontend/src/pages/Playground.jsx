import React from 'react';

function Playground() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-test-500">Playground</h1>
        <div className="prose prose-invert max-w-3xl">
          <p className="text-xl">
            Interact with our model and explore potential exoplanet candidates in real-time.
          </p>
          {/* Add interactive components here */}
        </div>
      </div>
    </div>
  );
}

export default Playground;
