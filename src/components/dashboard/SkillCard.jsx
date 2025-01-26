import React, { useState, useEffect } from 'react';

const SkillCard = ({ title, level, xp, icon: Icon, color }) => {
  const [animatedXP, setAnimatedXP] = useState(0);
  
  // Calculate XP thresholds using the correct formula
  const getXPForLevel = (lvl) => Math.pow(lvl, 2) * 100;
  
  // Get XP requirements
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  
  // Calculate progress to next level
  const xpNeededForNext = nextLevelXP - currentLevelXP;
  const xpProgress = xp - currentLevelXP;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpProgress / xpNeededForNext) * 100)));

  // Animate XP counter
  useEffect(() => {
    const duration = 1500;
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

  // Get domain-specific styles
  const getDomainColor = (type) => {
    switch (type) {
      case 'Conquest': return 'bg-red-500';
      case 'Cultural': return 'bg-green-500';
      case 'Wisdom': return 'bg-yellow-500';
      case 'Legacy': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-semibold">Lvl {level}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getDomainColor(title)} transition-all duration-300`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            {Math.round(animatedXP).toLocaleString()} / {nextLevelXP.toLocaleString()} XP
          </span>
          <span>{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;