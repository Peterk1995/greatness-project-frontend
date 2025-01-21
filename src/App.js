// App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Shield,
  Sword,
  Map
} from 'lucide-react';

// Components
import { TaskList } from './components/tasks/TaskList';
import TimeTable from './components/timetable/TimeTable';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import VerifyEmail from './components/auth/VerifyEmail';
import RegistrationConfirmation from './components/auth/RegistrationConfirmation';
import { CampaignCreation } from './components/campaigns/CampaignCreation';
import { Dashboard } from './components/dashboard/Dashboard';
import { CampaignList } from './components/campaigns/CampaignList';
import CampaignDetail from './components/campaigns/CampaignDetail';
import Navigation from './components/navigation/Navigation';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Services
import { campaignService } from './services/campaignService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black">
        <div className="flex flex-col items-center">
          <Shield className="w-16 h-16 text-yellow-400 animate-pulse" />
          <div className="mt-4 text-yellow-400 font-bold">
            Preparing Your Command Center...
          </div>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Main App Content Component
function AppContent() {
  const { user, loading, logout } = useAuth();
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const handleSaveCampaign = async (campaignData) => {
    try {
      // Debug log to inspect campaign data before saving
      console.log('Creating campaign with data:', campaignData);
      
      // Create the campaign using the service (ensuring the status is "ongoing")
      const response = await campaignService.create({
        ...campaignData,
        status: 'ongoing'
      });
      console.log('Campaign created successfully:', response.data);
      
      // Close the campaign modal
      setShowCampaignModal(false);

      // If on the dashboard, refresh the page to update the campaign list
      if (window.location.pathname === '/app') {
        window.location.reload();
      }
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user && (
        <Navigation
          user={user}
          onLogout={logout}
          onShowCampaignModal={() => setShowCampaignModal(true)}
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/app" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/app" replace />}
        />
        <Route
          path="/registration-confirmation"
          element={<RegistrationConfirmation />}
        />
        <Route
          path="/email-verification/:key"
          element={<VerifyEmail />}
        />

        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <Dashboard />
                  <div className="mt-6">
                    <TimeTable />
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100 p-6">
                <CampaignList />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/campaigns/:id"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100 p-6">
                <CampaignDetail />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100 p-6">
                <TaskList />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to={user ? '/app' : '/login'} replace />}
        />
      </Routes>
      
      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <CampaignCreation
            onSave={handleSaveCampaign}
            onClose={() => setShowCampaignModal(false)}
          />
        </div>
      )}
    </div>
  );
}

// Root App Component with Providers
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
