// Editor.jsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Sword,
  Scroll,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Sun,
  Star
} from 'lucide-react';
import {
  format,
  addMonths,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth
} from 'date-fns';
import api from '../../services/api';

//
// StrategicDatePicker Component
//
const StrategicDatePicker = ({
  onDateSelect,
  selectedDate,
  recurrencePattern,
  setRecurrencePattern,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const navigateMonth = (direction) => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, direction));
  };

  // Generate calendar dates for the current month view.
  const generateCalendarDates = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = [];
    let currentDay = startDate;

    while (currentDay <= endDate) {
      calendarDays.push({
        date: currentDay,
        dayName: format(currentDay, 'EEEE'),
        shortDay: format(currentDay, 'E'),
        fullDate: format(currentDay, 'yyyy-MM-dd'),
        dayOfMonth: format(currentDay, 'd'),
        month: format(currentDay, 'MMM'),
        isCurrentMonth: format(currentDay, 'M') === format(monthStart, 'M'),
      });
      currentDay = addDays(currentDay, 1);
    }

    return calendarDays;
  };

  // Greek day associations
  const greekDayMeanings = {
    Mon: { deity: 'Selene', meaning: "Moon's Blessing", icon: '🌙' },
    Tue: { deity: 'Ares', meaning: "Warrior's Strength", icon: '⚔️' },
    Wed: { deity: 'Hermes', meaning: 'Swift Wisdom', icon: '⚡' },
    Thu: { deity: 'Zeus', meaning: "Thunder's Power", icon: '⚡' },
    Fri: { deity: 'Aphrodite', meaning: 'Divine Grace', icon: '💫' },
    Sat: { deity: 'Chronos', meaning: "Time's Flow", icon: '⌛' },
    Sun: { deity: 'Apollo', meaning: "Sun's Glory", icon: '☀️' },
  };

  // Recurrence selection options
  const recurrenceOptions = [
    { id: 'none', label: 'Single Event', icon: Star },
    { id: 'daily', label: 'Daily Training', icon: Sun },
    { id: 'weekly', label: 'Weekly Council', icon: Repeat },
    { id: 'monthly', label: 'Monthly Assembly', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-800 p-4 rounded-lg">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-blue-700 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-blue-100" />
        </button>

        <div className="text-center">
          <h3 className="text-xl font-bold text-blue-100">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <p className="text-blue-200 text-sm italic">
            "Plan with divine foresight"
          </p>
        </div>

        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-blue-700 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-blue-100" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg p-4 border border-blue-100">
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center p-2">
              <div className="font-bold text-blue-800">{day}</div>
              <div className="text-xs text-blue-600">
                {greekDayMeanings[day].deity}
              </div>
              <div className="text-xs text-blue-400">
                {greekDayMeanings[day].icon}
              </div>
            </div>
          ))}

          {/* Calendar Days */}
          {generateCalendarDates().map((dateInfo) => (
            <button
              key={dateInfo.fullDate}
              onClick={() => onDateSelect(dateInfo.fullDate, dateInfo.shortDay)}
              disabled={new Date(dateInfo.fullDate) < new Date()}
              className={`
                relative p-3 rounded-lg border-2 transition-all
                ${!dateInfo.isCurrentMonth ? 'opacity-50' : ''}
                ${
                  dateInfo.fullDate === selectedDate
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-blue-200'
                }
                ${
                  new Date(dateInfo.fullDate) < new Date()
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'hover:bg-blue-50'
                }
              `}
            >
              <div className="text-center">
                <span className="text-sm font-medium text-gray-600">
                  {dateInfo.dayOfMonth}
                </span>
                {dateInfo.fullDate === format(new Date(), 'yyyy-MM-dd') && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recurrence Pattern */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Divine Pattern
        </label>
        <div className="grid grid-cols-2 gap-2">
          {recurrenceOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setRecurrencePattern(id)}
              className={`
                p-3 rounded-lg border-2 flex items-center gap-2
                ${
                  recurrencePattern === id
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-blue-200'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Auspicious Wisdom Quote */}
      <div className="text-center text-sm text-gray-500 italic">
        {recurrencePattern === 'none'
          ? '"Choose the most auspicious day for your endeavor"'
          : '"In repetition, we find mastery and strength"'}
      </div>
    </div>
  );
};

//
// Editor Component
//
export const Editor = ({ onSave, onCancel, initialTime = 0, eventData = null }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [recurrencePattern, setRecurrencePattern] = useState('none');

  // Fetch campaigns on component mount
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

  // Initialize component state
  const [data, setData] = useState({
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
    date: eventData?.date || new Date().toISOString().split('T')[0],
  });

  // Update date and selectedDays when a day is chosen
  const handleDateSelect = (fullDate, dayShort) => {
    setData((prev) => ({
      ...prev,
      date: fullDate,
      selectedDays: [dayShort],
    }));
  };

  // Modified handleSubmit using the new specifications with debug logs
  const handleSubmit = () => {
    console.log('Submit button clicked'); // Debug log 1

    if (!data.name.trim()) {
      alert('Every conquest needs a name, my lord');
      return;
    }
    if (!data.date || !data.selectedDays.length) {
      alert('Select the day of battle, great strategist');
      return;
    }

    console.log('Validation passed'); // Debug log 2

    // Convert time strings to minutes
    const convertTimeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return (hours * 60) + minutes;
    };

    const startMinutes = convertTimeToMinutes(data.startTime);
    const endMinutes = convertTimeToMinutes(data.endTime);
    const isOvernight = endMinutes < startMinutes;

    console.log('Time conversion:', { startMinutes, endMinutes, isOvernight }); // Debug log 3

    // Helper to get the next day for overnight events
    const getNextDay = (currentDay) => {
      const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const currentIndex = dayOrder.indexOf(currentDay);
      return dayOrder[(currentIndex + 1) % 7];
    };

    // Create the time slot object
    const timeSlot = {
      name: data.name,
      title: data.name, // For backward compatibility
      description: data.description || '',
      importance: data.importance,
      start_day: data.selectedDays[0],
      end_day: isOvernight ? getNextDay(data.selectedDays[0]) : data.selectedDays[0],
      start_time: startMinutes,
      end_time: endMinutes,
      color: data.color,
      is_overnight: isOvernight,
      frequency: recurrencePattern, // Use the recurrence pattern here
      resources_needed: data.resources_needed || '',
      expected_outcome: data.expected_outcome || '',
      strategic_value: data.strategic_value || '',
      campaign: data.campaign || null,
      date: data.date,
      recurrence_pattern: recurrencePattern
    };

    console.log('Submitting time slot:', timeSlot); // Debug log 4

    if (typeof onSave !== 'function') {
      console.error('onSave is not a function:', onSave); // Debug log 5
      return;
    }

    try {
      onSave([timeSlot]);
      console.log('onSave called successfully'); // Debug log 6
    } catch (error) {
      console.error('Error in onSave:', error); // Debug log 7
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Plan Your Empire's Next Move</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Title & Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Title of Engagement
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., War Council, Battle Strategy, Training"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Commencement
              </label>
              <input
                type="time"
                value={data.startTime}
                onChange={(e) => setData({ ...data, startTime: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Conclusion
              </label>
              <input
                type="time"
                value={data.endTime}
                onChange={(e) => setData({ ...data, endTime: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Strategic Date Picker with Month Navigation and Recurrence */}
          <StrategicDatePicker
            onDateSelect={handleDateSelect}
            selectedDate={data.date}
            recurrencePattern={recurrencePattern}
            setRecurrencePattern={setRecurrencePattern}
          />

          {/* Imperial Importance Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Imperial Importance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'critical', label: 'Critical for Empire', icon: Shield, color: 'bg-red-200' },
                { id: 'strategic', label: 'Strategic Importance', icon: Sword, color: 'bg-yellow-200' },
                { id: 'routine', label: 'Routine Matter', icon: Scroll, color: 'bg-blue-200' },
              ].map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setData({ ...data, importance: id, color })}
                  className={`p-3 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    data.importance === id ? color + ' ring-2 ring-blue-500' : 'bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Align with Grand Campaign
            </label>
            <select
              value={data.campaign || ''}
              onChange={(e) => setData({ ...data, campaign: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Campaign (Regular Task)</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title} - {campaign.campaign_type}
                </option>
              ))}
            </select>
          </div>

          {/* Strategic Details */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Strategic Details
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Detail your strategy, objectives, and considerations..."
            />
          </div>

          {/* Resources and Outcomes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Required Resources
              </label>
              <textarea
                value={data.resources_needed}
                onChange={(e) => setData({ ...data, resources_needed: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Men, supplies, allies needed..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Expected Outcome
              </label>
              <textarea
                value={data.expected_outcome}
                onChange={(e) => setData({ ...data, expected_outcome: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Victory conditions, strategic gains..."
                rows={3}
              />
            </div>
          </div>
        </div>

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
            onClick={() => {
              console.log('Decree It button clicked');
              handleSubmit();
            }}
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
