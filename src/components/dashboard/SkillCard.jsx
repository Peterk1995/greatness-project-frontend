import React, { useState, useEffect } from 'react';

const SkillCard = ({ title, level, xp, icon: Icon, color }) => {
  const [animatedXP, setAnimatedXP] = useState(0);

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = xp / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= xp) {
        setAnimatedXP(xp);
        clearInterval(timer);
      } else {
        setAnimatedXP(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [xp]);

  const progressPercent =
    animatedXP > 0 && animatedXP % 100 === 0 ? 100 : animatedXP % 100;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <span className="text-xl font-bold text-blue-600">Lvl {level}</span>
      </div>
      <div className="space-y-2">
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-2 rounded-full ${color.replace('bg-opacity-10', '')} transition-all duration-300 relative`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
          </div>
        </div>
        <p className="text-sm text-gray-600 text-right">
          {Math.round(animatedXP)} XP
        </p>
      </div>
    </div>
  );
};

export default SkillCard;
