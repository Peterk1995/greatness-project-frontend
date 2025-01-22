// Editor/Editor.jsx
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parse, isValid, startOfDay } from 'date-fns';
import StrategicDatePicker from './StrategicDatePicker';
import TaskForm from './TaskForm';
import DomainSelector from './DomainSelector';
import ImportanceSelector from './ImportanceSelector';
import CampaignSelector from './CampaignSelector';
import BattleSessionsConfig from './BattleSessionsConfig';
import api from '../../services/api'; // Adjust the relative path as needed

const Editor = ({ onSave, onCancel, initialTime = 0, eventData = null }) => {
  // Initialize the data state with defaults or provided eventData
  const [data, setData] = useState(() => {
    const initialDate = eventData?.date
      ? format(new Date(eventData.date), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd');
    return {
      name: eventData?.name || '',
      startTime: eventData?.startTime || `${initialTime.toString().padStart(2, '0')}:00`,
      endTime: eventData?.endTime || `${(initialTime + 1).toString().padStart(2, '0')}:00`,
      description: eventData?.description || '',
      importance: eventData?.importance || 'routine',
      color: eventData?.color || 'bg-blue-200',
      selectedDays: eventData?.selectedDays || [],
      frequency: eventData?.frequency || 'once',
      resources_needed: eventData?.resources_needed || '',
      expected_outcome: eventData?.expected_outcome || '',
      strategic_value: eventData?.strategic_value || '',
      campaign: eventData?.campaign || '',
      date: initialDate,
      domain: eventData?.domain || 'conquest',
    };
  });
  
  const [recurrencePattern, setRecurrencePattern] = useState('none');
  const [campaigns, setCampaigns] = useState([]);
  const [battleSessions, setBattleSessions] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/campaigns/');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      }
    };
    fetchCampaigns();
  }, []);

  // Handle date selection from StrategicDatePicker
  const handleDateSelect = (fullDate, dayShort) => {
    const parsedDate = parse(fullDate, 'yyyy-MM-dd', new Date());
    if (!isValid(parsedDate)) {
      console.error("Failed to parse selected date:", fullDate);
      return;
    }
    const formattedDate = format(parsedDate, 'yyyy-MM-dd');
    setData(prev => ({
      ...prev,
      date: formattedDate,
      selectedDays: [dayShort],
    }));
  };

  // Helper to get the next day (for overnight events)
  const getNextDay = (currentDay) => {
    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentIndex = dayOrder.indexOf(currentDay);
    return dayOrder[(currentIndex + 1) % 7];
  };

  const handleSubmit = () => {
    if (!data.name.trim()) {
      alert('Every conquest needs a name, my lord');
      return;
    }
    if (!data.date || !data.selectedDays.length) {
      alert('Select the day of battle, great strategist');
      return;
    }

    const convertTimeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return (hours * 60) + minutes;
    };

    const startMinutes = convertTimeToMinutes(data.startTime);
    const endMinutes = convertTimeToMinutes(data.endTime);
    const isOvernight = endMinutes < startMinutes;

    // Build the timeSlot object with recurrence and other details
    const timeSlot = {
      title: data.name,
      description: data.description || '',
      importance: data.importance,
      start_day: data.selectedDays[0],
      end_day: isOvernight ? getNextDay(data.selectedDays[0]) : data.selectedDays[0],
      start_time: startMinutes,
      end_time: endMinutes,
      color: data.color,
      is_overnight: isOvernight,
      frequency: recurrencePattern,
      recurrence_pattern: recurrencePattern,
      resources_needed: data.resources_needed || '',
      expected_outcome: data.expected_outcome || '',
      strategic_value: data.strategic_value || '',
      campaign: data.campaign || null,
      date: data.date,
      domain: data.domain,
      is_recurring: recurrencePattern !== 'none',
      start_date: data.date,
      end_date: null, 
    };

    console.log('Submitting time slot with recurrence:', {
      date: data.date,
      pattern: recurrencePattern,
      frequency: timeSlot.frequency,
      isRecurring: timeSlot.is_recurring
    });

    try {
      onSave(timeSlot);
    } catch (error) {
      console.error('Error in onSave:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Plan Your Empire's Next Move</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Task Form (Title, Times, and Strategic Details) */}
          <TaskForm data={data} setData={setData} />

          {/* Strategic Date Picker */}
          <StrategicDatePicker
            onDateSelect={handleDateSelect}
            selectedDate={data.date ? new Date(`${data.date}T00:00:00`) : new Date()}
            recurrencePattern={recurrencePattern}
            setRecurrencePattern={setRecurrencePattern}
          />

          {/* Domain Selection */}
          <DomainSelector data={data} setData={setData} />

          {/* Importance Selection */}
          <ImportanceSelector data={data} setData={setData} />

          {/* Campaign Selection */}
          <CampaignSelector data={data} setData={setData} campaigns={campaigns} />

          {/* Battle Sessions Configuration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Battle Sessions (Pomodoro)
            </label>
            <BattleSessionsConfig 
              onChange={(sessions) => {
                setBattleSessions(sessions);
                // Example: update expected end time based on focus and rest durations
                const totalMinutes = sessions.totalFocusTime + sessions.totalBreakTime;
                const startTimeParts = data.startTime.split(':').map(Number);
                const startDateTime = new Date();
                startDateTime.setHours(startTimeParts[0], startTimeParts[1], 0);
                const endTime = new Date(startDateTime.getTime() + totalMinutes * 60000);
                setData(prev => ({
                  ...prev,
                  endTime: endTime.toTimeString().slice(0, 5)
                }));
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => {
              console.log('Retreat button clicked');
              onCancel();
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Retreat
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Decree It
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
