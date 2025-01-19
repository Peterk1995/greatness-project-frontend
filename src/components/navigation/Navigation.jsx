// Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Calendar, Sword, Map } from 'lucide-react';

const Navigation = ({ user, onLogout, onShowCampaignModal }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg border-b border-blue-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side with logo (home button) and welcome message */}
          <div className="flex items-center">
            <Link
              to="/app"
              className="flex items-center mr-6 group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <Shield className="w-8 h-8 text-blue-400 transition-transform group-hover:rotate-12" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="ml-2 font-greek text-lg text-blue-300 font-semibold">
                Olympian Sanctuary
              </span>
            </Link>
            <span className="text-sm text-blue-300/60">
              Hail, {user?.username}
            </span>
          </div>
          
          {/* Right side navigation items */}
          <div className="flex items-center space-x-4">
            <Link
              to="/tasks"
              className="inline-flex items-center px-4 py-2 border border-blue-400/30 text-sm font-medium rounded-md text-blue-300 bg-blue-900 hover:bg-blue-800 transition-colors shadow-sm"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Battle Schedule
            </Link>

            <Link
              to="/campaigns"
              className="inline-flex items-center px-4 py-2 border border-blue-400/30 text-sm font-medium rounded-md text-blue-300 bg-blue-900 hover:bg-blue-800 transition-colors shadow-sm"
            >
              <Sword className="w-5 h-5 mr-2" />
              Active Campaigns
            </Link>

            <button
              onClick={onShowCampaignModal}
              className="inline-flex items-center px-4 py-2 border border-blue-400/30 text-sm font-medium rounded-md text-blue-300 bg-blue-900 hover:bg-blue-800 transition-colors shadow-sm"
            >
              <Map className="w-5 h-5 mr-2" />
              Plan New Campaign
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-blue-400 text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400 transition-colors shadow-sm"
            >
              Retreat
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
