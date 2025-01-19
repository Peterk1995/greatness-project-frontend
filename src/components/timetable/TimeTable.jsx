import React, { useState, useEffect, useCallback } from 'react';
import { addWeeks, startOfWeek, endOfWeek, format, addDays } from 'date-fns';
import {
  Crown,
  Sword,
  Shield,
  Target,
  Map,
  Scroll,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Compass
} from 'lucide-react';
import { timeSlotService } from '../../services/timetable/api';
import { campaignService } from '../../services/campaignService';
import { Editor } from './Editor';
import { EventDetails } from './EventDetails';

/* --------------------------- */
/*       WeekNavigator         */
/* --------------------------- */
const WeekNavigator = ({ currentDate, onWeekChange }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-4 shadow-lg border border-blue-700/50">
      <div className="flex items-center justify-between">
        {/* Navigation Controls */}
        <button
          onClick={() => onWeekChange(addWeeks(currentDate, -1))}
          className="flex items-center gap-2 px-4 py-2 bg-blue-800/50 text-blue-100 rounded-lg hover:bg-blue-700/50 transition-colors border border-blue-600/50"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous Campaign
        </button>

        {/* Current Week Display */}
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-blue-100">Imperial Campaign</h3>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200">
              {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
            </span>
          </div>
        </div>

        <button
          onClick={() => onWeekChange(addWeeks(currentDate, 1))}
          className="flex items-center gap-2 px-4 py-2 bg-blue-800/50 text-blue-100 rounded-lg hover:bg-blue-700/50 transition-colors border border-blue-600/50"
        >
          Next Campaign
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Return to Current Week */}
      <div className="mt-2 flex justify-center">
        <button
          onClick={() => onWeekChange(new Date())}
          className="flex items-center gap-2 px-3 py-1 text-sm text-blue-300 hover:text-blue-200 transition-colors"
        >
          <Shield className="w-4 h-4" />
          Return to Current Battle
        </button>
      </div>
    </div>
  );
};

