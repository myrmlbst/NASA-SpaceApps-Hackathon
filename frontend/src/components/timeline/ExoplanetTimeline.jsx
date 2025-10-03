import React, { useState } from 'react';

const ExoplanetTimeline = () => {
  const [activeEra, setActiveEra] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const timelineEvents = [
    {
      id: 1,
      year: 1992,
      title: 'First Exoplanet Discovery',
      description: 'Astronomers Aleksander Wolszczan and Dale Frail announced the discovery of the first confirmed exoplanets orbiting the pulsar PSR B1257+12.',
      type: 'discovery',
      image: 'https://exoplanets.nasa.gov/internal_resources/1902',
      era: 'early'
    },
    {
      id: 2,
      year: 1995,
      title: 'First Exoplanet Around Sun-like Star',
      description: '51 Pegasi b, the first exoplanet discovered orbiting a Sun-like star, was detected using the radial velocity method.',
      type: 'discovery',
      era: 'early'
    },
    {
      id: 3,
      year: 2009,
      title: 'Kepler Mission Launches',
      description: 'NASA\'s Kepler Space Telescope launched, revolutionizing exoplanet discovery with the transit method. It would discover thousands of exoplanets.',
      type: 'mission',
      era: 'modern'
    },
    {
      id: 4,
      year: 2011,
      title: 'First Potentially Habitable Exoplanet',
      description: 'Kepler-22b became the first exoplanet confirmed to orbit in the habitable zone of a Sun-like star.',
      type: 'habitable',
      era: 'modern'
    },
    {
      id: 5,
      year: 2017,
      title: 'TRAPPIST-1 System',
      description: 'Discovery of seven Earth-sized exoplanets, three in the habitable zone, around the ultra-cool dwarf star TRAPPIST-1.',
      type: 'habitable',
      era: 'modern'
    },
    {
      id: 6,
      year: 2018,
      title: 'TESS Launches',
      description: 'NASA\'s Transiting Exoplanet Survey Satellite (TESS) launched to search for exoplanets around nearby bright stars.',
      type: 'mission',
      era: 'modern'
    },
    {
      id: 7,
      year: 2021,
      title: 'James Webb Space Telescope',
      description: 'JWST launched, promising to study exoplanet atmospheres in unprecedented detail, searching for signs of habitability and potential biosignatures.',
      type: 'mission',
      era: 'future'
    },
    {
      id: 8,
      year: 2024,
      title: '5000+ Exoplanets',
      description: 'The number of confirmed exoplanets surpasses 5,000, with many more candidates awaiting confirmation.',
      type: 'milestone',
      era: 'modern'
    },
    {
      id: 9,
      year: '2030s',
      title: 'Future Missions',
      description: 'Upcoming missions like ARIEL (ESA) and LUVOIR (proposed) aim to study exoplanet atmospheres and search for signs of life.',
      type: 'future',
      era: 'future'
    }
  ];

  const filteredEvents = activeEra === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(event => event.era === activeEra);

  const eras = [
    { id: 'all', label: 'All Eras' },
    { id: 'early', label: 'Early Discoveries (1990s)' },
    { id: 'modern', label: 'Modern Era (2000-2020s)' },
    { id: 'future', label: 'Future Exploration' }
  ];

  const eventTypes = {
    discovery: 'Discovery',
    mission: 'Mission',
    habitable: 'Habitable Zone',
    milestone: 'Milestone',
    future: 'Future'
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-test-400">Explore the History of Exoplanet Discovery</h2>
        <p className="text-gray-300 mb-6">
          Scroll through the timeline to learn about key moments in the search for planets beyond our solar system.
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {eras.map(era => (
            <button
              key={era.id}
              onClick={() => setActiveEra(era.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeEra === era.id 
                  ? 'bg-test-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 w-1 bg-test-500 h-full transform -translate-x-1/2"></div>
        
        <div className="space-y-12">
          {filteredEvents.map((event, index) => (
            <div 
              key={event.id}
              className={`relative flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`w-5/12 p-6 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-105 ${
                  selectedEvent === event.id 
                    ? 'ring-2 ring-test-400 bg-gray-800' 
                    : 'bg-gray-800/80 hover:bg-gray-800'
                }`}
                onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-test-400 font-bold">{event.year}</span>
                  <span className="text-sm px-2 py-1 rounded-full bg-test-900/50 text-test-300">
                    {eventTypes[event.type] || 'Event'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                
                {(selectedEvent === event.id || window.innerWidth > 768) && (
                  <p className="text-gray-300 text-sm">{event.description}</p>
                )}
                
                {event.image && (
                  <div className="mt-3">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>
              
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-test-500 border-4 border-gray-900"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-12 text-center text-sm text-gray-400">
        <p>Scroll to explore more events in the history of exoplanet discovery.</p>
        <p className="mt-2">
          Data sources: NASA Exoplanet Archive, NASA/JPL, and other scientific publications
        </p>
      </div>
    </div>
  );
};

export default ExoplanetTimeline;