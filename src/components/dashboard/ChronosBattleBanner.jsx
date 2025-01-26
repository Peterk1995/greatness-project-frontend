// Editor/ChronosBattleBanner.jsx
import React, { useState, useEffect, useRef } from "react";
import { Sword, Shield, Swords, Clock, Shield as ShieldIcon, Flag, Plus, Minus } from "lucide-react";
import pomodoroService from "../../services/pomodoroService";

const DOMAIN_CONFIGS = {
  conquest: {
    color: "text-red-500",
    gradient: "from-red-500 to-red-700",
    symbol: "⚔️",
    deity: "Ares",
    blessing: "Strength in Battle",
  },
  wisdom: {
    color: "text-blue-500",
    gradient: "from-blue-500 to-blue-700",
    symbol: "📜",
    deity: "Athena",
    blessing: "Divine Wisdom",
  },
  cultural: {
    color: "text-purple-500",
    gradient: "from-purple-500 to-purple-700",
    symbol: "🏛️",
    deity: "Apollo",
    blessing: "Cultural Mastery",
  },
  legacy: {
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-yellow-700",
    symbol: "🌟",
    deity: "Zeus",
    blessing: "Eternal Glory",
  },
};

const ChronosBattleBanner = ({
    task,
    currentCycle,
    totalCycles,
    domain = "conquest",
    onStart,
    onPause,
    isActive,
    cycleId,
    onCycleComplete,
    initialTimeRemaining,
    initialIsBreak = false,
    focusDuration,
    breakDuration,
  }) => {
    const timerRef = useRef(null);
    const lastTickRef = useRef(null);  // Changed from Date.now() to null
    const phaseChangeRef = useRef(false);  // Track genuine phase changes
    
    // Initialize with initial time remaining from backend
    const [timeRemaining, setTimeRemaining] = useState(() => {
      console.log('Initializing timer with:', initialTimeRemaining);
      return initialTimeRemaining;
    });
    
    const [isBreak, setIsBreak] = useState(initialIsBreak);

    // Function to switch phases (focus <-> break)
    const switchPhase = (toBreak) => {
      phaseChangeRef.current = true;
      setIsBreak(toBreak);
      setTimeRemaining(toBreak ? breakDuration : focusDuration);
      lastTickRef.current = Date.now();
    };
  
    // Effect for handling timer logic
    useEffect(() => {
      if (isActive) {
        console.log('Starting timer with:', {
          timeRemaining,
          isBreak,
          focusDuration,
          breakDuration
        });

        if (!lastTickRef.current) {
          lastTickRef.current = Date.now();
        }

        timerRef.current = setInterval(() => {
          const now = Date.now();
          // Calculate elapsed seconds
          const elapsedSeconds = Math.floor((now - lastTickRef.current) / 1000);
          
          if (elapsedSeconds >= 1) {
            lastTickRef.current = now;
            
            setTimeRemaining(prev => {
              const newTime = prev - elapsedSeconds;
              console.log(`Timer tick: ${prev} -> ${newTime}`);

              if (newTime <= 0) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                lastTickRef.current = null;  // Reset lastTick when timer stops

                const cycleMetrics = {
                  focusTime: !isBreak ? focusDuration : 0,
                  breakTime: isBreak ? breakDuration : 0,
                  wasBreak: isBreak
                };
                
                onCycleComplete?.(cycleId, cycleMetrics);
                switchPhase(!isBreak);
                return !isBreak ? breakDuration : focusDuration;
              }

              return newTime;
            });
          }
        }, 1000);
      } else {
        console.log('Clearing timer');
        clearInterval(timerRef.current);
        timerRef.current = null;
        lastTickRef.current = null;  // Reset lastTick when timer stops
      }

      return () => {
        if (timerRef.current) {
          console.log('Cleanup: clearing timer');
          clearInterval(timerRef.current);
          timerRef.current = null;
          lastTickRef.current = null;  // Reset lastTick on cleanup
        }
      };
    }, [isActive, cycleId, onCycleComplete, isBreak, focusDuration, breakDuration]);

    // Effect to handle initial values from props
    useEffect(() => {
      if (!phaseChangeRef.current) {
        console.log('Setting initial values from props:', {
          timeRemaining: initialTimeRemaining,
          isBreak: initialIsBreak
        });
        setTimeRemaining(initialTimeRemaining);
        setIsBreak(initialIsBreak);
      }
      phaseChangeRef.current = false;
    }, [initialTimeRemaining, initialIsBreak]);

    // Backend sync
    useEffect(() => {
      const syncTimer = async () => {
        try {
          console.log(
            `Syncing timer. Time remaining: ${timeRemaining}, Is break: ${isBreak}`
          );
          await pomodoroService.updateTimer(cycleId, timeRemaining, isBreak);
        } catch (error) {
          console.error("Failed to sync timer:", error);
        }
      };

      if (isActive && cycleId) {
        console.log("isActive and cycleId are valid. Setting up sync interval.");
        const syncInterval = setInterval(syncTimer, 10000);
        return () => {
          console.log("Sync interval cleared.");
          clearInterval(syncInterval);
        };
      }
    }, [isActive, cycleId, timeRemaining, isBreak]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const domainConfig = DOMAIN_CONFIGS[domain];

    return (
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-lg p-6 shadow-2xl border border-blue-500/30">
        <div className="text-center mb-6 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className={`text-2xl ${domainConfig.color}`}>
              {domainConfig.symbol}
            </div>
            <h2 className="text-2xl font-bold text-white">{task}</h2>
            <div className={`text-2xl ${domainConfig.color}`}>
              {domainConfig.symbol}
            </div>
          </div>
          <div className="text-blue-300 text-sm italic">
            Under the blessing of {domainConfig.deity} •{" "}
            {domainConfig.blessing}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-gray-700"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className={`text-${isBreak ? "blue" : "yellow"}-500`}
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={
                  2 *
                  Math.PI *
                  88 *
                  (timeRemaining / (isBreak ? breakDuration : focusDuration))
                }
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-4xl font-bold mb-2">
                {formatTime(timeRemaining)}
              </span>
              <span className="text-sm text-blue-300">
                {isBreak
                  ? "Rest Period"
                  : `Battle ${currentCycle}/${totalCycles}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={isActive ? onPause : onStart}
            className={`px-6 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-2
              ${
                isActive
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
          >
            {isActive ? (
              <>
                <ShieldIcon className="w-5 h-5" />
                <span>Rest</span>
              </>
            ) : (
              <>
                <Sword className="w-5 h-5" />
                <span>Fight!</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  
  };
  
  export default ChronosBattleBanner;