// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { TimeTable } from './components/timetable/TimeTable';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import VerifyEmail from './components/auth/VerifyEmail';
import RegistrationConfirmation from './components/auth/RegistrationConfirmation';
import { authService } from './services/auth';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.validateToken()
        .then(response => {
          setUser({ username: 'Placeholder', id: response.data.user_id });
        })
        .catch(error => {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tempToken');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              !user ? (
                <Login onLoginSuccess={handleAuthSuccess} />
              ) : (
                <Navigate to="/app" replace />
              )
            } 
          />

          <Route 
            path="/register" 
            element={
              !user ? (
                <Register onRegisterSuccess={handleAuthSuccess} />
              ) : (
                <Navigate to="/app" replace />
              )
            } 
          />

          <Route 
            path="/registration-confirmation" 
            element={
              !user ? (
                <RegistrationConfirmation />
              ) : (
                <Navigate to="/app" replace />
              )
            } 
          />

          <Route 
            path="/email-verification/:key" 
            element={<VerifyEmail />} 
          />

          {/* Protected Routes */}
          <Route
            path="/app"
            element={
              user ? (
                <div className="min-h-screen bg-gray-100">
                  <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-between h-16">
                        <div className="flex items-center">
                          <h1 className="text-xl font-bold text-gray-900">
                            Imperial Organizer
                          </h1>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={handleLogout}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </nav>
                  <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <TimeTable />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to={user ? "/app" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;