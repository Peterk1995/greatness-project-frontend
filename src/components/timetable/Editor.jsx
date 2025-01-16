// Editor.jsx
import React, { useState } from 'react';
import { X, Shield, Sword, Scroll } from 'lucide-react';

export const Editor = ({ onSave, onCancel, initialTime = 0, eventData = null }) => {
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
    strategic_value: eventData?.strategic_value || ''
  });

  const days = [
    { id: 'Mon', label: 'Monday' },
    { id: 'Tue', label: 'Tuesday' },
    { id: 'Wed', label: 'Wednesday' },
    { id: 'Thu', label: 'Thursday' },
    { id: 'Fri', label: 'Friday' }
  ];

  const importanceLevels = [
    { id: 'critical', label: 'Critical for Empire', icon: Shield, color: 'bg-red-200' },
    { id: 'strategic', label: 'Strategic Importance', icon: Sword, color: 'bg-yellow-200' },
    { id: 'routine', label: 'Routine Matter', icon: Scroll, color: 'bg-blue-200' }
  ];

  const frequencies = [
    { id: 'once', label: 'Single Battle/Event' },
    { id: 'daily', label: 'Daily Training/Review' },
    { id: 'weekly', label: 'Weekly Council' }
  ];

  const toggleDay = (dayId) => {
    setData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter(d => d !== dayId)
        : [...prev.selectedDays, dayId]
    }));
  };

  const handleSubmit = () => {
    if (!data.name.trim()) {
      alert('Every conquest needs a name, my lord');
      return;
    }
    if (!data.selectedDays.length) {
      alert('Select the day(s) of battle, great one');
      return;
    }

    // Create time slots for each selected day
    const timeSlots = data.selectedDays.map(day => ({
      ...data,
      day,
    }));

    onSave(timeSlots);
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

          {/* Importance Level Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Imperial Importance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {importanceLevels.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setData({ ...data, importance: id, color })}
                  className={`p-3 rounded-lg flex items-center gap-2
                    ${data.importance === id ? color + ' ring-2 ring-blue-500' : 'bg-gray-50'}
                    transition-all duration-200`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
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

          {/* Days Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Days of Execution
            </label>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${data.selectedDays.includes(day.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
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