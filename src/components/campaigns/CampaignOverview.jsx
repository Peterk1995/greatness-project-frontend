// src/components/campaigns/CampaignOverview.jsx

import React, { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaignService';
import { Gauge, Crown, Sword, CalendarDays, Scroll, Star } from 'lucide-react';
import TaskCompletionModal from './TaskCompletionModal';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

export function CampaignOverview() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null); // For task completion

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignService.getAll();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  // Handle task completion for a specific campaign
  const handleTaskCompletion = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const closeTaskCompletionModal = () => {
    setSelectedCampaign(null);
  };

  const updateCampaign = (updatedCampaign) => {
    setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
  };

  const getCampaignIcon = (type) => {
    switch (type) {
      case 'conquest':
        return <Sword className="w-6 h-6 text-blue-600" />;
      case 'cultural':
        return <Scroll className="w-6 h-6 text-green-600" />;
      case 'wisdom':
        return <Star className="w-6 h-6 text-yellow-600" />;
      case 'legacy':
        return <Crown className="w-6 h-6 text-purple-600" />;
      default:
        return <Crown className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="mt-4 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Campaign Overview</h2>
      {campaigns.length === 0 ? (
        <p className="text-gray-500">No campaigns found. Forge a new campaign!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => {
            const today = dayjs();
            const targetDate = dayjs(campaign.target_date);
            const daysLeft = targetDate.diff(today, 'day');

            return (
              <div key={campaign.id} className="bg-white p-6 rounded-lg shadow">
                {/* Title & Icon */}
                <div className="flex items-center mb-4">
                  {getCampaignIcon(campaign.campaign_type)}
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
                    <p className="text-gray-500 capitalize">{campaign.campaign_type.replace('_', ' ')} Campaign</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 italic mb-4">{campaign.description}</p>

                {/* Stats */}
                <div className="space-y-2">
                  {/* Progress */}
                  <div className="flex items-center">
                    <Gauge className="w-5 h-5 text-blue-600 mr-2" />
                    <div className="w-full">
                      <p className="text-sm text-gray-600">Progress: {campaign.current_xp} / {campaign.target_xp} XP</p>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${campaign.progress}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="flex items-center">
                    <Sword className="w-5 h-5 text-purple-600 mr-2" />
                    <p className="text-sm text-gray-600 capitalize">Difficulty: {campaign.difficulty}</p>
                  </div>

                  {/* Time Left */}
                  <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-sm text-gray-600">
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed!'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleTaskCompletion(campaign)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Complete Task
                  </button>
                  <Link
                    to={`/campaigns/${campaign.id}`}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Completion Modal */}
      {selectedCampaign && (
        <TaskCompletionModal 
          campaign={selectedCampaign}
          onClose={closeTaskCompletionModal}
          onTaskComplete={updateCampaign}
        />
      )}
    </div>
  );
}
