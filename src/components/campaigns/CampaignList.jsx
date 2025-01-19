import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { Sword, Crown, Star, Gauge, CalendarDays, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import CampaignDeleteModal from './CampaignDeleteModal';

export const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

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

  const getCampaignIcon = (type) => {
    switch (type) {
      case 'conquest':
        return <Sword className="w-6 h-6 text-blue-600" />;
      case 'legacy':
        return <Crown className="w-6 h-6 text-purple-600" />;
      case 'wisdom':
        return <Star className="w-6 h-6 text-yellow-600" />;
      default:
        return <Crown className="w-6 h-6 text-gray-600" />;
    }
  };

  const calculateDaysLeft = (targetDate) => {
    const today = dayjs();
    const target = dayjs(targetDate);
    const daysLeft = target.diff(today, 'day');
    return daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed!';
  };

  const handleDeleteClick = (campaignId) => {
    setCampaignToDelete(campaignId);
  };

  const handleDeleteConfirm = async () => {
    try {
      await campaignService.delete(campaignToDelete);
      setCampaigns(campaigns.filter(campaign => campaign.id !== campaignToDelete));
      setCampaignToDelete(null);
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleDeleteCancel = () => {
    setCampaignToDelete(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Active Campaigns</h2>
      {campaigns.length === 0 ? (
        <p className="text-gray-500">No campaigns found. Start your first campaign!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white p-4 rounded-lg shadow relative">
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteClick(campaign.id)}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Delete campaign"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              {/* Campaign Header */}
              <div className="flex items-center mb-4">
                {getCampaignIcon(campaign.campaign_type)}
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{campaign.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {campaign.campaign_type.replace('_', ' ')} Campaign
                  </p>
                </div>
              </div>

              {/* Campaign Description */}
              <p className="text-gray-700 italic mb-4">{campaign.description}</p>

              {/* Campaign Stats */}
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

                {/* Days Left */}
                <div className="flex items-center">
                  <CalendarDays className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-sm text-gray-600">{calculateDaysLeft(campaign.target_date)}</p>
                </div>
              </div>

              {/* View Details Button */}
              <div className="mt-4">
                <Link
                  to={`/campaigns/${campaign.id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {campaignToDelete && (
        <CampaignDeleteModal
          campaignId={campaignToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};