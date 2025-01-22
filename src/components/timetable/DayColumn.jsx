import React from 'react';
import { Shield } from 'lucide-react';
import { TimeSlot } from './TimeSlot';
import { format, isBefore, startOfDay } from 'date-fns';

const DayColumn = ({ 
  day, 
  timeSlots, 
  events, 
  onTimeSlotClick, 
  onEventClick,
  date,
  onEventDelete
}) => {
  // Constants for time calculations
  const MINUTES_PER_SLOT = 15;
  const SLOT_HEIGHT = 48;
  const HOURS_PER_DAY = 24;
  const TOTAL_SLOTS = HOURS_PER_DAY * (60 / MINUTES_PER_SLOT);
  const TOTAL_HEIGHT = TOTAL_SLOTS * SLOT_HEIGHT;

  // Check if date is in the past
  const isPast = isBefore(date, startOfDay(new Date()));

  const calculateEventStyle = (event) => {
    const startMins = typeof event.startTime === 'number' ? event.startTime : parseInt(event.startTime);
    const endMins = typeof event.endTime === 'number' ? event.endTime : parseInt(event.endTime);
    
    const numSlots = Math.ceil((endMins - startMins) / MINUTES_PER_SLOT);
    const heightPx = numSlots * SLOT_HEIGHT;
    const topPx = Math.floor(startMins / MINUTES_PER_SLOT) * SLOT_HEIGHT;

    return {
      position: 'absolute',
      top: `${topPx}px`,
      left: '4px',
      right: '4px',
      height: `${heightPx}px`,
      zIndex: 10
    };
  };

  const dayEvents = events.filter(event => event.startDay === day.short);

  // Format date for tooltip
  const formattedDate = format(date, 'MMMM d, yyyy');

  return (
    <div className={`relative border-r border-gray-700 ${isPast ? 'opacity-70' : ''}`}>
      {/* Day Header with Tooltip */}
      <div className="h-16 border-b border-gray-700 p-2 bg-gray-800/50 relative group">
        <div className="text-center">
          <div className="font-semibold text-gray-200">{day.full}</div>
          <div className="text-sm text-gray-400">{day.greek}</div>
        </div>
        
        {/* Date Tooltip */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      bg-gray-900 text-white px-2 py-1 rounded text-sm z-50
                      pointer-events-none mb-2 whitespace-nowrap">
          {formattedDate}
        </div>
      </div>

      {/* Time Slots Container */}
      <div
        className={`relative ${isPast ? 'pointer-events-none' : ''}`}
        style={{ height: TOTAL_HEIGHT }}
        onClick={(e) => {
          if (isPast) {
            alert('Cannot schedule events in the past, great strategist!');
            return;
          }
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const minuteClicked = Math.floor((y / SLOT_HEIGHT) * MINUTES_PER_SLOT);
          onTimeSlotClick(day.short, minuteClicked);
        }}
      >
        {/* Hour Markers */}
        {timeSlots.map((slot, index) => (
          <div
            key={slot.label}
            className={`
              absolute left-0 right-0 
              ${slot.minutes % 60 === 0 ? 'bg-gray-800/30' : ''}
              hover:bg-gray-800/50 transition-colors cursor-pointer
            `}
            style={{
              top: `${index * SLOT_HEIGHT}px`,
              height: `${SLOT_HEIGHT}px`,
              borderTop: slot.minutes % 60 === 0 ? '1px solid rgba(55, 65, 81, 0.3)' : 'none'
            }}
          >
            {/* Quick add indicator */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 rounded-full border-2 border-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400/40 font-bold">+</span>
              </div>
            </div>
          </div>
        ))}

        {/* Events */}
        {dayEvents.map((event) => (
          <div
            key={event.id}
            style={calculateEventStyle(event)}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
          >
            <TimeSlot 
              slot={event} 
              onDelete={() => onEventDelete?.(event.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayColumn;