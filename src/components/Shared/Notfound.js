import React from 'react';
import { useNavigate } from 'react-router-dom';
import notFoundImage from '../../assests/svg/notFound.svg'; // replace with your image path

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img src={notFoundImage} alt="Not Found" className="w-64 h-64" />
      <h1 className="text-2xl font-bold text-gray-700 mt-4">404 - Not Found</h1>
      <button 
        onClick={() => navigate('/')} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return Home
      </button>
    </div>
  );
};

export default NotFound;