// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaignService';
import { userService } from '../../services/userService'; // Make sure to implement this service
import { 
  Sword, 
  Scroll, 
  Star, 
  Crown, 
  Shield,
  Calendar,
  Trophy,   // For WeeklyGlorySystem & WeeklyGloryOverview
  Target    // For WeeklyGloryOverview
} from 'lucide-react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// ========================
// SkillCard Component
// ========================
const SkillCard = ({ title, level, xp, icon: Icon, color }) => {
    const [animatedXP, setAnimatedXP] = useState(0);
  
    useEffect(() => {
      // Animate XP from 0 to current value
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
  
    // Compute progress percentage.
    // If xp is a non-zero multiple of 100, show 100% instead of 0%.
    const progressPercent =
      animatedXP > 0 && animatedXP % 100 === 0
        ? 100
        : animatedXP % 100;
  
    console.log(`Rendering ${title} card:`, { level, xp });
  
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
              {/* Divine light effect */}
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
  

// ========================
// BattlesOverview Component
// ========================
/*
const BattlesOverview = ({ tasks }) => {
  const today = dayjs().format('ddd');
  const [view, setView] = useState('today'); // 'today' or 'week'
  const [collapsed, setCollapsed] = useState(false);
  
  const todaysTasks = tasks.filter(task => task.start_day === today);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-lg p-6 border border-blue-400/20 shadow-lg mt-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button 
            onClick={() => setView('today')}
            className={`px-4 py-2 text-xl font-bold transition-colors ${view === 'today' ? 'text-white border-b-2 border-blue-300' : 'text-blue-300 hover:text-white'}`}>
            Today's Battles
          </button>
          <button 
            onClick={() => setView('week')}
            className={`px-4 py-2 text-xl font-bold transition-colors ${view === 'week' ? 'text-white border-b-2 border-blue-300' : 'text-blue-300 hover:text-white'}`}>
            This Week's Battles
          </button>
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-blue-300 text-sm hover:text-white transition-colors"
        >
          {collapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>
      
      {!collapsed && (
        <>
          {view === 'today' ? (
            <div className="space-y-6">
              {todaysTasks.length > 0 ? (
                todaysTasks.map(task => (
                  <div 
                    key={task.id}
                    className="bg-blue-900/70 p-4 rounded-lg flex items-center justify-between transition-colors hover:bg-blue-900/80"
                  >
                    <span className="text-white font-semibold text-2xl">{task.title}</span>
                    <span className="text-blue-200 font-medium text-2xl">
                      {Math.floor(task.start_time / 60)}:00
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-blue-300 text-2xl italic">
                  No battles scheduled for today.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {days.map(day => {
                const dayTasks = tasks.filter(task => task.start_day === day);
                return (
                  <div key={day} className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="w-16 text-blue-300 font-bold text-2xl">{day}</span>
                      <div className="flex-1 border-t border-blue-500" />
                    </div>
                    {dayTasks.length > 0 ? (
                      dayTasks.map(task => (
                        <div 
                          key={task.id}
                          className="ml-16 bg-blue-900/60 p-4 rounded-lg flex items-center justify-between transition-colors hover:bg-blue-900/70"
                        >
                          <span className="text-white font-semibold text-2xl">{task.title}</span>
                          <span className="text-blue-300 font-medium text-2xl">
                            {Math.floor(task.start_time / 60)}:00
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="ml-16 text-blue-300 text-2xl italic">
                        No battles planned
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
*/
// ========================
// WeeklyGlorySystem Component
// ========================
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
      current: 3, // Replace with streak logic if available
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
                style={{ width: `${(goal.current / goal.target) * 100}%` }}
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

// ========================
// WeeklyGloryOverview Component
// ========================
const WeeklyGloryOverview = ({ tasks, campaigns }) => {
  // Use dayjs to compare dates (YYYY-MM-DD) so time portions are removed.
  const conquestProgress = {
    dailyTasks: {
      completed: tasks.filter(
        t => t.status === 'completed' &&
          dayjs(t.date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
      ).length,
      total: tasks.filter(
        t => dayjs(t.date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
      ).length,
      category: 'Daily Glory'
    },
    weeklyGoals: {
      completed: campaigns.filter(c => c.progress > 0).length,
      total: campaigns.length,
      category: 'Campaign Progress'
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 text-white mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Weekly Glory Report
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(conquestProgress).map(([key, data]) => (
          <div 
            key={key} 
            className="bg-blue-800/50 rounded-lg p-4 border border-blue-400/20"
          >
            <h3 className="font-bold text-blue-200 mb-2">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">
                {data.completed}/{data.total}
              </div>
              <span className="text-sm bg-blue-700/50 px-3 py-1 rounded-full">
                {data.category}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-yellow-400" />
          Today's Strategic Focus
        </h3>
        <div className="space-y-2">
          {tasks
            .filter(t => dayjs(t.date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'))
            .map(task => (
              <div key={task.id} 
                   className="bg-blue-800/50 p-3 rounded-lg border border-blue-400/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.importance === 'critical' ? 'bg-red-400' :
                    task.importance === 'strategic' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <span>{task.title}</span>
                </div>
                <span className="text-sm text-blue-200">
                  {Math.floor(task.start_time / 60)}:00
                </span>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========================
// AchievementUnlock Component
// ========================
const AchievementUnlock = ({ achievement, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative">
        {/* Greek column decorations */}
        <div className="absolute -left-8 top-0 h-full w-4 bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-200" />
        <div className="absolute -right-8 top-0 h-full w-4 bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-200" />
        <div className="bg-blue-900 p-8 rounded-lg border-2 border-yellow-400 animate-scale-up">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Glory Achieved!</h3>
          <div className="text-white text-lg mb-2">{achievement.title}</div>
          <div className="text-blue-200">{achievement.description}</div>
          <div className="mt-4 text-yellow-400 font-bold">+{achievement.xpReward} XP</div>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-yellow-400 text-blue-900 rounded hover:bg-yellow-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ========================
// Greek-Inspired Quotes (for future use)
// ========================
const GREEK_QUOTES = {
  perfectVictory: [
    "Victory belongs to the most persevering. - Alexander",
    "Excellence is not an act, but a habit. - Aristotle",
    "Let your deeds match your ambitions. - Pericles"
  ],
  taskComplete: [
    "Each day holds the seeds of tomorrow's glory.",
    "Through discipline comes freedom. - Aristotle",
    "Fortune favors the prepared mind. - Plutarch"
  ],
  newCampaign: [
    "Great deeds are usually wrought at great risks. - Herodotus",
    "No great thing is created suddenly. - Epictetus",
    "The secret of success is constancy of purpose. - Alexander"
  ]
};

// ========================
// Dashboard Component
// ========================
export function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [userStats, setUserStats] = useState({
    conquest_level: 1,
    cultural_level: 1,
    wisdom_level: 1,
    legacy_level: 1,
    total_level: 1,
    conquest_xp: 0,
    cultural_xp: 0,
    wisdom_xp: 0,
    legacy_xp: 0,
    total_xp: 0
  });
  const [loading, setLoading] = useState(true);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  const getCampaignIcon = (type) => {
    switch (type) {
      case 'conquest':
        return <Sword className="w-6 h-6 text-blue-600" />;
      case 'cultural':
        return <Scroll className="w-6 h-6 text-green-600" />;
      case 'wisdom':
        return <Star className="w-6 h-6 text-yellow-600" />;
      case 'legacy':
        return <Crown className="w-6 h-6 text-purple-600" />;
      default:
        return <Crown className="w-6 h-6 text-gray-600" />;
    }
  };

  // Function to check if any achievement criteria have been met.
  const checkAchievements = (tasks) => {
    const perfectTasks = tasks.filter(
      task => task.status === "completed" && task.quality_rating === "perfect"
    );
    if (perfectTasks.length >= 10) {
      setUnlockedAchievement({
        title: "Conqueror's Glory",
        description: "You have completed 10 tasks with perfect execution!",
        xpReward: 500
      });
    }
  };

  // Updated fetchData function with proper handling of the response structure.
  const fetchData = async () => {
    try {
      const campaignsResponse = await campaignService.getAll();
      console.log('Campaigns response:', campaignsResponse.data);
      setCampaigns(campaignsResponse.data);
      
      const statsResponse = await userService.getStats();
      console.log('Received stats:', statsResponse.data);  // Debug log
      
      if (statsResponse.data) {
        // Match the structure from your Django response
        const stats = statsResponse.data;
        setUserStats({
          conquest_level: stats.levels?.conquest || 1,
          cultural_level: stats.levels?.cultural || 1,
          wisdom_level: stats.levels?.wisdom || 1,
          legacy_level: stats.levels?.legacy || 1,
          total_level: stats.levels?.total || 1,
          conquest_xp: stats.xp?.conquest || 0,
          cultural_xp: stats.xp?.cultural || 0,
          wisdom_xp: stats.xp?.wisdom || 0,
          legacy_xp: stats.xp?.legacy || 0,
          total_xp: stats.xp?.total || 0
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh mechanism after task completion or any other event.
  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      await fetchData();
      // Aggregate tasks from campaigns after data fetching.
      const allTasks = campaigns.reduce((acc, campaign) => {
        if (campaign.time_slots && campaign.time_slots.length > 0) {
          return acc.concat(campaign.time_slots);
        }
        return acc;
      }, []);
      // Check for achievement conditions based on the updated tasks.
      checkAchievements(allTasks);
      setLoading(false);
    };
    loadDashboard();
  }, []); // Add dependencies here if needed.

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Aggregate tasks for multiple components.
  const allTasks = campaigns.reduce((acc, campaign) => {
    if (campaign.time_slots && campaign.time_slots.length > 0) {
      return acc.concat(campaign.time_slots);
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6 p-6 relative">
      {/* User Level Overview */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Shield className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">Welcome, Commander</h1>
            <p className="text-blue-200">Overall Level: {userStats.total_level}</p>
          </div>
        </div>
        <div className="w-full bg-blue-950 rounded-full h-2">
          <div 
            className="bg-blue-400 h-2 rounded-full"
            style={{ width: `${(userStats.total_xp % 1000) / 10}%` }}
          />
        </div>
        <p className="text-right mt-1 text-blue-200">{userStats.total_xp} Total XP</p>
      </div>

      {/* Skill Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkillCard 
          title="Conquest"
          level={userStats.conquest_level}
          xp={userStats.conquest_xp}
          icon={Sword}
          color="bg-red-500 bg-opacity-10 text-red-500"
        />
        <SkillCard 
          title="Cultural"
          level={userStats.cultural_level}
          xp={userStats.cultural_xp}
          icon={Scroll}
          color="bg-green-500 bg-opacity-10 text-green-500"
        />
        <SkillCard 
          title="Wisdom"
          level={userStats.wisdom_level}
          xp={userStats.wisdom_xp}
          icon={Star}
          color="bg-yellow-500 bg-opacity-10 text-yellow-500"
        />
        <SkillCard 
          title="Legacy"
          level={userStats.legacy_level}
          xp={userStats.legacy_xp}
          icon={Crown}
          color="bg-purple-500 bg-opacity-10 text-purple-500"
        />
      </div>

      {/* Active Campaigns Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Crown className="h-6 w-6" />
          Your Glorious Campaigns
        </h2>
        {campaigns.length === 0 ? (
          <p className="text-blue-200 text-center py-8 italic">
            "Great achievements await their architect." - Ancient Greek Wisdom
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map(campaign => (
              <div
                key={campaign.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-blue-400/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-900/50 rounded-lg">
                    {getCampaignIcon(campaign.campaign_type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {campaign.title}
                    </h3>
                    <span className="text-blue-200 text-sm capitalize">
                      {campaign.difficulty} • {campaign.campaign_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-blue-200 text-sm">
                    <span className="flex items-center gap-2">
                      <Scroll className="w-4 h-4" />
                      Battle Plans ({campaign.time_slots?.length || 0})
                    </span>
                    <Link 
                      to={`/campaigns/${campaign.id}`}
                      className="text-blue-300 hover:text-blue-200 text-xs"
                    >
                      View All
                    </Link>
                  </div>
                  
                  {campaign.time_slots?.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400/20">
                      {campaign.time_slots.slice(0, 3).map(task => (
                        <div 
                          key={task.id} 
                          className="bg-blue-900/30 p-2 rounded flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              task.importance === 'critical' ? 'bg-red-400' :
                              task.importance === 'strategic' ? 'bg-yellow-400' :
                              'bg-blue-400'
                            }`} />
                            <span className="text-white text-sm truncate">{task.title}</span>
                          </div>
                          <span className="text-blue-200 text-xs">
                            {Math.floor(task.start_time / 60)}:00 - {Math.floor(task.end_time / 60)}:00
                          </span>
                        </div>
                      ))}
                      {campaign.time_slots.length > 3 && (
                        <div className="text-center text-blue-300 text-xs pt-1">
                          +{campaign.time_slots.length - 3} more tasks
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-blue-300/60 text-sm italic text-center py-2">
                      No tasks scheduled yet
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-blue-400/20">
                  <div className="flex justify-between text-sm text-blue-200 mb-2">
                    <span>{campaign.completed_hours}/{campaign.estimated_hours}h</span>
                    <span>{campaign.progress}%</span>
                  </div>
                  <div className="w-full bg-blue-900/50 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Glory Overview */}
      <WeeklyGloryOverview tasks={allTasks} campaigns={campaigns} />

      {/* Weekly Glory System */}
      <WeeklyGlorySystem tasks={allTasks} campaigns={campaigns} />

      {/* BattlesOverview Section */}
     {/*} <BattlesOverview tasks={allTasks} /> *}

      {/* Achievement Popup */}
      {unlockedAchievement && (
        <AchievementUnlock 
          achievement={unlockedAchievement}
          onClose={() => setUnlockedAchievement(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
