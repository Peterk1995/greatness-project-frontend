import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import WeekNavigator from './WeekNavigator';
import TimeColumn from './TimeColumn';
import DayColumn from './DayColumn';
import Editor from '../taskCreationEditor/Editor';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { taskService } from '../../services/taskService'; // Update import path as needed
import EventDetailsModal from './EventDetails'; // Ensure this component is defined
import { TimeSlot } from './TimeSlot'; // Ensure TimeSlot component is properly imported

// Generate time slots for the day (15-minute intervals)
const generateTimeSlots = () => {
  return Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return {
      label: format(new Date().setHours(hour, minute), 'HH:mm'),
      minutes: hour * 60 + minute,
      isHour: minute === 0
    };
  });
};

const DAYS = [
  { short: 'Mon', full: 'Monday', greek: 'Σελήνης' },
  { short: 'Tue', full: 'Tuesday', greek: 'Ἄρεως' },
  { short: 'Wed', full: 'Wednesday', greek: 'Ἑρμοῦ' },
  { short: 'Thu', full: 'Thursday', greek: 'Διός' },
  { short: 'Fri', full: 'Friday', greek: 'Ἀφροδίτης' },
  { short: 'Sat', full: 'Saturday', greek: 'Κρόνου' },
  { short: 'Sun', full: 'Sunday', greek: 'Ἡλίου' }
];

const TimeTable = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const timeSlots = generateTimeSlots();

  const getWeekDates = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    return DAYS.map((day, index) => addDays(weekStart, index));
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const weekStart = format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      
      // Add these parameters to your API call
      const response = await taskService.getAll(weekStart, weekEnd);
      
      const formattedEvents = response.data.map(slot => ({
        id: slot.id,
        title: slot.title,
        description: slot.description,
        importance: slot.importance,
        startTime: slot.start_time,
        endTime: slot.end_time,
        startDay: slot.start_day,
        endDay: slot.end_day,
        campaign: slot.campaign,
        domain: slot.domain,
        status: slot.status,
        date: slot.date // Make sure this is included
      }));
      
      // Filter events to only show those matching the selected week
      const filteredEvents = formattedEvents.filter(event => {
        // Only show events from the selected week
        return event.date >= weekStart && event.date <= weekEnd;
      });
      
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const handleWeekChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleTimeSlotClick = (day, timeInMinutes) => {
    setEditing({
      day,
      time: timeInMinutes,
      date: format(currentDate, 'yyyy-MM-dd')
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleEventDelete = async (eventId) => {
    try {
      await taskService.delete(eventId);
      await fetchEvents(); // Refresh events after deletion
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleEventSave = async (eventData) => {
    try {
      console.log('Creating single event:', eventData);
      await taskService.create(eventData);
      await fetchEvents();
      setEditing(null);
    } catch (error) {
      console.error('Failed to save event:', error.response?.data);
      alert('Failed to create task: ' + (error.response?.data?.detail || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Shield className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl">
      {/* Week Navigator */}
      <WeekNavigator
        currentDate={currentDate}
        onWeekChange={handleWeekChange}
      />

      {/* Time Grid */}
      <div className="overflow-auto max-h-[800px]">
        <div className="grid grid-cols-[100px_repeat(7,1fr)] min-w-[1200px]">
          {/* Time Column */}
          <TimeColumn />

          {/* Day Columns */}
          {getWeekDates().map((date, index) => {
            const day = DAYS[index];
            return (
              <DayColumn
                key={day.short}
                day={day}
                date={date}
                timeSlots={timeSlots}
                events={events.filter(event => event.startDay === day.short)}
                onTimeSlotClick={handleTimeSlotClick}
                onEventClick={handleEventClick}
                onEventDelete={handleEventDelete}
              />
            );
          })}
        </div>
      </div>

      {/* Editor Modal */}
      {editing && (
        <Editor
          onSave={handleEventSave}
          onCancel={() => setEditing(null)}
          initialTime={Math.floor(editing.time / 60)}
          eventData={null}
        />
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={async (updatedEvent) => {
            try {
              await taskService.update(updatedEvent.id, updatedEvent);
              await fetchEvents();
              setSelectedEvent(null);
            } catch (error) {
              console.error('Failed to update event:', error);
            }
          }}
        />
      )}
    </div>
  );
};

export default TimeTable;