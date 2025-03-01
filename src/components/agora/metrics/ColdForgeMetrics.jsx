const ColdForgeMetrics = ({ metrics, setMetrics }) => {
  const exposureTypes = [
    { id: 'cold_shower', label: 'Cold Shower' },
    { id: 'ice_bath', label: 'Ice Bath' },
    { id: 'cryo', label: 'Cryotherapy' },
    { id: 'winter_swim', label: 'Winter Swimming' }
  ];

  return (
    <div className="space-y-4">
      {/* Type of Cold Exposure */}
      <div>
        <label className="block text-sm mb-2">Type of Exposure</label>
        <select
          value={metrics.exposureType || ''}
          onChange={(e) => setMetrics({ exposureType: e.target.value })}
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
        >
          <option value="">Select type...</option>
          {exposureTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Duration and Temperature */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Target Duration (minutes)</label>
          <input
            type="number"
            value={metrics.targetDuration || ''}
            onChange={(e) => setMetrics({ targetDuration: e.target.value ? parseInt(e.target.value) : '' })}
            className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
            min="1"
            placeholder="e.g., 3"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Target Temperature (°C)</label>
          <input
            type="number"
            value={metrics.targetTemp || ''}
            onChange={(e) => setMetrics({ targetTemp: e.target.value ? parseInt(e.target.value) : '' })}
            className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
            max="20"
            placeholder="e.g., 10"
          />
        </div>
      </div>

      {/* Breathing Rounds */}
      <div>
        <label className="block text-sm mb-2">Breathing Rounds</label>
        <input
          type="number"
          value={metrics.breathingRounds || ''}
          onChange={(e) => setMetrics({ breathingRounds: e.target.value ? parseInt(e.target.value) : '' })}
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          min="0"
          placeholder="Number of breathing rounds"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm mb-2">Notes</label>
        <textarea
          value={metrics.notes || ''}
          onChange={(e) => setMetrics({ notes: e.target.value })}
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          rows="2"
          placeholder="Any additional notes..."
        />
      </div>
    </div>
  );
};

export default ColdForgeMetrics;