import React, { useState } from 'react';
import { Scroll, Sword, Crown, Star, Trophy, Calendar, Target, Clock } from 'lucide-react';

export const CampaignCreation = ({ onSave, onClose }) => {
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    difficulty: 'major',
    estimated_hours: '',
    // Use today's date as initial, or modify as needed
    start_date: new Date().toISOString().split('T')[0],
    target_date: '',
    campaign_type: 'conquest'
  });

  const CAMPAIGN_TYPES = [
    { 
      id: 'conquest', 
      label: 'Territorial Conquest', 
      icon: Sword,
      description: 'Military campaigns and strategic victories'
    },
    { 
      id: 'cultural', 
      label: 'Cultural Mastery', 
      icon: Scroll,
      description: 'Language, arts, and cultural achievements'
    },
    { 
      id: 'wisdom', 
      label: 'Knowledge Quest', 
      icon: Star,
      description: 'Studies, skills, and personal development'
    },
    { 
      id: 'legacy', 
      label: 'Empire Legacy', 
      icon: Crown,
      description: 'Long-term empire building goals'
    }
  ];

  const DIFFICULTY_LEVELS = [
    { 
      id: 'legendary', 
      label: 'Legendary Quest', 
      xp: '100x XP',
      color: 'bg-purple-100 border-purple-300'
    },
    { 
      id: 'epic', 
      label: 'Epic Campaign', 
      xp: '50x XP',
      color: 'bg-red-100 border-red-300'
    },
    { 
      id: 'major', 
      label: 'Major Undertaking', 
      xp: '25x XP',
      color: 'bg-yellow-100 border-yellow-300'
    },
    { 
      id: 'minor', 
      label: 'Minor Quest', 
      xp: '10x XP',
      color: 'bg-blue-100 border-blue-300'
    }
  ];

  // 2) Called when user hits "Launch Campaign" or "Decree it" in your wording.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
        ...campaign,
        status: 'ongoing'  // ensure newly created campaign is "in progress"
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Forge Your Grand Campaign
          </h2>
          <p className="text-blue-100 mt-1">Define the path to eternal glory</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Campaign Title */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-800">
              Title of Your Campaign
            </label>
            <input
              type="text"
              value={campaign.title}
              onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Master the Persian Language"
              required
            />
          </div>

          {/* Campaign Type Selection */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-800">
              Nature of Campaign
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAMPAIGN_TYPES.map(({ id, label, icon: Icon, description }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCampaign({ ...campaign, campaign_type: id })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    campaign.campaign_type === id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`h-6 w-6 ${
                        campaign.campaign_type === id ? 'text-blue-500' : 'text-gray-500'
                      }`}
                    />
                    <div>
                      <div className="font-semibold">{label}</div>
                      <div className="text-sm text-gray-600">{description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Description */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-800">
              Strategic Overview
            </label>
            <textarea
              value={campaign.description}
              onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              placeholder="Detail your grand vision and objectives..."
              required
            />
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-800">
              Campaign Magnitude
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DIFFICULTY_LEVELS.map(({ id, label, xp, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCampaign({ ...campaign, difficulty: id })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    campaign.difficulty === id
                      ? `${color} border-current`
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold">{label}</div>
                  <div className="text-sm text-gray-600">{xp}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Estimation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Estimated Hours
              </label>
              <input
                type="number"
                value={campaign.estimated_hours}
                onChange={(e) =>
                  setCampaign({ ...campaign, estimated_hours: e.target.value })
                }
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="100"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Start Date
              </label>
              <input
                type="date"
                value={campaign.start_date}
                onChange={(e) =>
                  setCampaign({ ...campaign, start_date: e.target.value })
                }
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Target Completion
              </label>
              <input
                type="date"
                value={campaign.target_date}
                onChange={(e) =>
                  setCampaign({ ...campaign, target_date: e.target.value })
                }
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}  // "Retreat" closes the modal
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Retreat
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
            >
              Decree It
              {/* or "Launch Campaign" */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
