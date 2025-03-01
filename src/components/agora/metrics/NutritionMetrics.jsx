// src/components/agora/metrics/NutritionMetrics.jsx

import React from 'react';

const NutritionMetrics = ({ metrics, setMetrics }) => {
  // Because we have nested fields (calories, macros), let's create a helper:
  const handleChange = (fieldPath, value) => {
    const parts = fieldPath.split('.');
    const newMetrics = { ...metrics };

    if (parts.length === 1) {
      // e.g. "is_fasting"
      newMetrics[parts[0]] = value;
    } else if (parts.length === 2) {
      // e.g. "calories.target"
      if (!newMetrics[parts[0]]) newMetrics[parts[0]] = {};
      newMetrics[parts[0]][parts[1]] = value;
    }
    setMetrics(newMetrics);
  };

  const isFasting = metrics.is_fasting || false;
  const trackingEnabled = metrics.calories?.tracking_enabled || false;

  return (
    <div className="space-y-4">
      {/* is_fasting */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isFasting}
            onChange={(e) => handleChange('is_fasting', e.target.checked)}
          />
          <span className="text-sm">Is Fasting Right Now?</span>
        </label>
      </div>

      {/* Calories tracking */}
      <div className="border p-3 rounded-lg border-gold-500/20">
        <label className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={trackingEnabled}
            onChange={(e) => handleChange('calories.tracking_enabled', e.target.checked)}
          />
          <span className="text-sm">Track Calories</span>
        </label>

        {trackingEnabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Target (kcal)</label>
              <input
                type="number"
                value={metrics.calories?.target || ''}
                onChange={(e) => handleChange('calories.target', parseInt(e.target.value) || '')}
                className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Actual (kcal)</label>
              <input
                type="number"
                value={metrics.calories?.actual || ''}
                onChange={(e) => handleChange('calories.actual', parseInt(e.target.value) || '')}
                className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Macros */}
      <div className="border p-3 rounded-lg border-gold-500/20">
        <h4 className="font-semibold text-sm mb-2">Macros (grams)</h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs">Protein</label>
            <input
              type="number"
              value={metrics.macros?.protein || ''}
              onChange={(e) => handleChange('macros.protein', parseInt(e.target.value) || '')}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-1"
            />
          </div>
          <div>
            <label className="block text-xs">Carbs</label>
            <input
              type="number"
              value={metrics.macros?.carbs || ''}
              onChange={(e) => handleChange('macros.carbs', parseInt(e.target.value) || '')}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-1"
            />
          </div>
          <div>
            <label className="block text-xs">Fats</label>
            <input
              type="number"
              value={metrics.macros?.fats || ''}
              onChange={(e) => handleChange('macros.fats', parseInt(e.target.value) || '')}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionMetrics;
