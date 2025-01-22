// Editor/StrategicDatePicker.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Repeat, Sun, Star, Calendar } from 'lucide-react';
import { format, addMonths, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isBefore, startOfDay, isToday } from 'date-fns';

const StrategicDatePicker = ({ onDateSelect, selectedDate, recurrencePattern, setRecurrencePattern }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

export default StrategicDatePicker;
