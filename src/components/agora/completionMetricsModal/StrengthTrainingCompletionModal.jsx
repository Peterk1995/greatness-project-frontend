// src/components/completionModals/StrengthTrainingCompletionModal.jsx
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const StrengthTrainingCompletionModal = ({ action, onClose, onComplete }) => {
  const [data, setData] = useState({
    exercisesCompleted: '',
    restPeriodAchieved: '',
    energyLevel: 5,
    reflection: ''
  });

  const handleComplete = async () => {
    const payload = {
      is_completed: true,
      metrics: {
        ...action.metrics,
        exercises_completed: data.exercisesCompleted,
        rest_period_achieved: data.restPeriodAchieved,
        energy_level: data.energyLevel,
        completed_at: new Date().toISOString()
      },
      reflection: data.reflection,
      current_value: data.exercisesCompleted || 0,
      domain: action.domain,
      quality_rating: 'excellent',
      completion_notes: data.reflection
    };

    try {
      await onComplete(action.id, payload);
    } catch (error) {
      alert("Alas, an error hath befallen thy efforts: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Complete Strength Training: {action.title}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Exercises Completed (count)</label>
            <input
              type="number"
              value={data.exercisesCompleted}
              onChange={(e) => setData({ ...data, exercisesCompleted: parseInt(e.target.value) || '' })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              placeholder="Enter number of exercises completed"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Rest Period Achieved (sec)</label>
            <input
              type="number"
              value={data.restPeriodAchieved}
              onChange={(e) => setData({ ...data, restPeriodAchieved: parseInt(e.target.value) || '' })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              placeholder="Enter rest period in seconds"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Energy Level (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={data.energyLevel}
              onChange={(e) => setData({ ...data, energyLevel: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm mt-1">{data.energyLevel}</div>
          </div>
          <div>
            <label className="block text-sm mb-2">Valiant Reflection</label>
            <textarea
              value={data.reflection}
              onChange={(e) => setData({ ...data, reflection: e.target.value })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              rows="4"
              placeholder="Relate thy tale of strength and perseverance..."
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Abandon Quest
          </button>
          <button onClick={handleComplete} className="px-6 py-2 bg-gold-500/20 hover:bg-gold-500/30 text-gold-900 dark:text-gold-100 rounded-lg transition-all flex items-center gap-2">
            <Check className="w-5 h-5" />
            Complete Triumph
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrengthTrainingCompletionModal;
