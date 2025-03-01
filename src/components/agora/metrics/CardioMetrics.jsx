// src/components/agora/metrics/CardioMetrics.jsx

import React from 'react';

const CardioMetrics = ({ metrics, setMetrics }) => {
  // "type": array => you can show a dropdown
  const cardioTypes = ['running','cycling','swimming','rowing','hiit'];

  // Helper to handle nested objects (like intensity.heart_rate.*)
  const handleChange = (fieldPath, value) => {
    // e.g. fieldPath can be "intensity.heart_rate.average"
    const parts = fieldPath.split('.');
    // We'll do a naive approach to handle up to 3 levels deep
    const newMetrics = { ...metrics };

    if (parts.length === 1) {
      // e.g. "distance"
      newMetrics[parts[0]] = value;
    } else if (parts.length === 2) {
      // e.g. "intensity" and "heart_rate"
      if (!newMetrics[parts[0]]) newMetrics[parts[0]] = {};
      newMetrics[parts[0]][parts[1]] = value;
    } else if (parts.length === 3) {
      // e.g. "intensity.heart_rate.average"
      if (!newMetrics[parts[0]]) newMetrics[parts[0]] = {};
      if (!newMetrics[parts[0]][parts[1]]) newMetrics[parts[0]][parts[1]] = {};
      newMetrics[parts[0]][parts[1]][parts[2]] = value;
    }

    setMetrics(newMetrics);
  };

  // We can read existing values with optional chaining
  const distanceVal = metrics.distance || '';
  const hrAvg = metrics.intensity?.heart_rate?.average || '';
  const hrPeak = metrics.intensity?.heart_rate?.peak || '';
  const perceivedEffort = metrics.performance?.perceived_effort || 5;
  const postSessionEnergy = metrics.performance?.post_session_energy || 5;

  return (
    <div className="space-y-4">
      {/* Cardio Type */}
      <div>
        <label className="block text-sm mb-2">Cardio Type</label>
        <select
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          value={metrics.type || ''}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value="">Select type...</option>
          {cardioTypes.map(ct => (
            <option key={ct} value={ct}>{ct}</option>
          ))}
        </select>
      </div>

      {/* Distance */}
      <div>
        <label className="block text-sm mb-2">Distance (km/miles)</label>
        <input
          type="number"
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          value={distanceVal}
          onChange={(e) => handleChange('distance', parseFloat(e.target.value) || '')}
        />
      </div>

      {/* Heart Rate */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Avg Heart Rate (bpm)</label>
          <input
            type="number"
            className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
            value={hrAvg}
            onChange={(e) => handleChange('intensity.heart_rate.average', parseInt(e.target.value) || '')}
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Peak Heart Rate (bpm)</label>
          <input
            type="number"
            className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
            value={hrPeak}
            onChange={(e) => handleChange('intensity.heart_rate.peak', parseInt(e.target.value) || '')}
          />
        </div>
      </div>

      {/* Performance */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Perceived Effort (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={perceivedEffort}
            onChange={(e) => handleChange('performance.perceived_effort', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm mt-1">{perceivedEffort}</div>
        </div>
        <div>
          <label className="block text-sm mb-2">Post-Session Energy (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={postSessionEnergy}
            onChange={(e) => handleChange('performance.post_session_energy', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm mt-1">{postSessionEnergy}</div>
        </div>
      </div>
    </div>
  );
};

export default CardioMetrics;
