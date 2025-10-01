import React from 'react';

import BackButton from '../components/ui/BackButton';

function ForResearchers() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
      <div className="container mx-auto">
        <BackButton />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-test-500">For Researchers</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Access advanced tools, datasets, and documentation for academic and research purposes.
          </p>
          <div className="w-full max-w-3xl h-1 bg-test-500 mx-auto my-4"></div>
        </div>
        
        <div className="prose prose-invert max-w-7xl">
          {/* Add research tools and documentation here */}
        </div>
      </div>
      </div>
    </div>
  );
}

export default ForResearchers;
