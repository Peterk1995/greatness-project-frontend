import React, { useState } from 'react';
import { Scroll, Sword, Crown, Star, Trophy, Calendar, Target, Clock } from 'lucide-react';

export const CampaignCreation = ({ onSave, onClose }) => {
  // Initial state for the campaign
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    difficulty: 'major',
    estimated_hours: '',
    start_date: new Date().toISOString().split('T')[0],
    target_date: '',
    campaign_type: 'conquest'
  });

  // Define available campaign types
  const CAMPAIGN_TYPES = [
    { 
      id: 'conquest', 
      label: 'Territorial Conquest', 
      icon: Sword,
      description: 'Strategic victories and expansion of influence'
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

  // Define difficulty levels (using an hour-based system)
  const DIFFICULTY_LEVELS = [
    {
      id: 'legendary',
      label: 'Legendary Ergon (ἔργον)',
      description: 'A deed worthy of song! (100+ hṓrai)',
      color: 'bg-purple-100 border-purple-300'
    },
    {
      id: 'epic',
      label: 'Epic Agon (ἀγών)',
      description: 'A mighty contest! (50+ hṓrai)',
      color: 'bg-red-100 border-red-300'
    },
    {
      id: 'major',
      label: 'Great Ponos (πόνος)',
      description: 'Requires significant toil (25+ hṓrai)',
      color: 'bg-yellow-100 border-yellow-300'
    },
    {
      id: 'minor',
      label: 'Swift Stadion (στάδιον)',
      description: 'A short but intense effort (Up to 25 hṓrai)',
      color: 'bg-blue-100 border-blue-300'
    }
  ];

  // New feature: Thresholds and default hours per difficulty.
  const DIFFICULTY_THRESHOLDS = {
    legendary: 100,  // 100+ hours
    epic: 50,        // 50-99 hours
    major: 25,       // 25-49 hours
    minor: 0         // 0-24 hours
  };

  const defaultHours = {
    legendary: 100,
    epic: 50,
    major: 25,
    minor: 10
  };

  // Auto-set hours when a difficulty is selected
  const handleDifficultySelect = (selectedDifficulty) => {
    setCampaign({
      ...campaign,
      difficulty: selectedDifficulty,
      estimated_hours: defaultHours[selectedDifficulty]
    });
  };

  // Auto-adjust difficulty based on manually entered hours
  const handleHoursChange = (hours) => {
    const numHours = parseInt(hours, 10);
    let newDifficulty = 'minor';

    if (numHours >= DIFFICULTY_THRESHOLDS.legendary) {
      newDifficulty = 'legendary';
    } else if (numHours >= DIFFICULTY_THRESHOLDS.epic) {
      newDifficulty = 'epic';
    } else if (numHours >= DIFFICULTY_THRESHOLDS.major) {
      newDifficulty = 'major';
    }

    setCampaign({
      ...campaign,
      estimated_hours: hours,
      difficulty: newDifficulty
    });
  };

  // Helper function for hours input description
  const renderHoursHelp = () => (
    <p className="text-sm text-gray-600 mt-1">
      Your estimated hours directly determine campaign completion.{" "}
      {campaign.difficulty === 'legendary' && 
        "Perfect execution can accelerate progress by up to 20%."}
    </p>
  );

  // Called when the user submits the form (e.g., "Decree It")
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting campaign:', campaign);  // Debug log
    
    // Create the campaign data object
    const campaignData = {
      ...campaign,
      status: 'ongoing',
      // Ensure all required fields are included
      title: campaign.title,
      description: campaign.description,
      campaign_type: campaign.campaign_type,
      difficulty: campaign.difficulty,
      estimated_hours: parseInt(campaign.estimated_hours),
      start_date: campaign.start_date,
      target_date: campaign.target_date
    };
  
    // Call onSave with the campaign data
    onSave(campaignData);
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
              {DIFFICULTY_LEVELS.map(({ id, label, description, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleDifficultySelect(id)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    campaign.difficulty === id
                      ? `${color} border-current`
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold">{label}</div>
                  <div className="text-sm text-gray-600">{description}</div>
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
                // Use handleHoursChange to auto-adjust difficulty based on the entered hours
                onChange={(e) => handleHoursChange(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="100"
                required
              />
              {renderHoursHelp()}
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
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
