import React from 'react';
import { format } from 'date-fns';
import { TimeSlot } from './TimeSlot';

// Example day definitions
const DAYS = [
  { short: 'Mon', display: 'Monday',    greek: 'Σελήνης' },
  { short: 'Tue', display: 'Tuesday',   greek: 'Ἄρεως'   },
  { short: 'Wed', display: 'Wednesday', greek: 'Ἑρμοῦ'   },
  { short: 'Thu', display: 'Thursday',  greek: 'Διός'    },
  { short: 'Fri', display: 'Friday',    greek: 'Ἀφροδίτης' },
  { short: 'Sat', display: 'Saturday',  greek: 'Κρόνου'  },
  { short: 'Sun', display: 'Sunday',    greek: 'Ἡλίου'   },
];

// Converts "HH:mm" or numeric minute values to a total minute count
const parseTimeToMinutes = (time) => {
  if (typeof time === 'number') return time;
  if (typeof time === 'string') {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + (mins || 0);
  }
  return 0;
};

// Return an array of times in 1-hour increments (no lines, just textual markers)
const generateTimeMarkers = () => {
  // Let's just mark every hour from 00:00 to 23:00 
  // (Feel free to do 15-min increments if you like)
  return Array.from({ length: 24 }, (_, i) => {
    const label = format(new Date().setHours(i, 0), 'HH:mm');
    const minutes = i * 60;
    return { label, minutes };
  });
};

export const TimeGrid = ({
  events = [],
  onTimeSlotClick = () => {},
  onEventClick = () => {}
}) => {
  // We don’t strictly need time slots in the UI, but we do need 
  // a fixed vertical scale. We’ll define total vertical height
  // to represent 24 hours. E.g. 24 hours * 60 minutes = 1440 minutes
  // If we choose 1 minute = 2px, that’s 2880px tall—maybe too large. 
  // Let’s go with 1 minute = 1.5px => 2160px tall total.
  const MINUTE_PX = 1.5;
  const TOTAL_HEIGHT = 1440 * MINUTE_PX; // 2160px for a full 24 hours

  const timeMarkers = generateTimeMarkers();

  // Filter events for a given day
  const getEventsForDay = (dayShort) => {
    return events.filter(evt => evt.startDay === dayShort);
  };

  // Calculate top and height for an event in px
  const calculateEventStyle = (event) => {
    const startMinutes = parseTimeToMinutes(event.startTime);
    const endMinutes = parseTimeToMinutes(event.endTime);
    const topOffset = startMinutes * MINUTE_PX;
    const eventDuration = endMinutes - startMinutes;
    const eventHeight = eventDuration * MINUTE_PX;

    return {
      top: `${topOffset}px`,
      height: `${eventHeight}px`,
    };
  };

  return (
    <div
      className="w-full h-auto bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900 
                 text-gray-100 overflow-auto"
      style={{ minHeight: '100vh' }}
      aria-label="Aristotle University Timetable"
    >
      {/* Banner / Title */}
      <header className="p-6 md:p-8 bg-gradient-to-r from-purple-900 to-indigo-900 
                         shadow-xl flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wider">
          Aristotle University Timetable
        </h1>
        <p className="mt-1 text-sm italic opacity-80">“Expanding minds through time and wisdom.”</p>
      </header>

      {/* 
        Main content area:
        We'll do a grid with 7 columns (for days) that can wrap on smaller screens.
      */}
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {DAYS.map((day) => {
            const dayEvents = getEventsForDay(day.short);

            return (
              <div
                key={day.short}
                className="relative bg-white/5 rounded-lg overflow-hidden shadow-lg 
                           hover:bg-white/10 transition-colors"
                style={{ height: TOTAL_HEIGHT + 64 }} 
                // We add some extra space for the heading area
              >
                {/* Day Header */}
                <div className="p-4 bg-white/10 sticky top-0 z-10 
                                flex flex-col items-center text-center">
                  <h2 className="text-lg font-bold text-white uppercase">
                    {day.display}
                  </h2>
                  <span className="text-sm italic text-gray-300">
                    {day.greek}
                  </span>
                </div>

                {/* This container is where we'll position events absolutely */}
                <div
                  className="relative w-full"
                  style={{ height: TOTAL_HEIGHT }} // 24h vertical space
                  // If user clicks an empty area, we can interpret a time 
                  // by the vertical offset
                  onClick={(e) => {
                    // Calculate minute offset from click
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const minuteClicked = Math.floor(y / MINUTE_PX);
                    onTimeSlotClick(day.short, minuteClicked);
                  }}
                >
                  {/* Subtle Time Markers as faint text (no lines) */}
                  {timeMarkers.map(marker => {
                    const markerTop = marker.minutes * MINUTE_PX;
                    return (
                      <div
                        key={marker.label}
                        className="absolute -translate-y-1/2 left-2 text-xs text-gray-300/70"
                        style={{ top: markerTop }}
                      >
                        {marker.label}
                      </div>
                    );
                  })}

                  {/* Render events for this day */}
                  {dayEvents.map(evt => {
                    const { top, height } = calculateEventStyle(evt);
                    return (
                      <div
                        key={evt.id}
                        className="absolute w-[95%] left-[2.5%]"
                        style={{ top, height }}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          onEventClick(evt);
                        }}
                      >
                        <TimeSlot slot={evt} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
