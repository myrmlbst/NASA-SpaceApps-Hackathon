import React, { useState } from 'react';

const HabitableCalculator = () => {
  const [distance, setDistance] = useState(1.0);
  const [starTemp, setStarTemp] = useState(5780); // Sun's temperature in Kelvin
  const [planetMass, setPlanetMass] = useState(1.0); // Earth masses
  const [planetRadius, setPlanetRadius] = useState(1.0); // Earth radii

  // Calculate habitable zone boundaries (simplified)
  const calculateHabitableZone = (starTemp) => {
    // Very simplified habitable zone calculation
    const sunTemp = 5780; // Kelvin
    const sunHabitableInner = 0.95; // AU
    const sunHabitableOuter = 1.37; // AU
    
    // Scale based on star temperature (simplified)
    const ratio = Math.pow(starTemp / sunTemp, 2);
    return {
      inner: (sunHabitableInner * ratio).toFixed(2),
      outer: (sunHabitableOuter * ratio).toFixed(2)
    };
  };

  // Calculate surface gravity (Earth = 1)
  const surfaceGravity = (mass, radius) => {
    return (mass / (radius * radius)).toFixed(2);
  };

  // Calculate equilibrium temperature (simplified)
  const equilibriumTemp = (starTemp, distance) => {
    // Using simplified black body temperature formula
    const sigma = 5.67e-8; // Stefan-Boltzmann constant
    const luminosity = Math.pow(starTemp / 5780, 4); // Relative to Sun
    const distanceInAU = distance * 1.496e11; // Convert AU to meters
    const solarConstant = 1361; // W/m² at Earth's distance
    const flux = (luminosity * solarConstant) / Math.pow(distance, 2);
    return Math.pow(flux / (4 * sigma), 0.25).toFixed(0);
  };

  // determine habitability
  const isHabitable = () => {
    const habZone = calculateHabitableZone(starTemp);
    const temp = equilibriumTemp(starTemp, distance);
    const gravity = surfaceGravity(planetMass, planetRadius);
    
    // habitability check
    const inHabitableZone = distance >= habZone.inner && distance <= habZone.outer;
    const reasonableGravity = gravity >= 0.5 && gravity <= 2.0;
    const reasonableTemp = temp > 200 && temp < 350; // Kelvin
    
    return inHabitableZone && reasonableGravity && reasonableTemp;
  };

  const habZone = calculateHabitableZone(starTemp);
  const gravity = surfaceGravity(planetMass, planetRadius);
  const temp = equilibriumTemp(starTemp, distance);
  const habitable = isHabitable();

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-test-400 text-center">Is It Habitable? Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Distance from Star: {distance} AU
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.1 AU</span>
              <span>5 AU</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Star Temperature: {starTemp} K
            </label>
            
            <input
              type="range"
              min="2500"
              max="10000"
              step="100"
              value={starTemp}
              onChange={(e) => setStarTemp(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>2500K (Red Dwarf)</span>
              <span>10000K (Blue Star)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Planet Mass: {planetMass} Earth masses
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={planetMass}
              onChange={(e) => setPlanetMass(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.1x Earth</span>
              <span>10x Earth</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Planet Radius: {planetRadius} Earth radii
            </label>
            <input
              type="range"
              min="0.5"
              max="4"
              step="0.1"
              value={planetRadius}
              onChange={(e) => setPlanetRadius(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.5x Earth</span>
              <span>4x Earth</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold mb-2 ${
              habitable ? 'text-green-400' : 'text-red-400'
            }`}>
              {habitable ? 'POTENTIALLY HABITABLE' : 'NOT HABITABLE'}
            </div>
            <div className="text-sm text-gray-400">
              Based on current parameters
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Habitable Zone</span>
                <span className="font-mono">{habZone.inner} - {habZone.outer} AU</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-test-500 h-2.5 rounded-full" 
                  style={{ 
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  <div 
                    className="absolute h-3 w-0.5 bg-green-400 -top-0.5" 
                    style={{ left: `${(habZone.inner / 5) * 100}%` }}
                  ></div>
                  <div 
                    className="absolute h-3 w-0.5 bg-red-500 -top-0.5" 
                    style={{ left: `${(habZone.outer / 5) * 100}%` }}
                  ></div>
                  <div 
                    className={`absolute h-4 w-1 -top-1 ${distance >= habZone.inner && distance <= habZone.outer ? 'bg-green-400' : 'bg-red-500'}`} 
                    style={{ left: `${(distance / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1 flex justify-between">
                  <span>0 AU</span>
                  <span>5 AU</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-xs text-gray-400">Equilibrium Temp</div>
                <div className="text-lg font-mono">{temp} K</div>
                <div className="text-xs text-gray-500">
                  {temp > 373 ? 'Too Hot' : temp > 273 ? 'Liquid water possible' : 'Too Cold'}
                </div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-xs text-gray-400">Surface Gravity</div>
                <div className="text-lg font-mono">{gravity} g</div>
                <div className="text-xs text-gray-500">
                  {gravity < 0.5 ? 'Too Low' : gravity > 2 ? 'Too High' : 'Earth-like'}
                </div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-xs text-gray-400">Star Type</div>
                <div className="text-lg">
                  {starTemp < 3500 ? 'M-type (Red Dwarf)' :
                   starTemp < 5000 ? 'K-type (Orange Dwarf)' :
                   starTemp < 6000 ? 'G-type (Sun-like)' :
                   starTemp < 7500 ? 'F-type' : 'A-type or hotter'}
                </div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-xs text-gray-400">Planet Type</div>
                <div className="text-lg">
                  {planetRadius < 1.5 ? 'Terrestrial' :
                   planetRadius < 4 ? 'Mini-Neptune' : 'Gas Giant'}
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <p className="mb-2">Habitability depends on many factors. This is a simplified model.</p>
              <p>For reference: Earth = 1 AU, 1 Earth mass, 1 Earth radius</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitableCalculator;
