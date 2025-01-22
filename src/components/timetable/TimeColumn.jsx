import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

const TimeColumn = () => {
  // Generate time slots for 24 hours with 15-minute intervals
  const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return {
      label: format(new Date().setHours(hour, minute), 'HH:mm'),
      minutes: hour * 60 + minute,
      isHour: minute === 0
    };
  });

  // Greek time periods for context
  const getTimePeriod = (hour) => {
    if (hour >= 5 && hour < 8) return 'Ἠώς (Dawn)';
    if (hour >= 8 && hour < 12) return 'Πρωΐα (Morning)';
    if (hour >= 12 && hour < 14) return 'Μεσημβρία (Noon)';
    if (hour >= 14 && hour < 17) return 'Δείλη (Afternoon)';
    if (hour >= 17 && hour < 20) return 'Ἑσπέρα (Evening)';
    return 'Νύξ (Night)';
  };

  return (
    <div className="border-r border-gray-700 bg-gray-900">
      {/* Header */}
      <div className="h-16 border-b border-gray-700 flex items-center justify-center">
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      
      {/* Time slots */}
      {timeSlots.map((slot) => (
        <div
          key={slot.label}
          className={`
            h-12 border-b border-gray-700 
            flex items-center justify-end pr-4
            ${slot.isHour ? 'bg-gray-800/50' : ''}
          `}
        >
          {slot.isHour && (
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-300">
                {slot.label}
              </span>
              <span className="text-xs text-gray-500">
                {getTimePeriod(Math.floor(slot.minutes / 60))}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;