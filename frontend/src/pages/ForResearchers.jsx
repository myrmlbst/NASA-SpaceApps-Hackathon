import React from 'react';

function ForResearchers() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-test-500">For Researchers</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Access advanced tools, datasets, and documentation for academic and research purposes.
          </p>
        </div>
        <div className="prose prose-invert max-w-7xl">
          {/* Add research tools and documentation here */}
        </div>
      </div>
    </div>
  );
}

export default ForResearchers;
