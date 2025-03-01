import React, { useState } from 'react';

const TrainingMetrics = ({ metrics, setMetrics }) => {
  const [exercise, setExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  const handleAddExercise = () => {
    if (!exercise.name) return;
    const newExercises = [...(metrics.exercises || []), exercise];
    setMetrics({ ...metrics, exercises: newExercises });
    setExercise({ name: '', sets: '', reps: '', weight: '' });
  };

  const handleRemoveExercise = (index) => {
    const newExercises = metrics.exercises.filter((_, i) => i !== index);
    setMetrics({ ...metrics, exercises: newExercises });
  };

  const handleChangeField = (field, value) => {
    setExercise(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Current Exercises */}
      <div>
        {metrics.exercises?.map((ex, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 p-2 bg-gold-500/5 rounded-lg mb-2"
          >
            <span className="flex-1">
              {ex.name} ({ex.sets}×{ex.reps} @ {ex.weight} kg)
            </span>
            <button
              type="button"
              onClick={() => handleRemoveExercise(index)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add New Exercise */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Exercise name"
          value={exercise.name}
          onChange={(e) => handleChangeField('name', e.target.value)}
          className="bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="Sets"
            value={exercise.sets}
            onChange={(e) => handleChangeField('sets', e.target.value)}
            className="bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Reps"
            value={exercise.reps}
            onChange={(e) => handleChangeField('reps', e.target.value)}
            className="bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="kg"
            value={exercise.weight}
            onChange={(e) => handleChangeField('weight', e.target.value)}
            className="bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddExercise}
        className="w-full p-2 bg-gold-500/10 hover:bg-gold-500/20 rounded-lg"
      >
        Add Exercise
      </button>

      {/* Rest Period / Energy Level (Optional) */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm mb-2">Rest Period (sec)</label>
          <input
            type="number"
            value={metrics.restPeriod || 60}
            onChange={(e) =>
              setMetrics({ ...metrics, restPeriod: parseInt(e.target.value) || 0 })
            }
            className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Energy Level (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={metrics.energyLevel || 5}
            onChange={(e) =>
              setMetrics({ ...metrics, energyLevel: parseInt(e.target.value) })
            }
            className="w-full"
          />
          <div className="text-center text-sm mt-1">
            {metrics.energyLevel || 5}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingMetrics;
