import { useState } from 'react';
import { Button } from './ui/button';
import Starfield from './Starfield';
import Typewriter from './Typewriter';

function Hero() {
  const [showSubtitle, setShowSubtitle] = useState(false);
  
  const scrollToDashboard = () => {
    window.location.hash = 'dashboard';
    
    // smooth scroll to dashboard
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection) {
      dashboardSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div>
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-gray-950">
      <div className="max-w-4xl relative z-10">
      <Starfield /> 

      <div className="flex justify-center mb-8">
          <img 
            src="/src/images/logos/adastra-blue-logo.jpeg" 
            alt="AdAstra Logo" 
            className="h-22 w-22 rounded-full object-cover border-4 border-test-500"
          />
        </div>
        
        <h1 className="text-white text-6xl md:text-8xl font-bold mb-6 tracking-tight">
          <Typewriter 
            text="A World Away"
            speed={100}
            onComplete={() => setShowSubtitle(true)}
          />
        </h1>

        {showSubtitle && (
          <h2 className="text-2xl md:text-4xl text-gray-300 mb-12 font-light">
            <Typewriter 
              text="Hunting for Exoplanets"
              speed={50}
              className="inline-block"
            />
          </h2>
        )}

        <Button 
          size="lg" 
          style={{cursor: 'pointer'}}
          onClick={scrollToDashboard}
          className="relative z-20 bg-test-500 hover:bg-test-600 transition-colors duration-300 transform hover:scale-105"
        >
          Explore the Cosmos
          <span className="absolute -inset-0.5 bg-white/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></span>
        </Button>

      </div>
      
      {/* pixelated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <div className="flex flex-col items-center animate-bounce">
            <div className="flex">
              <div className="w-2 h-2 bg-white m-px"></div>
              <div className="w-2 h-2 bg-white m-px"></div>
            </div>
            <div className="w-2 h-2 bg-white m-px"></div>
          </div>
          
          <style jsx>{`
            .pixel-arrow {
              image-rendering: pixelated;
              image-rendering: -moz-crisp-edges;
              image-rendering: crisp-edges;
            }
          `}</style>
        </div>
      </div>

    </section>

    {/* gradient background at the bottom of the hero section */}
      <div className='w-full bg-linear-to-t from-slate-950 to-black h-64'>
        ‎
      </div>

      </div>
  )
}

export default Hero
