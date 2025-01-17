// TimeTable.jsx
import React, { useState, useEffect } from 'react';
import { timeSlotService } from '../../services/timetable/api';
import { Editor } from './Editor';
import { EventDetails } from './EventDetails';
import { Clock, ChevronRight } from 'lucide-react';

export const TimeTable = () => {
  const [schedule, setSchedule] = useState({});
  const [editing, setEditing] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return { hour, minute };
  });

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await timeSlotService.getAll();
      const formattedSchedule = {};
      
      response.data.forEach(slot => {
        formattedSchedule[`${slot.start_day}-${slot.start_time}`] = {
          id: slot.id,
          name: slot.title,
          description: slot.description,
          importance: slot.importance,
          color: slot.color,
          start_time: slot.start_time,
          end_time: slot.end_time,
          start_day: slot.start_day,
          end_day: slot.end_day,
          is_overnight: slot.is_overnight,
          frequency: slot.frequency,
          resources_needed: slot.resources_needed,
          expected_outcome: slot.expected_outcome,
          strategic_value: slot.strategic_value
        };
      });
      
      setSchedule(formattedSchedule);
    } catch (error) {
      setError('Failed to load schedule');
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (day, timeInMinutes, existingEvent = null) => {
    if (existingEvent) {
      setViewingEvent(existingEvent);
    } else {
      const slotTime = Math.floor(timeInMinutes / 15) * 15;
      setEditing({ day, time: slotTime });
    }
  };

  const doesEventOverlapTime = (slot, timeInMinutes) => {
    if (slot.is_overnight) {
      return timeInMinutes >= slot.start_time || timeInMinutes < slot.end_time;
    }
    return timeInMinutes >= slot.start_time && timeInMinutes < slot.end_time;
  };

  const calculateEventStyle = (startTime, endTime) => {
    const start15MinBlock = Math.floor(startTime / 15);
    const end15MinBlock = Math.ceil(endTime / 15);
    const durationBlocks = end15MinBlock - start15MinBlock;
    
    return {
      gridRowStart: start15MinBlock + 1,
      gridRowEnd: `span ${durationBlocks}`,
      height: '100%',
      minHeight: `${durationBlocks * 2}rem`,
      width: 'calc(100% - 0.5rem)',
      margin: '0 0.25rem'
    };
  };

  const formatTimeDisplay = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getNextDay = (day) => {
    const currentIndex = days.indexOf(day);
    return days[(currentIndex + 1) % days.length];
  };

  const handleSave = async (timeSlots) => {
    if (!editing && !editingEvent) return;
    
    try {
      const createPromises = timeSlots.map(slot => {
        const parseTimeToMinutes = (timeStr) => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return (hours * 60) + minutes;
        };

        const startMinutes = parseTimeToMinutes(slot.startTime);
        const endMinutes = parseTimeToMinutes(slot.endTime);
        const isOvernight = endMinutes < startMinutes;
        
        const timeSlotData = {
          title: slot.name,
          description: slot.description,
          importance: slot.importance,
          start_day: slot.day,
          end_day: isOvernight ? getNextDay(slot.day) : slot.day,
          start_time: startMinutes,
          end_time: endMinutes,
          color: slot.color,
          is_overnight: isOvernight,
          frequency: slot.frequency,
          resources_needed: slot.resources_needed,
          expected_outcome: slot.expected_outcome,
          strategic_value: slot.strategic_value
        };

        if (editingEvent) {
          return timeSlotService.update(editingEvent.id, timeSlotData);
        }
        return timeSlotService.create(timeSlotData);
      });

      const responses = await Promise.all(createPromises);
      
      setSchedule(prev => {
        const newSchedule = { ...prev };
        
        responses.forEach(response => {
          newSchedule[`${response.data.start_day}-${response.data.start_time}`] = {
            id: response.data.id,
            name: response.data.title,
            description: response.data.description,
            importance: response.data.importance,
            color: response.data.color,
            start_time: response.data.start_time,
            end_time: response.data.end_time,
            start_day: response.data.start_day,
            end_day: response.data.end_day,
            is_overnight: response.data.is_overnight,
            frequency: response.data.frequency,
            resources_needed: response.data.resources_needed,
            expected_outcome: response.data.expected_outcome,
            strategic_value: response.data.strategic_value
          };
        });
        
        return newSchedule;
      });
      
      setEditing(null);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error details:', error.response?.data);
    }
  };

  const handleDelete = async (event) => {
    if (!event?.id) return;

    try {
      await timeSlotService.delete(event.id);
      const newSchedule = { ...schedule };
      delete newSchedule[`${event.start_day}-${event.start_time}`];
      setSchedule(newSchedule);
      setViewingEvent(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
      {error}
    </div>
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Strategic Schedule</h2>
        <p className="text-gray-600">Plan your path to greatness</p>
      </div>

      <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-[1px] bg-gray-200 rounded-lg overflow-hidden">
        {/* Header row */}
        <div className="bg-gray-50 p-2">
          <div className="h-12 flex items-center justify-center font-semibold text-gray-600">
            Time
          </div>
        </div>

        {days.map(day => (
          <div key={day} className="bg-gray-50 p-2">
            <div className="h-12 flex items-center justify-center font-semibold text-gray-600">
              {day}
            </div>
          </div>
        ))}

        {/* Time slots */}
        {times.map(({ hour, minute }) => (
          <React.Fragment key={`${hour}-${minute}`}>
            {/* Time label */}
            <div className="bg-white border-r border-gray-100 p-1">
              <div className="text-xs text-gray-500 h-8 flex items-center justify-end pr-2">
                {minute === 0 && (
                  <span className="font-medium">{formatTimeDisplay(hour * 60)}</span>
                )}
              </div>
            </div>

            {/* Day columns */}
            {days.map(day => {
              const timeInMinutes = hour * 60 + minute;
              const slot = Object.values(schedule).find(s => 
                s.start_day === day && 
                doesEventOverlapTime(s, timeInMinutes)
              );

              const isStartTime = slot && slot.start_time === timeInMinutes;

              return (
                <div
                  key={`${day}-${timeInMinutes}`}
                  className="bg-white border-b border-gray-100 relative"
                  style={{ height: '2rem', minHeight: '2rem' }}
                  onClick={() => handleCellClick(day, timeInMinutes)}
                >
                  {isStartTime && (
                    <div
                      className={`absolute left-0 right-0 ${slot.color} 
                        rounded-md shadow-sm hover:shadow-md transition-shadow z-10
                        overflow-hidden group cursor-pointer`}
                      style={calculateEventStyle(slot.start_time, slot.end_time)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCellClick(day, timeInMinutes, slot);
                      }}
                    >
                      <div className="p-1 h-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs font-medium truncate">{slot.name}</div>
                            <div className="text-xs text-gray-600 capitalize">
                              {slot.importance}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTimeDisplay(slot.start_time)} - 
                              {slot.is_overnight ? ' Next Day ' : ' '}
                              {formatTimeDisplay(slot.end_time)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {viewingEvent && (
        <EventDetails
          event={viewingEvent}
          onClose={() => setViewingEvent(null)}
          onEdit={(event) => {
            setEditingEvent(event);
            setViewingEvent(null);
          }}
          onDelete={handleDelete}
        />
      )}

      {editing && !editingEvent && (
        <Editor
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          initialTime={Math.floor(editing.time / 60)}
          initialMinute={editing.time % 60}
        />
      )}

      {editingEvent && (
        <Editor
          onSave={handleSave}
          onCancel={() => setEditingEvent(null)}
          eventData={editingEvent}
        />
      )}
    </div>
  );
};