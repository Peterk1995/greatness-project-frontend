import React, { useState, useMemo } from 'react';
import { Trophy, Star, XCircle, Loader2, Clock } from 'lucide-react';
import { taskService } from '../../services/taskService';

const GREEK_QUOTES = [
  { quote: "Excellence is not an act, but a habit.", author: "Aristotle" },
  { quote: "Know thyself.", author: "Temple of Apollo at Delphi" },
  { quote: "The unexamined life is not worth living.", author: "Socrates" },
  { quote: "Well begun is half done.", author: "Aristotle" },
  { quote: "Make haste slowly.", author: "Ancient Greek Proverb" },
  { quote: "Everything flows.", author: "Heraclitus" },
  { quote: "To move the world, we must first move ourselves.", author: "Socrates" },
];

const FAILURE_QUOTES = [
  { quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Ancient Greek Spirit" },
  { quote: "Even Hercules failed before his triumphs.", author: "Greek Wisdom" },
  { quote: "From the seeds of defeat grow the flowers of victory.", author: "Spartan Proverb" },
];

export default function TaskCompletionModal({ task, campaigns, onSubmit, onClose }) {
  const [quality, setQuality] = useState('good');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [xpGained, setXpGained] = useState(null);
  const [xpBreakdown, setXpBreakdown] = useState(null);

  // Calculate time spent in the time slot
  const timeSpent = useMemo(() => {
    const duration = task.end_time - task.start_time;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
  }, [task]);

  // Randomly select a quote based on whether it's a failure or not
  const quote = useMemo(() => {
    const quotes = quality === 'Did not complete' ? FAILURE_QUOTES : GREEK_QUOTES;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [quality]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calculate duration as the Greeks would - in sunlit hours!
      const duration = task.end_time - task.start_time;
      
      // Send forth our proclamation to the gods (backend)!
      const result = await taskService.complete(task.id, {
        quality_rating: quality,
        completion_notes: notes,
        campaign_id: task.campaign,
        duration_minutes: duration  // Add this crucial measure of time!
      });
  
      // Log the oracle's response
      console.log('The Oracle proclaims:', result.data);
  
      // Show the divine rewards!
      setXpGained(result.data.xp_gained);
      setXpBreakdown({
        conquest_xp: result.data.xp_breakdown?.conquest_xp || 0,
        cultural_xp: result.data.xp_breakdown?.cultural_xp || 0,
        wisdom_xp: result.data.xp_breakdown?.wisdom_xp || 0,
        legacy_xp: result.data.xp_breakdown?.legacy_xp || 0
      });
  
      // Let the scrolls be updated!
      await onSubmit(result.data);
      
      // A moment to savor victory!
      setTimeout(() => {
        onClose();
      }, 2000);  // Give time to see the XP gained!
  
    } catch (error) {
      console.error('The Fates conspire against us:', error);
      alert('By Hades! Something went wrong. The scribes will investigate.');
    } finally {
      setLoading(false);
    }
  };

  const isFailure = quality === 'Did not complete';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className={`bg-gradient-to-r ${
          isFailure ? 'from-red-700 to-red-800' : 'from-blue-700 to-blue-800'
        } text-white px-6 py-4 rounded-t-lg border-b-4 border-yellow-500`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            {isFailure ? 'Record Defeat' : 'Record Victory'}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-200 mt-1">
            <Clock className="w-4 h-4" />
            Time in battle: {timeSpent}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-500 italic">
            <p className="text-gray-700">"{quote.quote}"</p>
            <p className="text-sm text-gray-500 mt-1">— {quote.author}</p>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium">Outcome Quality</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'perfect', label: 'Perfect Victory', icon: Trophy, color: 'text-yellow-500' },
                { value: 'great', label: 'Great Success', icon: Star, color: 'text-blue-500' },
                { value: 'good', label: 'Good Progress', icon: Star, color: 'text-green-500' },
                { value: 'poor', label: 'Poor Outcome', icon: XCircle, color: 'text-red-500' },
                { value: 'Did not complete', label: 'Task Failed', icon: XCircle, color: 'text-gray-500' },
              ].map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setQuality(value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    quality === value
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${color}`} />
                    <div className="font-medium">{label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {isFailure ? 'Record of Defeat' : 'Battle Notes'} (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder={isFailure ? 
                "Record the lessons learned from this defeat..." : 
                "Record your thoughts on this victory..."}
              rows={3}
            />
          </div>

          {xpGained !== null && xpBreakdown && (
            <div className="space-y-2">
              <div className="text-center font-bold text-2xl text-blue-600">
                +{xpGained} Total XP
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {xpBreakdown.conquest_xp > 0 && (
                  <div className="text-red-500">+{xpBreakdown.conquest_xp} Conquest</div>
                )}
                {xpBreakdown.cultural_xp > 0 && (
                  <div className="text-blue-500">+{xpBreakdown.cultural_xp} Cultural</div>
                )}
                {xpBreakdown.wisdom_xp > 0 && (
                  <div className="text-green-500">+{xpBreakdown.wisdom_xp} Wisdom</div>
                )}
                {xpBreakdown.legacy_xp > 0 && (
                  <div className="text-purple-500">+{xpBreakdown.legacy_xp} Legacy</div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              disabled={loading}
            >
              Retreat
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white rounded-lg flex items-center gap-2 ${
                isFailure 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Recording...
                </>
              ) : (
                isFailure ? 'Record Failure' : 'Record Victory'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
