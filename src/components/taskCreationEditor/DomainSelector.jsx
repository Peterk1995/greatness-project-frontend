// Editor/DomainSelector.jsx
import React from 'react';
import { Sword, Shield, Scroll, Star } from 'lucide-react';

const DomainSelector = ({ data, setData }) => {
  const domains = [
    {
      id: 'conquest',
      label: 'Conquest & Battle',
      greekLabel: 'Κατάκτηση',
      icon: Sword,
      description: 'Path of the Warrior',
      color: 'from-red-500 to-red-700',
    },
    {
      id: 'cultural',
      label: 'Cultural Mastery',
      greekLabel: 'Πολιτισμός',
      icon: Shield,
      description: 'Way of Enlightenment',
      color: 'from-purple-500 to-purple-700',
    },
    {
      id: 'wisdom',
      label: 'Divine Wisdom',
      greekLabel: 'Σοφία',
      icon: Scroll,
      description: 'Knowledge of the Gods',
      color: 'from-blue-500 to-blue-700',
    },
    {
      id: 'legacy',
      label: 'Empire Legacy',
      greekLabel: 'Κληρονομιά',
      icon: Star,
      description: 'Eternal Glory',
      color: 'from-yellow-500 to-yellow-700',
    },
  ];
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        <span className="text-blue-800">Πεδίο Αριστείας</span> (Domain of Excellence)
      </label>
      <div className="grid grid-cols-2 gap-4">
        {domains.map(({ id, label, greekLabel, icon: Icon, description, color }) => (
          <button
            key={id}
            onClick={() => setData({ ...data, domain: id })}
            className={`
              relative p-4 rounded-lg border-2 transition-all group
              ${data.domain === id 
                ? `bg-gradient-to-r ${color} text-white border-gold-500` 
                : 'border-gray-200 hover:border-blue-300'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-6 h-6 ${data.domain === id ? 'text-white' : 'text-gray-600'}`} />
              <div>
                <div className="font-semibold">{label}</div>
                <div className={`text-sm ${data.domain === id ? 'text-white' : 'text-gray-500'}`}>
                  {greekLabel}
                </div>
                <div className={`text-xs ${data.domain === id ? 'text-white/80' : 'text-gray-400'}`}>
                  {description}
                </div>
              </div>
            </div>
            <div className={`
              absolute inset-0 border-2 border-yellow-300 rounded-lg opacity-0
              ${data.domain === id ? 'animate-pulse opacity-30' : ''}
            `} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default DomainSelector;
