import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const FastingCompletionModal = ({ action, onClose, onComplete }) => {
  const [completionData, setCompletionData] = useState({
    // Physical metrics
    finalWeight: '',
    energyLevel: 5,
    mentalClarity: 5,
    
    // Breaking fast method
    breakingMethod: '',
    
    // Reflection
    reflection: '',
  });

  const breakingMethods = [
    "bone_broth (Gentle Recovery)",
    "fruits (Light Return)",
    "light_meal (Warrior's Feast)",
    "ceremonial_feast (Victory Celebration)"
  ];

  const handleComplete = async () => {
    console.log('Starting completion with action:', action);
    
    // Match the structure expected by the API
    const finalData = {
      is_completed: true,
      metrics: {
        ...action.metrics, // Keep existing metrics
        final_weight: completionData.finalWeight,
        energy_level: completionData.energyLevel,
        mental_clarity: completionData.mentalClarity,
        breaking_method: completionData.breakingMethod,
        completed_at: new Date().toISOString()
      },
      reflection: completionData.reflection,
      current_value: action.metrics?.targetDuration || 0,
      // Add these fields that were in your original completion data
      domain: action.domain,
      completed_at: new Date().toISOString(),
      quality_rating: 'great', // You might want to make this dynamic
      completion_notes: completionData.reflection
    };
  
    console.log('Submitting completion data:', finalData);
    
    try {
      await onComplete(action.id, finalData);
      console.log('Successfully completed action');
    } catch (error) {
      console.error('Failed to complete:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to complete the action: ' + (error.response?.data?.detail || 'Please try again'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Complete Fast: {action.title}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form content */}
        <div className="space-y-6">
          {/* Physical Metrics */}
          {action.metrics?.weightTracking && (
            <div>
              <label className="block text-sm mb-2">Final Weight (kg)</label>
              <input
                type="number"
                value={completionData.finalWeight}
                onChange={(e) => setCompletionData(prev => ({...prev, finalWeight: parseFloat(e.target.value) || ''}))}
                className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
                step="0.1"
              />
            </div>
          )}

          {/* Energy and Mental Clarity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Physical Energy (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={completionData.energyLevel}
                onChange={(e) => setCompletionData(prev => ({...prev, energyLevel: parseInt(e.target.value)}))}
                className="w-full"
              />
              <div className="text-center text-sm mt-1">{completionData.energyLevel}</div>
            </div>
            <div>
              <label className="block text-sm mb-2">Mental Clarity (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={completionData.mentalClarity}
                onChange={(e) => setCompletionData(prev => ({...prev, mentalClarity: parseInt(e.target.value)}))}
                className="w-full"
              />
              <div className="text-center text-sm mt-1">{completionData.mentalClarity}</div>
            </div>
          </div>

          {/* Breaking Method */}
          <div>
            <label className="block text-sm mb-2">Breaking Fast Method</label>
            <select
              value={completionData.breakingMethod}
              onChange={(e) => setCompletionData(prev => ({...prev, breakingMethod: e.target.value}))}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
            >
              <option value="">Select method...</option>
              {breakingMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          {/* Reflection */}
          <div>
            <label className="block text-sm mb-2">Warrior's Reflection</label>
            <textarea
              value={completionData.reflection}
              onChange={(e) => setCompletionData(prev => ({...prev, reflection: e.target.value}))}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
              rows="4"
              placeholder="Share your insights from this battle with hunger..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-gold-500/20 hover:bg-gold-500/30 
                     text-gold-900 dark:text-gold-100 rounded-lg
                     transition-all flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Complete Fast
          </button>
        </div>
      </div>
    </div>
  );
};

export default FastingCompletionModal;