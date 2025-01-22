// Editor/ImportanceSelector.jsx
import React from 'react';
import { Shield, Sword, Scroll } from 'lucide-react';

const ImportanceSelector = ({ data, setData }) => {
  const options = [
    { id: 'critical', label: 'Critical for Empire', icon: Shield, color: 'bg-red-200' },
    { id: 'strategic', label: 'Strategic Importance', icon: Sword, color: 'bg-yellow-200' },
    { id: 'routine', label: 'Routine Matter', icon: Scroll, color: 'bg-blue-200' },
  ];
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Imperial Importance</label>
      <div className="grid grid-cols-3 gap-2">
        {options.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setData({ ...data, importance: id, color })}
            className={`p-3 rounded-lg flex items-center gap-2 transition-all duration-200 ${
              data.importance === id ? color + ' ring-2 ring-blue-500' : 'bg-gray-50'
            }`}
          >
            <Icon size={16} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImportanceSelector;
