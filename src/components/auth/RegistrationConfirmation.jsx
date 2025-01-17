// RegistrationConfirmation.jsx
import React from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegistrationConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="h-16 w-16 text-blue-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Your Empire Awaits!
          </h1>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="animate-pulse flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-500"></div>
            </div>
            <p className="text-lg text-gray-700 mb-2">
              Your journey to greatness has begun!
            </p>
            <p className="text-gray-600">
              We have dispatched a sacred scroll (verification email) to your message vault. 
              Check your email and click the verification link to begin your conquest.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-500">
              While you await the sacred scroll's arrival, prepare yourself for:
            </p>
            <ul className="text-left text-gray-600 space-y-2 pl-4">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Strategic battle planning</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Resource management mastery</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Empire expansion tactics</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Leadership development</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Haven't received the sacred scroll?</p>
            <button 
              onClick={() => navigate('/login')} 
              className="mt-4 text-blue-600 hover:text-blue-700 underline"
            >
              Return to the gates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;