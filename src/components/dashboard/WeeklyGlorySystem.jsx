import React from 'react';
import { Sword, Crown, Star, Trophy } from 'lucide-react';

const WeeklyGlorySystem = ({ tasks, campaigns }) => {
  const calculateGloryProgress = () => {
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const perfectVictories = completedTasks.filter(t => t.quality_rating === 'perfect');
    
    return {
      tasksCompleted: completedTasks.length,
      perfectVictories: perfectVictories.length,
      territoryGained: campaigns.filter(c => c.progress > 0).length
    };
  };

  const progress = calculateGloryProgress();

  const weeklyGoals = [
    {
      title: "Conqueror's Glory",
      description: "Complete 10 tasks with perfect execution",
      icon: Sword,
      current: progress.perfectVictories,
      target: 10,
      reward: "500 XP"
    },
    {
      title: "Strategic Genius",
      description: "Progress in 3 different campaigns",
      icon: Crown,
      current: progress.territoryGained,
      target: 3,
      reward: "300 XP"
    },
    {
      title: "Daily Victories",
      description: "Complete tasks 5 days in a row",
      icon: Star,
      current: 3, // Replace with real streak logic if available
      target: 5,
      reward: "400 XP"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 border border-yellow-500/20 mt-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-400" />
        Weekly Glory Challenges
      </h2>
      <div className="space-y-4">
        {weeklyGoals.map((goal) => (
          <div key={goal.title} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <goal.icon className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">{goal.title}</h3>
                <p className="text-blue-200 text-sm">{goal.description}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold">{goal.reward}</div>
                <div className="text-blue-200 text-sm">
                  {goal.current}/{goal.target}
                </div>
              </div>
            </div>
            <div className="mt-2 w-full bg-blue-900/50 rounded-full h-2">
            <div
  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
/>

            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <blockquote className="text-blue-200 italic">
          "Fortune favors the bold who seize their destiny."
          <footer className="text-blue-300 text-sm mt-1">- Alexander the Great</footer>
        </blockquote>
      </div>
    </div>
  );
};

export default WeeklyGlorySystem;
