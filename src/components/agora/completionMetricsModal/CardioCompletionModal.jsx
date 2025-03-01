// src/components/completionModals/CardioCompletionModal.jsx
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const CardioCompletionModal = ({ action, onClose, onComplete }) => {
  const [data, setData] = useState({
    actualDistance: '',
    averageHeartRate: '',
    peakHeartRate: '',
    perceivedEffort: 5,
    postSessionEnergy: 5,
    reflection: ''
  });

  const handleComplete = async () => {
    const payload = {
      is_completed: true,
      metrics: {
        ...action.metrics,
        actual_distance: data.actualDistance,
        average_heart_rate: data.averageHeartRate,
        peak_heart_rate: data.peakHeartRate,
        perceived_effort: data.perceivedEffort,
        post_session_energy: data.postSessionEnergy,
        completed_at: new Date().toISOString()
      },
      reflection: data.reflection,
      current_value: data.actualDistance || 0,
      domain: action.domain,
      quality_rating: 'excellent',
      completion_notes: data.reflection
    };

    try {
      await onComplete(action.id, payload);
    } catch (error) {
      alert("Alas, an error has befallen thy endeavor: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Complete Cardio Mastery: {action.title}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Distance Covered (km/miles)</label>
            <input
              type="number"
              value={data.actualDistance}
              onChange={(e) => setData({ ...data, actualDistance: parseFloat(e.target.value) || '' })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              placeholder="Enter distance covered"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Avg Heart Rate (bpm)</label>
              <input
                type="number"
                value={data.averageHeartRate}
                onChange={(e) => setData({ ...data, averageHeartRate: parseInt(e.target.value) || '' })}
                className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
                placeholder="Enter average heart rate"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Peak Heart Rate (bpm)</label>
              <input
                type="number"
                value={data.peakHeartRate}
                onChange={(e) => setData({ ...data, peakHeartRate: parseInt(e.target.value) || '' })}
                className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
                placeholder="Enter peak heart rate"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Perceived Effort (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={data.perceivedEffort}
                onChange={(e) => setData({ ...data, perceivedEffort: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-center text-sm mt-1">{data.perceivedEffort}</div>
            </div>
            <div>
              <label className="block text-sm mb-2">Post-Session Energy (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={data.postSessionEnergy}
                onChange={(e) => setData({ ...data, postSessionEnergy: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-center text-sm mt-1">{data.postSessionEnergy}</div>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Heroic Reflection</label>
            <textarea
              value={data.reflection}
              onChange={(e) => setData({ ...data, reflection: e.target.value })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              rows="4"
              placeholder="Speak thy truth of the endeavor..."
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

export default CardioCompletionModal;
