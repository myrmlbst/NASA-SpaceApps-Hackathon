import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Hero from "./components/Hero.jsx";
import Dashboard from "./components/Dashboard";
import AboutModel from "./pages/AboutModel";
import Playground from "./pages/Playground";
import ForResearchers from "./pages/ForResearchers";

function App() {
  useEffect(() => {
    const handleHashChange = () => {
      const { hash } = window.location;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <Router>
      <Routes>
        
        <Route path="/" element={
          <div className="min-h-screen">
            <Hero />
            <Dashboard />
          </div>
        } />
        <Route path="/about-model" element={<AboutModel />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/machine-learning-model" element={<ForResearchers />} />

      </Routes>
    </Router>
  );
}

export default App;
