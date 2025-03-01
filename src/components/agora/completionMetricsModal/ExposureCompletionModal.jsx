// src/components/completionModals/ExposureCompletionModal.jsx
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const ExposureCompletionModal = ({ action, onClose, onComplete }) => {
  const [data, setData] = useState({
    actualDuration: '',
    actualTemperature: '',
    breathingRounds: '',
    reflection: ''
  });

  const handleComplete = async () => {
    console.log("Starting completion with action:", action);
    
    const payload = {
      is_completed: true,
      metrics: {
        ...action.metrics,
        actual_duration: data.actualDuration,
        actual_temperature: data.actualTemperature,
        breathing_rounds: data.breathingRounds,
        completed_at: new Date().toISOString()
      },
      reflection: data.reflection,
      current_value: data.actualDuration || 0,
      domain: action.domain,
      quality_rating: 'excellent',
      completion_notes: data.reflection
    };
  
    console.log("Submitting completion payload:", payload);
  
    try {
      const result = await onComplete(action.id, payload);
      console.log("Completion result:", result);
    } catch (error) {
      console.error("Completion error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert("Alas, an error hath occurred: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Complete Cold Forge Training: {action.title}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={data.actualDuration}
              onChange={(e) => setData({ ...data, actualDuration: parseInt(e.target.value) || '' })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              placeholder="Enter actual duration"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Temperature (°C)</label>
            <input
              type="number"
              value={data.actualTemperature}
              onChange={(e) => setData({ ...data, actualTemperature: parseInt(e.target.value) || '' })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              placeholder="Enter temperature achieved"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Breathing Rounds</label>
            <input
              type="number"
              value={data.breathingRounds}
              onChange={(e) => setData({ ...data, breathingRounds: parseInt(e.target.value) || '' })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              placeholder="Enter breathing rounds performed"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Reflect on thy experience</label>
            <textarea
              value={data.reflection}
              onChange={(e) => setData({ ...data, reflection: e.target.value })}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              rows="4"
              placeholder="Share thy insights..."
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
            Complete Quest
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExposureCompletionModal;