/* ----------------------- */
/*    TimeSlot Component   */
/* ----------------------- */
export const TimeSlot = ({ slot, onDelete, onClick }) => {
  if (!slot) return null;

  // Return a background color based on slot importance
  const getBackgroundColor = () => {
    const colors = {
      critical: 'bg-gradient-to-r from-purple-600 to-purple-700',
      strategic: 'bg-gradient-to-r from-blue-500 to-blue-600',
      routine: 'bg-gradient-to-r from-blue-600 to-blue-700'
    };
    return colors[slot.importance] || colors.routine;
  };

  // Campaign-specific styling (borders & icons)
  const getCampaignStyle = () => {
    if (!slot.campaign) return '';
    const styles = {
      1: 'border-l-4 border-blue-400',
      2: 'border-l-4 border-blue-400',
      3: 'border-l-4 border-blue-400',
      4: 'border-l-4 border-blue-400',
      5: 'border-l-4 border-blue-400',
      default: 'border-l-4 border-blue-400'
    };
    return styles[slot.campaign.id] || styles.default;
  };

  const getCampaignIcon = () => {
    if (!slot.campaign) return null;
    const icons = {
      1: <Sword className="w-4 h-4 text-blue-200" title="Conquest Campaign" />,
      2: <Shield className="w-4 h-4 text-blue-200" title="Defense Strategy" />,
      3: <Compass className="w-4 h-4 text-blue-200" title="Exploration" />,
      4: <Map className="w-4 h-4 text-blue-200" title="Territory Planning" />,
      5: <Scroll className="w-4 h-4 text-blue-200" title="Diplomatic Mission" />,
      default: <Crown className="w-4 h-4 text-blue-200" title="Campaign" />
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
              <div className="text-xs text-blue-200 truncate mt-0.5 font-medium">
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
          className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-red-500 hover:text-white transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
};

/* ----------------------- */
/*     TimeTable Component */
/* ----------------------- */
export const TimeTable = () => {
  // State for schedule, campaigns, filtering, and modal editing
  const [schedule, setSchedule] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [editing, setEditing] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Extended days with classical names
  const extendedDays = [
    { short: 'Mon', full: 'Helios Prime' },
    { short: 'Tue', full: 'Ares Day' },
    { short: 'Wed', full: 'Zeus Peak' },
    { short: 'Thu', full: 'Atlas Rise' },
    { short: 'Fri', full: 'Victory Eve' },
    { short: 'Sat', full: "Apollo's Rest" },
    { short: 'Sun', full: 'Olympus Day' }
  ];

  // Generate time blocks (each 15 minutes)
  const times = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return { hour, minute };
  });

  // Enhanced campaign icons used in the filter buttons
  const campaignIcons = {
    1: <Sword className="w-5 h-5 text-blue-400" title="Conquest Campaign" />,
    2: <Shield className="w-5 h-5 text-blue-400" title="Defense Strategy" />,
    3: <Compass className="w-5 h-5 text-blue-400" title="Exploration" />,
    4: <Map className="w-5 h-5 text-blue-400" title="Territory Planning" />,
    5: <Scroll className="w-5 h-5 text-blue-400" title="Diplomatic Mission" />,
    all: <Target className="w-5 h-5 text-blue-400" title="All Operations" />
  };

  // Function to reset campaign filtering.
  const resetCampaignFilter = () => {
    setSelectedCampaigns([]);
  };

  // Toggle campaign in the selectedCampaigns array.
  const toggleCampaign = (campaignId) => {
    setSelectedCampaigns(prev => {
      if (prev.includes(campaignId)) {
        return prev.filter(id => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };

  // Filter schedule based on selected campaigns.
  const filteredSchedule =
    selectedCampaigns.length === 0
      ? schedule
      : Object.fromEntries(
          Object.entries(schedule).filter(([_, event]) =>
            selectedCampaigns.includes(parseInt(event.campaign))
          )
        );

  // Define fetchSchedule with useCallback using currentDate as dependency.
  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const response = await timeSlotService.getWeek(weekStart, weekEnd);
      const formattedSchedule = {};

      response.data.forEach(slot => {
        // Use a key that includes the date if desired; here we're using start_day and start_time.
        // You can adjust this to include slot.date if needed.
        const key = `${slot.start_day}-${slot.start_time}`;
        formattedSchedule[key] = {
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
          strategic_value: slot.strategic_value,
          campaign: slot.campaign,
          date: slot.date
        };
      });

      setSchedule(formattedSchedule);
    } catch (error) {
      setError('Failed to load schedule');
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  // Fetch campaigns.
  const fetchCampaigns = async () => {
    try {
      const response = await campaignService.getAll();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  // useEffect to load data whenever currentDate changes.
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchSchedule(), fetchCampaigns()]);
    };
    loadData();
  }, [currentDate, fetchSchedule]);

  // Handler for week changes from WeekNavigator.
  const handleWeekChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleCellClick = (dayShort, timeInMinutes, existingEvent = null) => {
    if (existingEvent) {
      setViewingEvent(existingEvent);
    } else {
      const slotTime = Math.floor(timeInMinutes / 15) * 15;
      setEditing({ day: dayShort, time: slotTime });
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
      margin: '0 0.25rem',
      position: 'absolute',
      zIndex: 10
    };
  };

  const formatTimeDisplay = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Given a day's short name, return the next day's short name.
  const getNextDay = (dayShort) => {
    const currentIndex = extendedDays.findIndex(d => d.short === dayShort);
    if (currentIndex === -1) return null;
    return extendedDays[(currentIndex + 1) % extendedDays.length].short;
  };

  // Separate handler for creating new time slots using the Editor's onSave callback.
  const handleCreateTimeSlot = async (timeSlots) => {
    console.log('TimeTable handleCreateTimeSlot called with:', timeSlots);
    
    try {
      const [timeSlot] = timeSlots; // We're creating one at a time
      console.log('Creating time slot:', timeSlot);
      
      // Create the time slot via the API
      const response = await timeSlotService.create(timeSlot);
      console.log('Time slot created:', response.data);

      // Update the schedule – using a key that does NOT include date here
      setSchedule(prev => {
        const newSchedule = { ...prev };
        const key = `${response.data.start_day}-${response.data.start_time}`;
        newSchedule[key] = {
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
          strategic_value: response.data.strategic_value,
          campaign: response.data.campaign,
          date: response.data.date
        };
        return newSchedule;
      });

      // Close the editor
      setEditing(null);
      setEditingEvent(null);
      
      // Refresh the week's schedule
      fetchSchedule();
    } catch (error) {
      console.error('Error creating time slot:', error);
      console.error('Error details:', error.response?.data);
      alert(`By the gods! An error occurred: ${error.response?.data?.detail || error.message}`);
    }
  };

  // Modified handleSave used when editing via the Editor (if applicable)
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
          strategic_value: slot.strategic_value,
          campaign: slot.campaign
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
          const key = `${response.data.start_day}-${response.data.start_time}`;
          newSchedule[key] = {
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
            strategic_value: response.data.strategic_value,
            campaign: response.data.campaign
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
      const key = `${event.start_day}-${event.start_time}`;
      delete newSchedule[key];
      setSchedule(newSchedule);
      setViewingEvent(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Shield className="w-16 h-16 text-blue-500 animate-pulse" />
          <span className="mt-4 text-blue-600 font-semibold">
            Assembling Battle Plans...
          </span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50/10 border border-red-200 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 rounded-xl shadow-2xl border border-blue-700/50">
      {/* Header Section */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-white/5 rounded-lg blur-xl"></div>
        <div className="relative">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-16 h-16 text-blue-400" />
          </div>
          <h2 className="text-4xl font-bold text-center text-white mb-2">
            Imperial Command Timeline
          </h2>
          <p className="text-center text-blue-200/80 italic">
            "In the dance of time, we orchestrate victory"
          </p>
        </div>
      </div>

      {/* Week Navigator */}
      <WeekNavigator currentDate={currentDate} onWeekChange={handleWeekChange} />

      {/* Campaign Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={resetCampaignFilter}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
            ${selectedCampaigns.length === 0
              ? 'bg-blue-400 text-blue-900 shadow-lg shadow-blue-400/20'
              : 'bg-blue-800/50 text-blue-100 hover:bg-blue-700/50 border border-blue-700'}`}
        >
          {campaignIcons.all}
          <span>All Campaigns</span>
        </button>
        {campaigns.map(campaign => (
          <button
            key={campaign.id}
            onClick={() => toggleCampaign(campaign.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
              ${selectedCampaigns.includes(campaign.id)
                ? 'bg-blue-400 text-blue-900 shadow-lg shadow-blue-400/20'
                : 'bg-blue-800/50 text-blue-100 hover:bg-blue-700/50 border border-blue-700'}`}
          >
            {campaignIcons[campaign.id]}
            <span>{campaign.title}</span>
          </button>
        ))}
      </div>

      {/* Timeline Grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-[1px] bg-blue-900/50 rounded-lg shadow-inner border border-blue-700/50 min-w-[1200px]">
          {/* Header Row */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 p-2">
            <div className="h-12 flex items-center justify-center font-semibold text-blue-100">
              <Clock className="w-5 h-5 mr-2" />
              Time
            </div>
          </div>
          {extendedDays.map(day => (
            <div key={day.short} className="bg-gradient-to-b from-blue-800 to-blue-700 p-2">
              <div className="h-12 flex flex-col items-center justify-center">
                <span className="font-bold text-blue-100">{day.short}</span>
                <span className="text-xs text-blue-300">{day.full}</span>
              </div>
            </div>
          ))}

          {/* Time Slots */}
          {times.map(({ hour, minute }) => (
            <React.Fragment key={`${hour}-${minute}`}>
              <div className="bg-blue-900/25 border-r border-blue-700/50 p-1">
                <div className="text-xs text-blue-200 h-8 flex items-center justify-end pr-2">
                  {minute === 0 && (
                    <span className="font-medium">{formatTimeDisplay(hour * 60)}</span>
                  )}
                </div>
              </div>
              {extendedDays.map(day => {
                const timeInMinutes = hour * 60 + minute;
                const key = `${day.short}-${timeInMinutes}`;
                const slot = Object.values(filteredSchedule).find(s =>
                  s.start_day === day.short && doesEventOverlapTime(s, timeInMinutes)
                );
                const isStartTime = slot && slot.start_time === timeInMinutes;
                return (
                  <div
                    key={key}
                    className="bg-blue-900/25 border-b border-blue-700/50 relative hover:bg-blue-900/50"
                    style={{ height: '2rem', minHeight: '2rem' }}
                    onClick={() => handleCellClick(day.short, timeInMinutes)}
                  >
                    {isStartTime && (
                      <div style={calculateEventStyle(slot.start_time, slot.end_time)}>
                        <TimeSlot
                          slot={{
                            ...slot,
                            campaign: campaigns.find(c => c.id === parseInt(slot.campaign))
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCellClick(day.short, timeInMinutes, slot);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Modals */}
      {viewingEvent && (
        <div className="fixed inset-0 bg-blue-900/90 backdrop-blur-sm flex items-center justify-center z-50">
          <EventDetails
            event={viewingEvent}
            onClose={() => setViewingEvent(null)}
            onEdit={(event) => {
              setEditingEvent(event);
              setViewingEvent(null);
            }}
            onDelete={handleDelete}
          />
        </div>
      )}

      {(editing || editingEvent) && (
        <div className="fixed inset-0 bg-blue-900/90 backdrop-blur-sm flex items-center justify-center z-50">
          <Editor
            onSave={handleCreateTimeSlot}
            onCancel={() => {
              console.log('Cancelling editor');
              setEditing(null);
              setEditingEvent(null);
            }}
            initialTime={editing ? Math.floor(editing.time / 60) : undefined}
            initialMinute={editing ? editing.time % 60 : undefined}
            eventData={editingEvent}
            campaigns={campaigns}
            days={extendedDays}
          />
        </div>
      )}
    </div>
  );
};

export default TimeTable;
