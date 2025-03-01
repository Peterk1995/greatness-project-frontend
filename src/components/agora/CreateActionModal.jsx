// src/components/CreateActionModal.js
import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import agoraService from '../../services/agoraService';

// Import all the metrics components
import ScriptureMetrics from './metrics/ScriptureMetrics';
import TrainingMetrics from './metrics/TrainingMetrics';
import ColdForgeMetrics from './metrics/ColdForgeMetrics';
import FastingMetrics from './metrics/FastingMetrics';
import CardioMetrics from './metrics/CardioMetrics';
import NutritionMetrics from './metrics/NutritionMetrics';
import PrayerMetrics from './metrics/PrayerMetrics';
import ReadingMetrics from './metrics/ReadingMetrics';

const CreateActionModal = ({ onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    discipline: '',
    metrics: {}
  });

  /**
   * Initialize metrics based on the full discipline object.
   * (We check both the discipline path and—for some types—the discipline name.)
   */
  const getInitialMetrics = (discipline) => {
    if (!discipline) return {};
    switch (discipline.path) {
      case 'scripture':
        return { targetPages: '', targetVerses: '', notes: '' };
      case 'training':
        // Differentiate between Cardio and Strength Training based on the discipline name
        if (discipline.name === 'Cardio Mastery') {
          return {
            type: '',
            distance: '',
            intensity: { heart_rate: { average: '', peak: '' } },
            performance: { perceived_effort: 5, post_session_energy: 5 }
          };
        } else {
          return { exercises: [], restPeriod: 60, energyLevel: 5 };
        }
      case 'exposure':
        return { exposureType: '', targetDuration: '', targetTemp: '', breathingRounds: '', notes: '' };
      case 'fasting':
        // If the discipline is Nutrition Tracking, use the nutrition metrics
        if (discipline.name === 'Nutrition Tracking') {
          return {
            is_fasting: false,
            calories: { tracking_enabled: false, target: '', actual: '' },
            macros: { protein: '', carbs: '', fats: '' }
          };
        } else {
          return {
            fastType: '',
            targetDuration: '',
            weightTracking: false,
            startingWeight: '',
            targetWeight: '',
            meditationIncluded: false,
            prayerIncluded: false
          };
        }
      case 'prayer':
        return { type: '', intentions: '', location: '', depth: 5 };
      case 'reading':
        return { genre: '', pages_goal: '', notes: '' };
      default:
        return {};
    }
  };

  // Fetch disciplines on mount
  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const data = await agoraService.disciplines.getAll();
        console.log('Fetched disciplines:', data);
        setDisciplines(data);
      } catch (err) {
        console.error('Error fetching disciplines:', err);
        setError('Failed to load disciplines');
      }
    };
    fetchDisciplines();
  }, []);

  // Handle discipline selection
  const handleDisciplineChange = (e) => {
    const discipline = disciplines.find(d => d.id === parseInt(e.target.value));
    console.log('Selected discipline:', discipline);
    setSelectedDiscipline(discipline);
    setFormData(prev => ({
      ...prev,
      discipline: discipline?.id || '',
      // Pass the full discipline object to get the proper initial metrics
      metrics: getInitialMetrics(discipline)
    }));
  };

  // Handle metrics change (merges new values into the existing metrics object)
  const handleMetricsChange = (newMetrics) => {
    console.log('Updating metrics:', newMetrics);
    setFormData(prev => {
      const updated = {
        ...prev,
        metrics: {
          ...prev.metrics,
          ...newMetrics
        }
      };
      console.log('Updated form data:', updated);
      return updated;
    });
  };

  // Validation function
  const validateForm = () => {
    if (!formData.title.trim() || !formData.discipline) {
      setError('Please fill in all required fields');
      return false;
    }

    if (selectedDiscipline?.path === 'scripture' &&
        (!formData.metrics.targetPages && !formData.metrics.targetVerses)) {
      setError('Please set at least one target (pages or verses)');
      return false;
    }

    if (selectedDiscipline?.path === 'exposure' &&
        (!formData.metrics.targetDuration || formData.metrics.targetDuration <= 0)) {
      setError('Please set a valid target duration');
      return false;
    }

    if (selectedDiscipline?.path === 'training') {
      if (selectedDiscipline.name === 'Cardio Mastery') {
        if (!formData.metrics.type) {
          setError('Please select a cardio type');
          return false;
        }
      } else if (!formData.metrics.exercises || formData.metrics.exercises.length === 0) {
        setError('Please add at least one exercise');
        return false;
      }
    }

    // Fasting validation
    if (selectedDiscipline?.path === 'fasting') {
      if (selectedDiscipline.name !== 'Nutrition Tracking') {
        if (!formData.metrics.fastType) {
          setError('Please select a fasting protocol');
          return false;
        }
        if (!formData.metrics.targetDuration || formData.metrics.targetDuration <= 0) {
          setError('Please set a valid target duration for your fast');
          return false;
        }
        if (formData.metrics.targetDuration > 168) {
          setError('Fasting duration cannot exceed 168 hours (7 days)');
          return false;
        }
        if (formData.metrics.startingWeight && formData.metrics.targetWeight &&
            formData.metrics.targetWeight >= formData.metrics.startingWeight) {
          setError('Target weight should be less than starting weight for a fast');
          return false;
        }
      }
      // (You might add extra validation for Nutrition Tracking if needed.)
    }

    setError(null); // Clear any previous errors
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    console.log('Form Data before submission:', formData);

    try {
      if (!selectedDiscipline) throw new Error('No discipline selected');

      // Build the submission data.
      // Start with some common fields:
      let metricsPayload = {
        ...formData.metrics,
        // Use one of the fields as the target value (for example, pages or duration)
        target_value: formData.metrics.targetPages ||
                      formData.metrics.targetDuration ||
                      formData.metrics.distance ||
                      0
      };

      // Append extra fields based on discipline type/name:
      if (selectedDiscipline.path === 'scripture') {
        metricsPayload = {
          ...metricsPayload,
          secondary_metrics: {
            verses_to_master: formData.metrics.targetVerses,
            study_notes: formData.metrics.notes
          }
        };
      } else if (selectedDiscipline.path === 'training') {
        if (selectedDiscipline.name === 'Cardio Mastery') {
          metricsPayload = {
            ...metricsPayload,
            cardio_type: formData.metrics.type,
            distance: formData.metrics.distance,
            intensity: formData.metrics.intensity,
            performance: formData.metrics.performance
          };
        } else {
          metricsPayload = {
            ...metricsPayload,
            exercises: formData.metrics.exercises,
            rest_period: formData.metrics.restPeriod,
            energy_level: formData.metrics.energyLevel
          };
        }
      } else if (selectedDiscipline.path === 'exposure') {
        metricsPayload = {
          ...metricsPayload,
          exposure_type: formData.metrics.exposureType,
          target_temp: formData.metrics.targetTemp,
          breathing_rounds: formData.metrics.breathingRounds,
          notes: formData.metrics.notes
        };
      } else if (selectedDiscipline.path === 'fasting') {
        if (selectedDiscipline.name === 'Nutrition Tracking') {
          metricsPayload = {
            ...metricsPayload,
            is_fasting: formData.metrics.is_fasting,
            calories: formData.metrics.calories,
            macros: formData.metrics.macros
          };
        } else {
          metricsPayload = {
            ...metricsPayload,
            fast_type: formData.metrics.fastType,
            starting_weight: formData.metrics.startingWeight,
            target_weight: formData.metrics.targetWeight
          };
        }
      } else if (selectedDiscipline.path === 'prayer') {
        metricsPayload = {
          ...metricsPayload,
          prayer_type: formData.metrics.type,
          intentions: formData.metrics.intentions,
          location: formData.metrics.location,
          depth: formData.metrics.depth
        };
      } else if (selectedDiscipline.path === 'reading') {
        metricsPayload = {
          ...metricsPayload,
          genre: formData.metrics.genre,
          pages_goal: formData.metrics.pages_goal,
          notes: formData.metrics.notes
        };
      }

      // Build the complete submission object
      const submitData = {
        title: formData.title.trim(),
        discipline: formData.discipline,
        action_type: 'daily',
        domain: selectedDiscipline.path, // or another field if needed
        difficulty: 'mortal', // adjust as needed
        metrics: metricsPayload
      };

      console.log('Submitting data:', submitData);

      const result = await agoraService.actions.create(submitData);
      console.log('Submission result:', result);

      onSave?.(result);
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage = err.response?.data?.detail ||
                           err.response?.data?.message ||
                           'Failed to create action';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate metrics form based on the selected discipline.
  const renderMetricsForm = () => {
    console.log('Rendering metrics for discipline:', selectedDiscipline);
    if (!selectedDiscipline) return null;

    switch(selectedDiscipline.path) {
      case 'scripture':
        return <ScriptureMetrics metrics={formData.metrics} setMetrics={handleMetricsChange} />;
      case 'training':
        if (selectedDiscipline.name === 'Cardio Mastery') {
          return <CardioMetrics metrics={formData.metrics} setMetrics={handleMetricsChange} />;
        } else {
          return <TrainingMetrics metrics={formData.metrics} setMetrics={handleMetricsChange} />;
        }
      case 'exposure':
        return <ColdForgeMetrics metrics={formData.metrics} setMetrics={handleMetricsChange} />;
      case 'fasting':
        if (selectedDiscipline.name === 'Nutrition Tracking') {
          return <NutritionMetrics metrics={formData.metrics} setMetrics={handleMetricsChange} />;
        } else {
          return <FastingMetrics metrics={formData.metrics} setMetrics={handleMetricsChange} />;
        }
      case 'prayer':
        return <PrayerMetrics metrics={formData.metrics} setMetrics={handleMetricsChange} />;
      case 'reading':
        return <ReadingMetrics metrics={formData.metrics} setMetrics={handleMetricsChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
              Creating action...
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create New Action</h2>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-3"
              required
            />
          </div>

          {/* Discipline Selection */}
          <div>
            <label className="block text-sm mb-2">Discipline</label>
            <select
              value={formData.discipline}
              onChange={handleDisciplineChange}
              className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-3"
              required
            >
              <option value="">Select a discipline...</option>
              {disciplines.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Dynamic Metrics Form */}
          {selectedDiscipline && (
            <div className="mt-4">
              {renderMetricsForm()}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gold-500/20 hover:bg-gold-500/30 text-gold-900 dark:text-gold-100 rounded-lg transition-all flex items-center"
              disabled={loading}
            >
              {loading ? 'Creating...' : <>
                <Check className="w-5 h-5 mr-2" />
                Create
              </>}
            </button>
          </div>
        </form>

        {/* Debug Display (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({ selectedDiscipline, formData }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateActionModal;
