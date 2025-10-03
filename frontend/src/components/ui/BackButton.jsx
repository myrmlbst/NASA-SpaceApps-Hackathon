import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/#dashboard')}
      className="flex items-center text-test-400 hover:text-test-300 transition-colors duration-200 mb-6 group"
    >
      <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
      Back to Home Page
    </button>
  );
}

export default BackButton;
