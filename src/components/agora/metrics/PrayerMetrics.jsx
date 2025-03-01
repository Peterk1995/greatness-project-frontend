// src/components/agora/metrics/PrayerMetrics.jsx

import React from 'react';

const PrayerMetrics = ({ metrics, setMetrics }) => {
  // We expect fields: type (dropdown?), intentions (text), location (text), depth (range 1-10)
  
  const handleChange = (field, value) => {
    setMetrics({ ...metrics, [field]: value });
  };

  const prayerTypes = ['meditation','contemplation','vocal'];

  return (
    <div className="space-y-4">
      {/* Prayer Type */}
      <div>
        <label className="block text-sm mb-2">Type of Practice</label>
        <select
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          value={metrics.type || ''}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value="">Select type...</option>
          {prayerTypes.map(pt => (
            <option key={pt} value={pt}>{pt}</option>
          ))}
        </select>
      </div>

      {/* Intentions */}
      <div>
        <label className="block text-sm mb-2">Intentions</label>
        <textarea
          rows="2"
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          value={metrics.intentions || ''}
          onChange={(e) => handleChange('intentions', e.target.value)}
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm mb-2">Location</label>
        <input
          type="text"
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          value={metrics.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      {/* Depth (1-10) */}
      <div>
        <label className="block text-sm mb-2">Depth (1-10)</label>
        <input
          type="range"
          min="1"
          max="10"
          className="w-full"
          value={metrics.depth || 5}
          onChange={(e) => handleChange('depth', parseInt(e.target.value))}
        />
        <div className="text-center text-sm mt-1">
          {metrics.depth || 5}
        </div>
      </div>
    </div>
  );
};

export default PrayerMetrics;
