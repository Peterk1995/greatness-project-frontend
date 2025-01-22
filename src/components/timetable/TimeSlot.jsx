import React, { useState } from 'react';
import {
  Crown, Sword, Shield, Map, Scroll, Star, Clock
} from 'lucide-react';

const GreekColumn = () => (
  <div className="absolute top-0 bottom-0 w-[6px] opacity-20">
    <div className="h-1/5 w-full bg-gradient-to-b from-white/80 to-white/20" />
    <div className="h-3/5 w-full bg-[repeating-linear-gradient(
          0deg,
          transparent,
          transparent_2px,
          rgba(255,255,255,0.2)_2px,
          rgba(255,255,255,0.2)_4px
        )]"
    />
    <div className="h-1/5 w-full bg-gradient-to-t from-white/80 to-white/20" />
  </div>
);

export const TimeSlot = ({ slot, onDelete, onClick }) => {
  const [isSelected, setIsSelected] = useState(false);

  if (!slot) return null;

  const domainStyles = {
    conquest: {
      bg: 'bg-gradient-to-br from-red-800 via-red-700 to-red-900',
      border: 'border-l-4 border-red-400'
    },
    cultural: {
      bg: 'bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900',
      border: 'border-l-4 border-purple-400'
    },
    wisdom: {
      bg: 'bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900',
      border: 'border-l-4 border-blue-400'
    },
    legacy: {
      bg: 'bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800',
      border: 'border-l-4 border-amber-300'
    }
  };

  const style = domainStyles[slot.domain] || domainStyles.conquest;

  const icons = {
    conquest: <Sword className="w-4 h-4 text-red-200" />,
    cultural: <Scroll className="w-4 h-4 text-purple-200" />,
    wisdom: <Shield className="w-4 h-4 text-blue-200" />,
    legacy: <Star className="w-4 h-4 text-amber-200" />
  };
  const domainIcon = icons[slot.domain] || <Crown className="w-4 h-4 text-gray-200" />;

  const importanceMarkers = {
    critical: '!!!',
    strategic: '!!',
    routine: '!'
  };
  const importance = importanceMarkers[slot.importance] || '!';

  const formatTime = (timeValue) => {
    if (typeof timeValue === 'number') {
      const hours = Math.floor(timeValue / 60);
      const minutes = timeValue % 60;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
    }
    return timeValue;
  };

  return (
    <div
      onClick={(e) => {
        setIsSelected(!isSelected);
        onClick?.(e);
      }}
      className={`
        group relative rounded-lg shadow-xl hover:shadow-2xl transition-all
        cursor-pointer backdrop-blur-sm overflow-hidden h-full w-full
        ${style.bg} ${style.border}
      `}
    >
      <div className="absolute left-0">
        <GreekColumn />
      </div>
      <div className="absolute right-0 rotate-180">
        <GreekColumn />
      </div>

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors pointer-events-none" />

      <div className="relative p-2 h-full flex flex-col gap-1">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              {domainIcon}
              <h3 className="text-sm font-bold text-white truncate">
                {slot.title || slot.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs">
              <Clock className="w-3 h-3 text-white/70" />
              <span className="text-white/80 font-medium">
                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
              </span>
            </div>
          </div>
          <div className="text-xs font-extrabold text-white/90">
            {importance}
          </div>
        </div>

        {slot.campaign && (
          <div className="mt-1 flex items-center gap-1">
            <Map className="w-3 h-3 text-white/60" />
            <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider">
              {slot.campaign.title}
            </span>
          </div>
        )}

{isSelected && onDelete && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (window.confirm('Are you sure you want to delete this event?')) {
        onDelete?.();
      }
    }}
    className="absolute bottom-2 right-2 w-8 h-8 
               bg-black/30 hover:bg-red-500 
               rounded-full flex items-center justify-center
               text-white text-lg font-bold
               transform transition-all duration-200
               hover:scale-110 z-20"  // Added z-20 to ensure it's above other elements
    aria-label="Delete this event"
  >
    ×
  </button>
)}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px]
                      bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};
