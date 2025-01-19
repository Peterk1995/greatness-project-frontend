import React from 'react';
import { Crown, Sword, Shield, Map, Scroll, Target, Compass } from 'lucide-react';

export const TimeSlot = ({ slot, onDelete, onClick }) => {
  if (!slot) return null;

  // Get the appropriate background color based on importance
  const getBackgroundColor = () => {
    const colors = {
      critical: 'bg-gradient-to-r from-purple-600 to-purple-700',
      strategic: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      routine: 'bg-gradient-to-r from-blue-600 to-blue-700'
    };
    return colors[slot.importance] || colors.routine;
  };

  // Campaign-specific styling
  const getCampaignStyle = () => {
    if (!slot.campaign) return '';
    
    const styles = {
      1: 'border-l-4 border-yellow-400',    // Conquest
      2: 'border-l-4 border-purple-400',     // Defense
      3: 'border-l-4 border-blue-400',       // Expedition
      4: 'border-l-4 border-red-400',        // Territory
      5: 'border-l-4 border-green-400',      // Diplomacy
      default: 'border-l-4 border-yellow-400'
    };
    return styles[slot.campaign.id] || styles.default;
  };

  // Campaign icons with proper coloring
  const getCampaignIcon = () => {
    if (!slot.campaign) return null;
    
    const icons = {
      1: <Sword className="w-4 h-4 text-yellow-200" />,
      2: <Shield className="w-4 h-4 text-purple-200" />,
      3: <Compass className="w-4 h-4 text-blue-200" />,
      4: <Map className="w-4 h-4 text-red-200" />,
      5: <Scroll className="w-4 h-4 text-green-200" />,
      default: <Crown className="w-4 h-4 text-yellow-200" />
    };
    return icons[slot.campaign.id] || icons.default;
  };

  return (
    <div
      className={`h-full rounded-md shadow-md hover:shadow-lg transition-all 
        overflow-hidden cursor-pointer backdrop-blur-sm
        ${getBackgroundColor()} ${getCampaignStyle()}`}
      onClick={onClick}
    >
      <div className="p-2 h-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/0" />
        <div className="relative flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {slot.name || slot.title}
            </div>
            {slot.campaign && (
              <div className="text-xs text-yellow-200 truncate mt-0.5 font-medium">
                {slot.campaign.title}
              </div>
            )}
            {slot.importance && (
              <div className="text-xs text-white/80 capitalize mt-0.5">
                {slot.importance}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {getCampaignIcon()}
          </div>
        </div>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center
            rounded-full bg-black/20 text-white hover:bg-red-500 
            hover:text-white transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
}
