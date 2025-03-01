// src/components/completionMetricsModal/NutritionCompletionModal.jsx
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const NutritionCompletionModal = ({ action, onClose, onComplete }) => {
  const [data, setData] = useState({
    actualCalories: '',
    protein: '',
    carbs: '',
    fats: '',
    reflection: ''
  });

  const handleComplete = async () => {
    // Validate required field(s)
    if (!data.actualCalories) {
      alert("Pray, enter the actual calories consumed!");
      return;
    }

    const payload = {
      is_completed: true,
      metrics: {
        ...action.metrics,
        // Overwrite or add nutrition metrics
        calories: {
          ...action.metrics.calories,
          actual: data.actualCalories
        },
        macros: {
          protein: data.protein,
          carbs: data.carbs,
          fats: data.fats
        },
        completed_at: new Date().toISOString()
      },
      reflection: data.reflection,
      current_value: data.actualCalories, // using calories as the current value
      domain: action.domain,
      quality_rating: 'excellent',
      completion_notes: data.reflection
    };

    try {
      await onComplete(action.id, payload);
    } catch (error) {
      alert("Alas, an error hath occurred: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Complete Nutrition Tracking: {action.title}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Actual Calories Consumed</label>
            <input
              type="number"
              value={data.actualCalories}
              onChange={(e) => setData({ ...data, actualCalories: parseInt(e.target.value) || '' })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              placeholder="Enter actual calories"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm mb-2">Protein (g)</label>
              <input
                type="number"
                value={data.protein}
                onChange={(e) => setData({ ...data, protein: parseInt(e.target.value) || '' })}
                className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
                placeholder="Protein"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Carbs (g)</label>
              <input
                type="number"
                value={data.carbs}
                onChange={(e) => setData({ ...data, carbs: parseInt(e.target.value) || '' })}
                className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
                placeholder="Carbs"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Fats (g)</label>
              <input
                type="number"
                value={data.fats}
                onChange={(e) => setData({ ...data, fats: parseInt(e.target.value) || '' })}
                className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
                placeholder="Fats"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Reflect upon thy nourishment</label>
            <textarea
              value={data.reflection}
              onChange={(e) => setData({ ...data, reflection: e.target.value })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              rows="4"
              placeholder="Share thy insights and reflections..."
            />
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Abandon Quest
          </button>
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-gold-500/20 hover:bg-gold-500/30 text-gold-900 dark:text-gold-100 rounded-lg transition-all flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Complete Quest
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionCompletionModal;
