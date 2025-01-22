// Editor/BattleSessionsConfig.jsx
import React, { useState } from 'react';
import { Plus, Minus, Swords, Clock, Shield } from 'lucide-react';

const BattleSessionsConfig = ({ onChange }) => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      focusDuration: 25,
      breakDuration: 5,
    }
  ]);

  const addSession = () => {
    const newId = sessions.length + 1;
    const newSessions = [...sessions, {
      id: newId,
      focusDuration: 25,
      breakDuration: 5,
    }];
    setSessions(newSessions);
    updateParent(newSessions);
  };

  const removeSession = (id) => {
    if (sessions.length > 1) {
      const updatedSessions = sessions.filter(session => session.id !== id);
      setSessions(updatedSessions);
      updateParent(updatedSessions);
    }
  };

  const updateSession = (id, field, value) => {
    const updatedSessions = sessions.map(session => {
      if (session.id === id) {
        return { ...session, [field]: parseInt(value) || 0 };
      }
      return session;
    });
    setSessions(updatedSessions);
    updateParent(updatedSessions);
  };

  const updateParent = (updatedSessions) => {
    if (onChange) {
      onChange({
        sessions: updatedSessions,
        totalFocusTime: updatedSessions.reduce((sum, session) => sum + session.focusDuration, 0),
        totalBreakTime: updatedSessions.reduce((sum, session) => sum + session.breakDuration, 0),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Swords className="w-5 h-5 text-blue-600" />
          Battle Sessions Configuration
        </h3>
      </div>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div 
            key={session.id}
            className="bg-blue-50 p-4 rounded-lg border border-blue-100 relative"
          >
            <div className="absolute -left-3 -top-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Battle Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={session.focusDuration}
                  onChange={(e) => updateSession(session.id, 'focusDuration', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Rest Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={session.breakDuration}
                  onChange={(e) => updateSession(session.id, 'breakDuration', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {sessions.length > 1 && (
              <button
                onClick={() => removeSession(session.id)}
                className="absolute -right-2 -top-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addSession}
        className="w-full py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Another Battle Session
      </button>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Battle Time:</span>
            <span className="font-semibold text-gray-800 ml-2">
              {sessions.reduce((sum, session) => sum + session.focusDuration, 0)} minutes
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Rest Time:</span>
            <span className="font-semibold text-gray-800 ml-2">
              {sessions.reduce((sum, session) => sum + session.breakDuration, 0)} minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleSessionsConfig;
