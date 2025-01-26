// ActiveBattle.jsx
import React, { useState, useEffect } from "react";
import { Sword, Shield, Crown } from "lucide-react";
import ChronosBattleBanner from "./ChronosBattleBanner";
import pomodoroService from "../../services/pomodoroService";

const EmptyBattleground = () => (
  <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-lg p-8 shadow-2xl border border-blue-500/30">
    <div className="text-center space-y-4">
      <div className="flex justify-center space-x-4">
        <Sword className="w-8 h-8 text-red-400 animate-pulse" />
        <Shield className="w-8 h-8 text-blue-400 animate-pulse" />
        <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-white">
        Πεδίο Μάχης Χρόνου
      </h2>
      <p className="text-blue-300 italic">
        "Time's Battleground Awaits Your Command"
      </p>
    </div>
  </div>
);

const ActiveBattle = ({ task, onComplete, userStats }) => {
  const [activeCycle, setActiveCycle] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const calculateRemainingTime = (cycle) => {
    if (!cycle || cycle.status !== 'in_progress') {
      // Return duration for one session, not total
      const sessionDuration = (cycle.is_break ? cycle.rest_duration : cycle.battle_duration) * 60;
      console.log('Calculated session duration:', {
        sessionDuration,
        isBreak: cycle.is_break,
        battleDuration: cycle.battle_duration,
        restDuration: cycle.rest_duration
      });
      return sessionDuration;
    }
  
    const now = new Date();
    const startedAt = new Date(cycle.started_at);
    const duration = cycle.is_break ? cycle.rest_duration : cycle.battle_duration;
    const elapsedSeconds = Math.floor((now - startedAt) / 1000);
    const remainingSeconds = duration * 60 - elapsedSeconds;
  
    console.log('Calculated remaining time:', {
      duration,
      elapsedSeconds,
      remainingSeconds
    });
  
    return Math.max(0, remainingSeconds);
  };

  useEffect(() => {
    const checkActiveCycle = async () => {
      console.log("Checking active cycle for task ID:", task?.id);
      if (task?.uses_chronos_cycles) {
        try {
          const cycle = await pomodoroService.getActiveCycle(task.id);
          console.log("Retrieved cycle:", cycle);

          if (cycle) {
            const timeRemaining = calculateRemainingTime(cycle);
            setActiveCycle({
              ...cycle,
              current_time_remaining: timeRemaining,
              initialTimeRemaining: timeRemaining,
            });

            setIsVisible(true);
            setIsActive(cycle.status === "in_progress");
          }
        } catch (error) {
          console.error("Error fetching active cycle:", error);
        }
      }
    };

    checkActiveCycle();
  }, [task?.id, task?.uses_chronos_cycles]);

  const handleStart = async () => {
    try {
      await pomodoroService.startCycle(activeCycle.id);
      const updatedCycle = await pomodoroService.getActiveCycle(task.id);
      if (updatedCycle) {
        const timeRemaining = calculateRemainingTime(updatedCycle);
        setActiveCycle({
          ...updatedCycle,
          initialTimeRemaining: timeRemaining,
          current_time_remaining: timeRemaining,
        });
        setIsActive(true);
      }
    } catch (error) {
      console.error("Error starting cycle:", error);
    }
  };

  const handlePause = async () => {
    try {
      await pomodoroService.pauseCycle(activeCycle.id);
      setIsActive(false);
    } catch (error) {
      console.error("Error pausing cycle:", error);
    }
  };

  const handleCycleComplete = async (cycleId, metrics) => {
    try {
      await pomodoroService.completeCycle(cycleId, metrics);

      if (activeCycle.current_cycle >= activeCycle.target_cycles) {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      } else {
        const updatedCycle = await pomodoroService.getActiveCycle(task.id);
        if (updatedCycle) {
          setActiveCycle({
            ...updatedCycle,
            initialTimeRemaining: calculateRemainingTime(updatedCycle),
          });
        }
      }
    } catch (error) {
      console.error("Error completing cycle:", error);
    }
  };

  if (!isVisible || !activeCycle) return <EmptyBattleground />;

  // Use the current cycle's duration for the banner
  const currentFocusDuration = activeCycle.battle_duration * 60;
  const currentBreakDuration = activeCycle.rest_duration * 60;

  return (
    <ChronosBattleBanner
      task={task?.title || "Unnamed Battle"}
      currentCycle={activeCycle.current_cycle}
      totalCycles={activeCycle.target_cycles}
      domain={task?.domain || "conquest"}
      onStart={handleStart}
      onPause={handlePause}
      isActive={isActive}
      cycleId={activeCycle.id}
      onCycleComplete={handleCycleComplete}
      initialTimeRemaining={activeCycle.initialTimeRemaining}
      initialIsBreak={activeCycle.is_break}
      focusDuration={currentFocusDuration}
      breakDuration={currentBreakDuration}
    />
  );
};

export default ActiveBattle;