// components/auth/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '../../services/auth';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying');
  const { key } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(key);
        setStatus('success');
        // Wait 3 seconds before redirecting
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        // Even if we get an error, check if it's actually verified
        if (error.response?.status === 404) {
          // This might mean it's already verified
          setStatus('success');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          console.error('Verification error:', error);
          setStatus('error');
        }
      }
    };

    verifyEmail();
  }, [key, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <Shield className="h-16 w-16 text-blue-500 animate-pulse" />
            <h2 className="text-2xl font-bold mt-4">Confirming Your Imperial Destiny...</h2>
            <p className="text-gray-600 mt-2">Stand by as we validate your credentials</p>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold mt-4">Your Destiny is Secured!</h2>
            <p className="text-gray-600 mt-2">
              Your email has been verified. Redirecting you to the gates of empire...
            </p>
          </>
        );
      case 'error':
        return (
          <>
            <XCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold mt-4">A Minor Setback</h2>
            <p className="text-gray-600 mt-2">
              Fear not, your account may still be verified. Try logging in!
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Proceed to Login
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default VerifyEmail;