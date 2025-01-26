import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sword, Scroll, Star, Crown } from "lucide-react";
import { campaignService } from "../../services/campaignService";

// Domain-specific styles and content
const DOMAIN_CONFIGS = {
  conquest: {
    icon: Sword,
    iconColor: "text-red-500",
    gradientFrom: "from-red-600",
    gradientTo: "to-red-700",
    completionQuote: "Victory belongs to those who persevere.",
    buttonText: "Claim Victory"
  },
  wisdom: {
    icon: Star,
    iconColor: "text-yellow-500",
    gradientFrom: "from-yellow-600",
    gradientTo: "to-yellow-700",
    completionQuote: "Wisdom crowns those who seek it.",
    buttonText: "Attain Wisdom"
  },
  cultural: {
    icon: Scroll,
    iconColor: "text-green-500",
    gradientFrom: "from-green-600",
    gradientTo: "to-green-700",
    completionQuote: "Culture shapes the destiny of nations.",
    buttonText: "Establish Legacy"
  },
  legacy: {
    icon: Crown,
    iconColor: "text-purple-500",
    gradientFrom: "from-purple-600",
    gradientTo: "to-purple-700",
    completionQuote: "Your legacy shall echo through eternity.",
    buttonText: "Cement Legacy"
  }
};

const CompleteCampaignModal = ({ isOpen, onClose, onConfirm, campaign }) => {
  const [reflections, setReflections] = useState("");

  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-md border border-gray-700 shadow-xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
          aria-label="Close Modal"
        >
          ✕
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-300 mb-2">
            Complete <span className="underline">{campaign.title}</span>
          </h2>
          <p className="text-sm text-gray-300 italic mb-4">
            “Let your words be the final strokes in the annals of this campaign.”
          </p>

          <label className="block mb-2 text-gray-300 font-semibold">
            Your Epic Reflections
          </label>
          <textarea
            value={reflections}
            onChange={(e) => setReflections(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-md bg-gray-800 text-gray-100 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Share your concluding thoughts, triumphant moments, or lessons learned..."
          />

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(reflections)}
              className={`px-5 py-2 rounded-md bg-gradient-to-r 
                ${DOMAIN_CONFIGS[campaign.campaign_type].gradientFrom} 
                ${DOMAIN_CONFIGS[campaign.campaign_type].gradientTo} 
                hover:brightness-110 text-white font-semibold`}
            >
              {DOMAIN_CONFIGS[campaign.campaign_type].buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getCampaignIcon = (type) => {
  // Use the domain config to determine the icon and its color.
  const config = DOMAIN_CONFIGS[type];
  if (config) {
    const IconComponent = config.icon;
    return <IconComponent className={`w-6 h-6 ${config.iconColor}`} />;
  }
  return <Crown className="w-6 h-6 text-gray-600" />;
};

const CampaignsSection = ({ campaigns, fetchData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const openCompletionModal = (campaign) => {
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const handleConfirmCompletion = async (reflections) => {
    if (!selectedCampaign) return;
    try {
      await campaignService.completeCampaign(selectedCampaign.id, { reflections });
      setModalOpen(false);
      setSelectedCampaign(null);
      fetchData();
    } catch (error) {
      console.error("Error completing campaign:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Crown className="h-6 w-6" />
        Your Glorious Campaigns
      </h2>

      <CompleteCampaignModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCompletion}
        campaign={selectedCampaign}
      />

      {campaigns.length === 0 ? (
        <p className="text-blue-200 text-center py-8 italic">
          "Great achievements await their architect." - Ancient Greek Wisdom
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => {
            const hoursDone = campaign.total_raw_hours
              ? Math.round(campaign.total_raw_hours)
              : Math.round((campaign.progress / 100) * campaign.estimated_hours);

            // Use the ready_for_completion flag from the API response
            const canComplete = campaign.ready_for_completion;

            const pendingTasks = campaign.time_slots
              ? campaign.time_slots.filter((t) => t.status !== "completed")
              : [];

            return (
              <div
                key={campaign.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-blue-400/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-900/50 rounded-lg">
                    {getCampaignIcon(campaign.campaign_type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {campaign.title}
                    </h3>
                    <span className="text-blue-200 text-sm capitalize">
                      {campaign.difficulty} • {campaign.campaign_type}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-blue-200 text-sm">
                    <span className="flex items-center gap-2">
                      <Scroll className="w-4 h-4" />
                      Battle Plans ({pendingTasks.length || 0})
                    </span>
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="text-blue-300 hover:text-blue-200 text-xs"
                    >
                      View All
                    </Link>
                  </div>

                  {campaign.time_slots && campaign.time_slots.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400/20">
                      {pendingTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="bg-blue-900/30 p-2 rounded flex items-center justify-between hover:bg-blue-900/50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                task.importance === "critical"
                                  ? "bg-red-400"
                                  : task.importance === "strategic"
                                  ? "bg-yellow-400"
                                  : "bg-blue-400"
                              }`}
                            />
                            <span className="text-white text-sm truncate">
                              {task.title}
                            </span>
                          </div>
                          <span className="text-blue-200 text-xs">
                            {Math.floor(task.start_time / 60)}:
                            {(task.start_time % 60)
                              .toString()
                              .padStart(2, "0")} -{" "}
                            {Math.floor(task.end_time / 60)}:
                            {(task.end_time % 60)
                              .toString()
                              .padStart(2, "0")}
                          </span>
                        </div>
                      ))}
                      {pendingTasks.length > 3 && (
                        <div className="text-center text-blue-300 text-xs pt-1">
                          +{pendingTasks.length - 3} more tasks
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-blue-300/60 text-sm italic text-center py-2">
                      No tasks scheduled yet
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-blue-400/20">
                  <div className="flex justify-between items-center text-sm text-blue-200 mb-2">
                    <span className="text-lg font-semibold">
                      {hoursDone}/{campaign.estimated_hours}h
                    </span>
                    <span className="text-xs">{campaign.progress}%</span>
                  </div>
                  <div className="w-full bg-blue-900/50 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>

                  {campaign.status === "completed" && (
                    <p className="text-green-400 text-sm font-semibold italic text-center">
                      Campaign Achieved!
                    </p>
                  )}
                  {canComplete && (
                    <button
                      onClick={() => openCompletionModal(campaign)}
                      className={`w-full bg-gradient-to-r 
                        ${DOMAIN_CONFIGS[campaign.campaign_type].gradientFrom} 
                        ${DOMAIN_CONFIGS[campaign.campaign_type].gradientTo} 
                        hover:brightness-110 text-white font-bold py-2 px-4 rounded mt-2`}
                    >
                      {DOMAIN_CONFIGS[campaign.campaign_type].buttonText}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignsSection;
