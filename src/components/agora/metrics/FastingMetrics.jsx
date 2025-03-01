// src/components/agora/metrics/FastingMetrics.jsx

import React from 'react';

const FastingMetrics = ({ metrics, setMetrics }) => {
  const fastingTypes = [
    "16/8 (Warrior Fast)",
    "20/4 (Spartan Protocol)",
    "OMAD (Monk's Discipline)",
    "36hr (Ascetic Trial)",
    "48hr (Mystic Journey)",
    "72hr+ (Oracle's Path)"
  ];

  // Add debug logging to track state updates
  const handleInputChange = (field, value) => {
    console.log('Updating field:', field, 'with value:', value);
    console.log('Current metrics before update:', metrics);
    
    const newMetrics = {
      ...metrics,
      [field]: value
    };
    
    console.log('New metrics after update:', newMetrics);
    setMetrics(newMetrics);  // Send the complete new object
  };

  // Initialize metrics if they're empty
  React.useEffect(() => {
    if (!metrics || Object.keys(metrics).length === 0) {
      setMetrics({
        fastType: '',
        targetDuration: '',
        weightTracking: false,
        startingWeight: '',
        targetWeight: '',
        meditationIncluded: false,
        prayerIncluded: false
      });
    }
  }, []); // Only run once on mount

  return (
    <div className="space-y-4">
      {/* Fast Type */}
      <div>
        <label className="block text-sm mb-2">Fasting Protocol</label>
        <select
          value={metrics.fastType || ''}
          onChange={(e) => handleInputChange('fastType', e.target.value)}
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
        >
          <option value="">Select your warrior's fast...</option>
          {fastingTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Time Target */}
      <div>
        <label className="block text-sm mb-2">Target Duration (hours)</label>
        <input
          type="number"
          value={metrics.targetDuration || ''}
          onChange={(e) => handleInputChange('targetDuration', e.target.value ? parseInt(e.target.value) : '')}
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          min="1"
          max="168"
        />
      </div>

      {/* Weight Tracking Enable/Disable */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={metrics.weightTracking || false}
            onChange={(e) => handleInputChange('weightTracking', e.target.checked)}
            className="rounded border-gold-500/20"
          />
          <span className="text-sm">Enable weight tracking</span>
        </label>
      </div>

      {/* Weight goals (only if tracking enabled) */}
      {metrics.weightTracking && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Starting Weight (kg)</label>
            <input
              type="number"
              value={metrics.startingWeight || ''}
              onChange={(e) => handleInputChange('startingWeight', parseFloat(e.target.value) || '')}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Target Weight (kg)</label>
            <input
              type="number"
              value={metrics.targetWeight || ''}
              onChange={(e) => handleInputChange('targetWeight', parseFloat(e.target.value) || '')}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              step="0.1"
            />
          </div>
        </div>
      )}

      {/* Spiritual Focus */}
      <div className="flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={metrics.meditationIncluded || false}
            onChange={(e) => handleInputChange('meditationIncluded', e.target.checked)}
            className="rounded border-gold-500/20"
          />
          <span className="text-sm">Include meditation</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={metrics.prayerIncluded || false}
            onChange={(e) => handleInputChange('prayerIncluded', e.target.checked)}
            className="rounded border-gold-500/20"
          />
          <span className="text-sm">Include prayer</span>
        </label>
      </div>
    </div>
  );
};

export default FastingMetrics;  // Ensure this line exists
