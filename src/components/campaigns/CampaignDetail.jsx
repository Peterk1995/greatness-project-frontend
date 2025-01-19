// src/components/campaigns/CampaignDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { Gauge, Sword, CalendarDays, Star, Crown, ArrowLeft } from 'lucide-react';
import TaskCompletionModal from './TaskCompletionModal';
import dayjs from 'dayjs';

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Wrap fetchCampaign with useCallback so that it can be safely added to useEffect's dependency array.
  const fetchCampaign = useCallback(async () => {
    try {
      const response = await campaignService.get(id);
      setCampaign(response.data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  // Called when the "Complete Task" button is clicked:
  const handleTaskCompletion = () => {
    setShowTaskModal(true);
  };

  // This callback is passed as onSubmit (Option 1) to TaskCompletionModal
  // It will update the campaign's state with the new progress data.
  const handleSubmit = (updatedData) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      progress: updatedData.campaign_progress,
      current_xp: updatedData.current_xp,
    }));
    setShowTaskModal(false);
  };

  const handleCancel = () => {
    setShowTaskModal(false);
  };

  const getCampaignIcon = (type) => {
    switch (type) {
      case 'conquest':
        return <Sword className="w-6 h-6 text-blue-600" />;
      case 'cultural':
        return <Crown className="w-6 h-6 text-green-600" />;
      case 'wisdom':
        return <Star className="w-6 h-6 text-yellow-600" />;
      case 'legacy':
        return <Crown className="w-6 h-6 text-purple-600" />;
      default:
        return <Crown className="w-6 h-6 text-gray-600" />;
    }
  };

  if (loading) {
    return <div className="text-center">Loading campaign details...</div>;
  }

  if (!campaign) {
    return <div className="text-center text-red-600">Campaign not found.</div>;
  }

  const today = dayjs();
  const targetDate = dayjs(campaign.target_date);
  const daysLeft = targetDate.diff(today, 'day');

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Header with Return Button */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/app" className="flex items-center text-blue-600 hover:text-blue-700 transition">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-semibold">Return to Battle Planning</span>
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Campaign Details</h2>
      </div>

      {/* Campaign Title & Icon */}
      <div className="flex items-center mb-4">
        {getCampaignIcon(campaign.campaign_type)}
        <div className="ml-4">
          <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
          <p className="text-gray-500 capitalize">
            {campaign.campaign_type.replace('_', ' ')} Campaign
          </p>
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
            <p className="text-sm text-gray-600">
              Progress: {campaign.current_xp} / {campaign.target_xp} XP
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${campaign.progress}%` }}
              ></div>
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
      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleTaskCompletion}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Complete Task
        </button>
      </div>

      {/* Task Completion Modal */}
      {showTaskModal && (
        <TaskCompletionModal
          task={campaign} 
          campaigns={null}  // Pass campaign data if needed; otherwise, null
          onSubmit={handleSubmit}
          onClose={handleCancel}
        />
      )}
    </div>
  );
}
