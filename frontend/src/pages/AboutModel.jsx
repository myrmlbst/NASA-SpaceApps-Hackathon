import React from 'react';

function AboutModel() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-test-500">About the Model</h1>
        <div className="prose prose-invert max-w-3xl">
          <p className="text-xl">
            Our advanced machine learning model has been trained on extensive astronomical data
            to identify potential exoplanets with high accuracy.
          </p>
          {/* Add more content here */}
        </div>
      </div>
    </div>
  );
}

export default AboutModel;
