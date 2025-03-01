// ScriptureMetrics.jsx
const ScriptureMetrics = ({ metrics, setMetrics }) => {
  console.log('Current metrics in ScriptureMetrics:', metrics); // Debug log

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field}:`, value); // Debug log
    setMetrics({
      ...metrics,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Target Pages</label>
          <input
            type="number"
            value={metrics?.targetPages || ''}
            onChange={(e) => handleInputChange('targetPages', parseInt(e.target.value) || 0)}
            className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Target Verses</label>
          <input
            type="number"
            value={metrics?.targetVerses || ''}
            onChange={(e) => handleInputChange('targetVerses', parseInt(e.target.value) || 0)}
            className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
            min="0"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-2">Study Notes</label>
        <textarea
          value={metrics?.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-2"
          rows="3"
        />
      </div>
    </div>
  );
};

export default ScriptureMetrics;