// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { campaignService } from "../../services/campaignService";
import { userService } from "../../services/userService";
import { taskService } from "../../services/taskService";
import { Sword, Scroll, Star, Crown, Shield, Trophy } from "lucide-react";

// Import your separated components
import SkillCard from "./SkillCard";
import WeeklyGloryOverview from "./WeeklyGloryOverview";
import WeeklyGlorySystem from "./WeeklyGlorySystem";
import CampaignsSection from "./CampaignSection";
import ActiveBattle from "./ActiveBattle";

export function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [tasks, setTasks] = useState([]);
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
    total_xp: 0,
    current_streak: 0,
    best_streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  const findActiveChronosTasks = (tasks) => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const today = now.toLocaleDateString('en-CA');
  
    console.log("Debug - Tasks:", {
      totalTasks: tasks.length,
      now: now.toISOString(),
      currentTimeInMinutes,
      today
    });
  
    const chronosTasks = tasks.filter(t => {
      const isActive = t.status === 'active';
      const isToday = t.date === today;
      const isInTimeWindow = t.start_time <= currentTimeInMinutes && currentTimeInMinutes <= t.end_time;
      
      console.log("Debug - Task Check:", {
        taskId: t.id,
        title: t.title,
        usesChronos: t.uses_chronos_cycles,
        isActive,
        isToday,
        isInTimeWindow,
        taskDate: t.date,
        startTime: t.start_time,
        endTime: t.end_time
      });
  
      return t.uses_chronos_cycles && isActive && isToday && isInTimeWindow;
    });
  
    console.log("Debug - Found Chronos Tasks:", chronosTasks);
    return chronosTasks;
  };

  const activeTask = tasks.find(t => t.uses_chronos_cycles && t.status === 'active');
  console.log("Active Task Found:", activeTask);

  const getCampaignIcon = (type) => {
    switch (type) {
      case "conquest":
        return <Sword className="w-6 h-6 text-blue-600" />;
      case "cultural":
        return <Scroll className="w-6 h-6 text-green-600" />;
      case "wisdom":
        return <Star className="w-6 h-6 text-yellow-600" />;
      case "legacy":
        return <Crown className="w-6 h-6 text-purple-600" />;
      default:
        return <Crown className="w-6 h-6 text-gray-600" />;
    }
  };

  const checkAchievements = (tasks) => {
    const perfectTasks = tasks.filter(
      (task) =>
        task.status === "completed" && task.quality_rating === "perfect"
    );
    if (perfectTasks.length >= 10) {
      setUnlockedAchievement({
        title: "Conqueror's Glory",
        description: "You have completed 10 tasks with perfect execution!",
        xpReward: 500,
      });
    }
  };

  const fetchData = async () => {
    try {
      // Fetch campaigns
      const campaignsResponse = await campaignService.getAll();
      setCampaigns(campaignsResponse.data);

      // Fetch user stats
      const statsResponse = await userService.getStats();
      if (statsResponse.data) {
        setUserStats(statsResponse.data);
      }

      // Fetch tasks
      const tasksResponse = await taskService.getAll();
      setTasks(tasksResponse.data);
      checkAchievements(tasksResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const activeBattleTask = findActiveChronosTasks(tasks)[0];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 relative">
      {/* User Level Overview */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Shield className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">Welcome, Commander</h1>
            <p className="text-blue-200">
              Overall Level: {userStats.total_level}
            </p>
          </div>
        </div>
        <div className="w-full bg-blue-950 rounded-full h-2">
          <div
            className="bg-blue-400 h-2 rounded-full"
            style={{ width: `${(userStats.total_xp % 1000) / 10}%` }}
          />
        </div>
        <p className="text-right mt-1 text-blue-200">
          {userStats.total_xp} Total XP
        </p>
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

      {/* Active Battle (if going on) */}
      <ActiveBattle
        task={activeBattleTask}
        onComplete={fetchData}
        userStats={userStats}
      />

      {/* Active Campaigns Section */}
      <CampaignsSection campaigns={campaigns} />

      {/* Weekly Glory Overview */}
      <WeeklyGloryOverview
        tasks={tasks}
        campaigns={campaigns}
        userStats={userStats}
      />

      {/* Weekly Glory System */}
      <WeeklyGlorySystem tasks={tasks} campaigns={campaigns} />
    </div>
  );
}

export default Dashboard;