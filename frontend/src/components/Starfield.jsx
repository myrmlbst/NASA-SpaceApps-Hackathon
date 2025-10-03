import { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // init stars
    const stars = [];
    const starCount = 200;
    const maxDistance = 1000;
    
    // create stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random(),
        pz: 0
      });
    }
    
    // animation loop
    let animationId;
    const animate = () => {
      ctx.fillStyle = '#0f172a'; // Dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // update and draw the stars
      stars.forEach(star => {
        star.pz = star.z;
        star.z -= 0.003;
        
        if (star.z <= 0) {
          star.x = Math.random() * 2 - 1;
          star.y = Math.random() * 2 - 1;
          star.z = 1;
          star.pz = 0;
        }
        
        // projecting star position
        const scale = 1 / star.z;
        const x = centerX + star.x * scale * 500;
        const y = centerY + star.y * scale * 500;
        
        // drawing star
        const size = 2 * (1 - star.z);
        const opacity = 1 - star.z;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // drawing star trail
        if (star.pz > 0) {
          const px = centerX + star.x * (1 / star.pz) * 500;
          const py = centerY + star.y * (1 / star.pz) * 500;
          
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
          ctx.lineWidth = size * 0.5;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    // handle window resize
    const handleResize = () => {
      resizeCanvas();
    };
    
    // initialize
    resizeCanvas();
    window.addEventListener('resize', handleResize);
    animate();
    
    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default Starfield;
