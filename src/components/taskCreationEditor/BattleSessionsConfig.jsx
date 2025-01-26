// Editor/BattleSessionsConfig.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Minus, Swords, Clock, Shield, Flag } from 'lucide-react';

// Strategic Reserve Calculation Function
const calculateStrategicReserve = (taskStartTime, taskEndTime, totalBattleTime) => {
  if (!taskStartTime || !taskEndTime) {
    return 0; // Handle cases where task times are missing
  }
  // Convert task times to minutes
  const [startHours, startMinutes] = taskStartTime.split(':').map(Number);
  const [endHours, endMinutes] = taskEndTime.split(':').map(Number);

  const taskStartMinutes = (startHours * 60) + startMinutes;
  const taskEndMinutes = (endHours * 60) + endMinutes;

  // Calculate total task duration
  const taskDuration = taskEndMinutes - taskStartMinutes;

  // Calculate strategic reserve
  const strategicReserve = taskDuration - totalBattleTime;

  return strategicReserve;
};

// BattleSessionsConfig Component with props for onChange and task times
const BattleSessionsConfig = ({ onChange, taskStartTime, taskEndTime }) => {
  // State for Chronos enablement and session management
  const [isChronosEnabled, setIsChronosEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: 1,
      focusDuration: 25,
      breakDuration: 5,
    }
  ]);
  const [battleSessions, setBattleSessions] = useState(null);

  // Helper function to convert "HH:MM" time strings to minutes
  const convertTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Function to add a new battle session
  const addSession = () => {
    const newId = sessions.length + 1;
    const newSessions = [...sessions, {
      id: newId,
      focusDuration: 25,
      breakDuration: 5,
    }];
    setSessions(newSessions);
    handleSessionsChange(newSessions, isChronosEnabled);
  };

  // Function to remove a battle session by ID
  const removeSession = (id) => {
    if (sessions.length > 1) {
      const updatedSessions = sessions.filter(session => session.id !== id);
      setSessions(updatedSessions);
      handleSessionsChange(updatedSessions, isChronosEnabled);
    }
  };

  // Function to update a specific session field
  const updateSession = (id, field, value) => {
    const updatedSessions = sessions.map(session => {
      if (session.id === id) {
        return { ...session, [field]: parseInt(value) || 0 };
      }
      return session;
    });
    setSessions(updatedSessions);
    handleSessionsChange(updatedSessions, isChronosEnabled);
  };

  // Handler for changes in battle sessions configuration
  const handleSessionsChange = (updatedSessions, chronosEnabled) => {
    console.log("BattleSessionsConfig onChange received:", updatedSessions);
    // Calculate total focus and break times
    const totalFocusTime = updatedSessions.reduce((sum, s) => sum + s.focusDuration, 0);
    const totalBreakTime = updatedSessions.reduce((sum, s) => sum + s.breakDuration, 0);

    // Prepare session data for parent component
    const sessionsData = chronosEnabled ? {
      sessions: updatedSessions,
      totalFocusTime,
      totalBreakTime,
      enabled: chronosEnabled,
      singleSessionDuration: totalFocusTime + totalBreakTime, // Total duration of all sessions
    } : { enabled: chronosEnabled };

    setBattleSessions(sessionsData);
    setIsChronosEnabled(Boolean(chronosEnabled));
    onChange(sessionsData); // Notify parent component of changes
  };

  // Effect to handle Chronos toggle changes
  useEffect(() => {
    handleSessionsChange(sessions, isChronosEnabled);
  }, [isChronosEnabled]); // Dependency on isChronosEnabled

  return (
    <div>
      {/* Battle Sessions Configuration Label */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Battle Sessions (Pomodoro)
        </label>
      </div>

      {/* Macedonian Battle Standard Toggle */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-800 to-yellow-700 rounded-lg border-2 border-yellow-500 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Flag className={`w-8 h-8 ${isChronosEnabled ? 'text-yellow-300' : 'text-gray-400'} transition-colors duration-300`} />
            <div className="absolute -top-1 -right-1">
              <span className="text-2xl">⚔️</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-yellow-100">Macedonian Battle Standard</h3>
            <p className="text-yellow-200 text-sm italic">"By Zeus' thunder, enable the divine Chronos cycles!"</p>
          </div>
        </div>
        <button
          onClick={() => setIsChronosEnabled(!isChronosEnabled)}
          className={`px-4 py-2 rounded-lg font-bold transition-all duration-300
            ${isChronosEnabled
              ? 'bg-yellow-500 text-black hover:bg-yellow-400'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {isChronosEnabled ? 'Standard Raised!' : 'Raise Standard'}
        </button>
      </div>

      {/* Configuration UI - Shown when Chronos is enabled */}
      {isChronosEnabled && (
        <>
          <div className="flex items-center justify-between mb-4 mt-6"> {/* Added mt-6 for spacing */}
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

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
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
              {taskStartTime && taskEndTime && (
                <div className="col-span-2 mt-2">
                  <span className="text-gray-600">Strategic Reserve:</span>
                  <span className="font-semibold text-gray-800 ml-2">
                    {calculateStrategicReserve(
                      taskStartTime,
                      taskEndTime,
                      sessions.reduce((sum, session) => sum + session.focusDuration + session.breakDuration, 0)
                    )} minutes
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Strategic Time Analysis Display */}
          {battleSessions && isChronosEnabled && taskStartTime && taskEndTime && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Strategic Time Analysis</span>
              </div>
              <div className="mt-2 text-sm text-yellow-700">
                {/* Time Slot and Strategic Reserve Calculation & Display */}
                {(() => {
                  const startMinutes = convertTimeToMinutes(taskStartTime);
                  const endMinutes = convertTimeToMinutes(taskEndTime);
                  const slotDuration = endMinutes - startMinutes;
                  const totalBattleTime = battleSessions.totalFocusTime + battleSessions.totalBreakTime;
                  const strategicReserve = slotDuration - totalBattleTime;

                  return (
                    <>
                      <p>Battle Sessions: {battleSessions.totalFocusTime} minutes</p>
                      <p>Rest Periods: {battleSessions.totalBreakTime} minutes</p>
                      <p className="mt-1 font-medium text-yellow-800">
                        {strategicReserve > 0 ? (
                          `Strategic Reserve: ${strategicReserve} minutes available for additional maneuvers`
                        ) : (
                          `Battle plan requires extending time slot by ${Math.abs(strategicReserve)} minutes`
                        )}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BattleSessionsConfig;