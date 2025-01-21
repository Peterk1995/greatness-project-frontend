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
  endOfMonth,
  isBefore,
  startOfDay,
  isToday,
  parse,
  parseISO,
  isValid
} from 'date-fns';
import api from '../../services/api';

// StrategicDatePicker Component
const StrategicDatePicker = ({
  onDateSelect,
  selectedDate,
  recurrencePattern,
  setRecurrencePattern,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const generateCalendarDates = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = [];
    let currentDay = startDate;

    while (currentDay <= endDate) {
      const dateStr = format(currentDay, 'yyyy-MM-dd');
      calendarDays.push({
        date: currentDay,
        fullDate: dateStr,
        shortDay: format(currentDay, 'E'),
        dayOfMonth: format(currentDay, 'd'),
        isCurrentMonth: format(currentDay, 'M') === format(monthStart, 'M'),
        isToday: isToday(currentDay)
      });
      currentDay = addDays(currentDay, 1);
    }
    return calendarDays;
  };

  const isDateSelectable = (date) => {
    const today = startOfDay(new Date());
    const checkDate = startOfDay(date);
    return !isBefore(checkDate, today);
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-800 p-4 rounded-lg">
        <button
          onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
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
          onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
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
              <div className="text-xs text-blue-600">{greekDayMeanings[day].deity}</div>
              <div className="text-xs text-blue-400">{greekDayMeanings[day].icon}</div>
            </div>
          ))}

          {/* Calendar Days */}
          {generateCalendarDates().map(dateInfo => {
            const isSelectable = isDateSelectable(dateInfo.date);
            return (
              <button
                key={dateInfo.fullDate}
                onClick={() => {
                  if (isSelectable) {
                    console.log('Calendar selected:', {
                      fullDate: dateInfo.fullDate,
                      shortDay: dateInfo.shortDay
                    });
                    onDateSelect(dateInfo.fullDate, dateInfo.shortDay);
                  }
                }}
                disabled={!isSelectable}
                className={`
                  relative p-3 rounded-lg border-2 transition-all
                  ${!dateInfo.isCurrentMonth ? 'opacity-50' : ''}
                  ${
                    dateInfo.fullDate === format(selectedDate, 'yyyy-MM-dd')
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200'
                  }
                  ${!isSelectable ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-blue-50'}
                  ${dateInfo.isToday ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <span className="text-sm font-medium text-gray-700">
                  {dateInfo.dayOfMonth}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recurrence Pattern */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Divine Pattern</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'none', label: 'Single Event', icon: Star },
            { id: 'daily', label: 'Daily Training', icon: Sun },
            { id: 'weekly', label: 'Weekly Council', icon: Repeat },
            { id: 'monthly', label: 'Monthly Assembly', icon: Calendar }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setRecurrencePattern(id)}
              className={`
                p-3 rounded-lg border-2 flex items-center gap-2
                ${recurrencePattern === id ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Editor = ({ onSave, onCancel, initialTime = 0, eventData = null }) => {
  // Initialize state with a formatted date string ("yyyy-MM-dd")
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
      // NEW FIELD: Imperial Categorization
      domain: eventData?.domain || 'conquest',
    };
  });
  
  const [recurrencePattern, setRecurrencePattern] = useState('none');
  const [campaigns, setCampaigns] = useState([]);

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

  // Handle date selection with proper parsing
  const handleDateSelect = (fullDate, dayShort) => {
    console.log("=== Date Selection Debug ===");
    console.log("Selected date string:", fullDate);
    console.log("Selected day:", dayShort);

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

  const handleSubmit = () => {
    if (!data.name.trim()) {
      alert('Every conquest needs a name, my lord');
      return;
    }
    if (!data.date || !data.selectedDays.length) {
      alert('Select the day of battle, great strategist');
      return;
    }

    // Helper: Convert time strings to minutes
    const convertTimeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return (hours * 60) + minutes;
    };

    const startMinutes = convertTimeToMinutes(data.startTime);
    const endMinutes = convertTimeToMinutes(data.endTime);
    const isOvernight = endMinutes < startMinutes;

    const selectedDate = new Date(`${data.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      if (startMinutes < currentMinutes) {
        alert(
          "O mighty conqueror, the appointed hour for your command has already slipped away into legend. Rally your forces and select a forthcoming moment for victory!"
        );
        return;
      }
    }

    const getNextDay = (currentDay) => {
      const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const currentIndex = dayOrder.indexOf(currentDay);
      return dayOrder[(currentIndex + 1) % 7];
    };

    const timeSlot = {
      name: data.name,
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
      resources_needed: data.resources_needed || '',
      expected_outcome: data.expected_outcome || '',
      strategic_value: data.strategic_value || '',
      campaign: data.campaign || null,
      date: data.date,
      recurrence_pattern: recurrencePattern,
      // You can also send the domain if needed
      domain: data.domain,
    };

    if (typeof onSave !== 'function') {
      console.error('onSave is not a function:', onSave);
      return;
    }

    try {
      onSave([timeSlot]);
    } catch (error) {
      console.error('Error in onSave:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              <label className="block text-sm font-medium mb-1">Title of Engagement</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., War Council, Battle Strategy, Training"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Commencement</label>
              <input
                type="time"
                value={data.startTime}
                onChange={(e) => setData({ ...data, startTime: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Conclusion</label>
              <input
                type="time"
                value={data.endTime}
                onChange={(e) => setData({ ...data, endTime: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Strategic Date Picker */}
          <StrategicDatePicker
            onDateSelect={handleDateSelect}
            selectedDate={data.date ? new Date(`${data.date}T00:00:00`) : new Date()}
            recurrencePattern={recurrencePattern}
            setRecurrencePattern={setRecurrencePattern}
          />

          {/* Imperial Importance Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Imperial Importance</label>
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
            <label className="block text-sm font-medium mb-2">Align with Grand Campaign</label>
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
            <label className="block text-sm font-medium mb-1">Strategic Details</label>
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
              <label className="block text-sm font-medium mb-1">Required Resources</label>
              <textarea
                value={data.resources_needed}
                onChange={(e) => setData({ ...data, resources_needed: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Men, supplies, allies needed..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected Outcome</label>
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
