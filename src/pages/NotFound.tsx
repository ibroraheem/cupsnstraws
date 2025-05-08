import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Coffee } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <Coffee className="w-20 h-20 text-primary-600/40 mx-auto mb-6" />
        <h1 className="text-6xl font-display font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-6 rounded-md inline-flex items-center transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;