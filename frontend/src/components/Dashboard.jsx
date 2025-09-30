import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === '#dashboard') {
      const element = document.getElementById('dashboard');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const navigationItems = [
    {
      title: 'About the Model',
      description: 'Learn about our ML model, why we developed it, and how it identifies potential exoplanets',
      path: '/about-model',
      emoji: '🔍'
    },
    {
      title: 'Playground',
      description: 'Testing playground for non-researchers to familiarize themselves with our model',
      path: '/playground',
      emoji: '🚀'
    },
    {
      title: 'For Researchers',
      description: 'Check whether a star has a potential exoplanet(s). Interact with our model and explore exoplanet data',
      path: '/machine-learning-model',
      emoji: '📊'
    }
  ];

  return (
    <section id="dashboard" className="min-h-screen bg-gray-900 text-white p-8 pt-20 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-test-500">Discover New Exoplanets</h1>
        <p className="text-xl text-gray-300 max-w-3xl mb-16">
          Explore the cosmos and discover distant worlds beyond our solar system using our Machine Learning Model, developed and tested with XX% accuracy.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="group bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 text-left"
            >
              <div className="text-4xl mb-4 group-hover:text-test-500 transition-colors">
                {item.emoji}
              </div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-test-400 transition-colors">
                {item.title}
              </h2>
              <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
                {item.description}
              </p>
              <div className="mt-4 text-test-500 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                Explore →
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
