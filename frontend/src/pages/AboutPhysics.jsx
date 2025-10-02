import React from 'react';

import BackButton from '../components/ui/BackButton';

function AboutPhysics() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
      <div className="container mx-auto">
        <BackButton />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-test-500">The Physics Behind It</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Learn about the physics that powers our machine learning model.
          </p>
          <div className="w-full max-w-3xl h-1 bg-test-500 mx-auto my-4"></div>
        </div>
        
        <div className="prose prose-invert max-w-7xl">
      
          <p className="mb-4">
            The search for planets beyond our solar system — exoplanets — has fascinated astronomers for centuries, but the first confirmed detection came only in 1992, when planets were found orbiting a pulsar. The first planet around a Sun-like star was discovered in 1995 (51 Pegasi b), marking the beginning of a revolution in astronomy.
          </p>
          <p className="mb-6">
            Initially, astronomers relied on the radial velocity method, measuring the wobble of a star caused by an orbiting planet using the Doppler effect. However, this method favored massive planets close to their stars. The transit method, which revolutionized exoplanet detection, emerged as technology improved. Space telescopes like Kepler (2009) and TESS (2018) allowed astronomers to continuously monitor thousands of stars for tiny dips in brightness caused by planets passing in front of them.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">How Exoplanets Cause Dips in Starlight</h3>
          <p className="mb-4">
            When a planet crosses (or transits) its star as seen from Earth, it blocks a small fraction of the star's light. This produces a light curve — a graph of stellar brightness (flux) versus time — with a characteristic dip:
          </p>
          <div className="bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto">
            <code>∆F = (F<sub>baseline</sub> - F<sub>min</sub>) / F<sub>baseline</sub></code>
          </div>
          <p className="mb-2">
            where F<sub>baseline</sub> is the star's normal flux and F<sub>min</sub> is the flux at the bottom of the transit.
          </p>
          <p className="mb-4">
            The duration of the transit can be estimated as: <code>Duration = t<sub>end</sub> - t<sub>start</sub></code>
          </p>
          <p className="mb-2">The shape of the dip also contains valuable information:</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>U-shaped dips → typical of planets (flat bottom, symmetrical)</li>
            <li>V-shaped dips → often indicate grazing eclipsing binaries or stellar activity</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">Why Detecting Small Planets is Hard</h3>
          <p className="mb-4">
            The signal strength depends on the ratio of the planet's size to the star's size:
          </p>
          <div className="bg-gray-800 p-4 rounded-lg my-4">
            <code>∆F ≈ (R<sub>p</sub>/R<sub>s</sub>)<sup>2</sup></code>
          </div>
          <p className="mb-6">
            where R<sub>p</sub> is the planet radius and R<sub>s</sub> is the star radius. Small planets produce extremely tiny dips, often less than 0.01%, which are comparable to instrumental noise or fluctuations caused by stellar variability. As a result, detecting small planets requires precise instruments, long observation times, and careful data analysis.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Why False Positives Occur</h3>
          <p className="mb-2">Not every dip signals a planet. Common sources of false positives include:</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li><strong>Eclipsing binaries</strong> — two stars orbiting each other produce periodic dips</li>
            <li><strong>Background stars / blended sources</strong> — faint binaries aligned along the line of sight</li>
            <li><strong>Stellar variability</strong> — starspots, pulsations, flares</li>
            <li><strong>Instrumental noise</strong> — detector imperfections or cosmic rays</li>
          </ul>
          <p className="mb-6">
            Some dips are physically impossible for planets when the dip size or shape would imply an unreasonably large planet or transit duration inconsistent with orbital mechanics.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">When is a Transit Dip Physically Plausible?</h3>
          <p className="mb-4">
            To test whether a dip is physically plausible, astronomers rely on orbital mechanics and stellar physics.
          </p>
          
          <h4 className="font-semibold mt-4 mb-2">Transit Depth and Planet Size</h4>
          <p className="mb-4">
            The transit depth tells us how much of the star's surface is blocked:
          </p>
          <div className="bg-gray-800 p-4 rounded-lg my-4">
            <code>∆F ≈ (R<sub>p</sub>/R<sub>s</sub>)<sup>2</sup></code>
          </div>
          <p className="mb-6">
            If the dip suggests a planet radius R<sub>p</sub> comparable to or larger than the star itself, the dip cannot be caused by a planet.
          </p>

          <h4 className="font-semibold mt-6 mb-2">Transit Duration and Orbital Mechanics</h4>
          <p className="mb-2">
            The duration of the dip must be consistent with Kepler's Third Law:
          </p>
          <div className="bg-gray-800 p-4 rounded-lg my-4">
            <code>P<sup>2</sup> = (4π<sup>2</sup>a<sup>3</sup>) / (G(M<sub>s</sub> + M<sub>p</sub>))</code>
          </div>
          <p className="mb-2">
            For a circular orbit, the transit duration is approximately:
          </p>
          <div className="bg-gray-800 p-4 rounded-lg my-4">
            <code>T ≈ R<sub>s</sub>/v, where v = √(GM<sub>s</sub>/a)</code>
          </div>
          <p className="mb-6">
            If the observed dip lasts much longer or shorter than the mechanics allow, it is not physically plausible.
          </p>

          <h4 className="font-semibold mt-6 mb-2">Symmetry of the Dip</h4>
          <p className="mb-6">
            Planetary transits are usually symmetric. A strongly asymmetric dip often points to stellar activity or instrumental error rather than a planet.
          </p>

          <h4 className="font-semibold mt-6 mb-2">Density Constraints</h4>
          <p className="mb-6">
            By combining transit data and stellar parameters, the density of the transiting body can be estimated. If it falls outside known planetary ranges (e.g., gas giants ∼ 0.1–2 g/cm<sup>3</sup>, rocky planets ∼ 3–8 g/cm<sup>3</sup>), the dip is likely not due to a planet.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Why Extra Parameters Improve Detection</h3>
          <p className="mb-4">
            Adding stellar parameters and derived transit features improves classification:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Stellar parameters (temperature, radius, mass, log g, metallicity) ensure the transit is physically plausible</li>
            <li>Derived features (depth, duration, shape metrics) summarize time-series data, making ML models more accurate and interpretable</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">Worked Example: Earth vs Jupiter</h3>
          <p className="mb-2">
            For a Sun-like star:<br />
            R<sub>☉</sub> = 696,000 km, R<sub>⊕</sub> = 6,371 km, R<sub>J</sub> = 71,492 km
          </p>
          <p className="mb-2">
            <strong>Transit Depths:</strong>
          </p>
          <div className="bg-gray-800 p-4 rounded-lg my-4">
            <div>Earth: ∆F<sub>⊕</sub> ≈ (R<sub>⊕</sub>/R<sub>☉</sub>)<sup>2</sup> ≈ 8.4 × 10<sup>-5</sup> (0.008%)</div>
            <div>Jupiter: ∆F<sub>J</sub> ≈ (R<sub>J</sub>/R<sub>☉</sub>)<sup>2</sup> ≈ 0.0106 (1.06%)</div>
          </div>
          <p className="mb-6">
            Thus, Earth-like planets produce a dip of only 0.008%, requiring extreme sensitivity, while Jupiter-like planets produce a dip over 1%, much easier to detect.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Conclusion</h3>
          <p className="mb-6">
            By continuously monitoring stellar brightness, space telescopes measure light curves that reveal tiny periodic dips. These dips, when interpreted with stellar properties and transit features, allow astronomers to detect exoplanets, even amid noise and false positives. The physics of transit depth, duration, and orbital mechanics, combined with stellar parameters, ensures that only physically plausible signals are classified as exoplanets.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default AboutPhysics;
