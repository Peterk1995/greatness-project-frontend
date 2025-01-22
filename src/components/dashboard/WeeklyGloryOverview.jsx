import React from 'react';
import dayjs from 'dayjs';
import { Trophy, Star, Target } from 'lucide-react';

const WeeklyGloryOverview = ({ tasks, campaigns, userStats }) => {
  const conquestProgress = {
    dailyTasks: {
      completed: tasks.filter(t => dayjs(t.date).isSame(dayjs(), 'day') && t.status === 'completed').length,
      total: tasks.filter(t => dayjs(t.date).isSame(dayjs(), 'day')).length,
      category: 'Daily Glory',
    },
    weeklyGoals: {
      completed: campaigns.filter(c => c.progress > 0).length,
      total: campaigns.length,
      category: 'Campaign Progress',
    },
    streak: {
      current: userStats.current_streak || 0,
      best: userStats.best_streak || 0,
      category: 'Victory Streak',
    },
  };

  const getStreakMultiplier = (streak) => {
    if (streak >= 3) return '🔥 1.5x';
    if (streak >= 2) return '⚡ 1.3x';
    if (streak >= 1) return '💪 1.1x';
    return '🛡️ 1.0x';
  };

  const todaysTasks = tasks.filter(t => dayjs(t.date).isSame(dayjs(), 'day'));

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 text-white mt-6">
      {/* Weekly Glory Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Weekly Glory Report
        </h2>
      </div>

      {/* Daily and Weekly Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(conquestProgress)
          .filter(([key]) => key !== 'streak')
          .map(([key, data]) => (
            <div key={key} className="bg-blue-800/50 rounded-lg p-4 border border-blue-400/20">
              <h3 className="font-bold text-blue-200 mb-2">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </h3>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">
                  {data.total === 0 ? '0' : `${data.completed}/${data.total}`}
                </div>
                <span className="text-sm bg-blue-700/50 px-3 py-1 rounded-full">
                  {data.category}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Victory Streak Section */}
      <div className="mt-4 bg-blue-800/50 rounded-lg p-4 border border-blue-400/20 animate-fade-in">
        <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
          <Star className="h-5 w-5 text-yellow-400" />
          Victory Streak
        </h3>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold text-white">
              Current: {conquestProgress.streak.current}
            </div>
            <div className="text-sm text-blue-200">Best: {conquestProgress.streak.best}</div>
          </div>
          <div className="bg-yellow-400/20 px-4 py-2 rounded-lg animate-pulse">
            <span className="text-yellow-400 font-bold">
              {getStreakMultiplier(conquestProgress.streak.current)} Multiplier
            </span>
          </div>
        </div>
        <div className="mt-2 text-sm text-blue-200 italic">
          "Victory begets victory. Let your streak rise like Alexander’s empire."
        </div>
      </div>

      {/* Today's Daily Tasks Section */}
      <div className="space-y-4 mt-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-yellow-400" />
          Today's Daily Tasks
        </h3>
        {todaysTasks.length === 0 ? (
          <div className="text-blue-200 italic">"No tasks today, Commander. Rest for tomorrow's conquest!"</div>
        ) : (
          <div className="space-y-3">
            {todaysTasks.map((task, index) => (
              <div
                key={task.id}
                className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 p-4 rounded-lg border border-blue-400/20 flex items-center justify-between shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      task.importance === 'critical'
                        ? 'bg-red-400'
                        : task.importance === 'strategic'
                        ? 'bg-yellow-400'
                        : 'bg-green-400'
                    }`}
                  />
                  <span className="text-white font-bold">{index + 1}. {task.title}</span>
                </div>
                <span className="text-sm text-blue-200">
                  {Math.floor(task.start_time / 60)}:{task.start_time % 60 === 0 ? '00' : task.start_time % 60}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyGloryOverview;
