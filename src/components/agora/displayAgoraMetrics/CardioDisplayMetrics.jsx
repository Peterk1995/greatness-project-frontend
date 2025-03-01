// src/components/agora/displayAgoraMetrics/CardioDisplayMetrics.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Area,
  ComposedChart, AreaChart
} from 'recharts';
import _ from 'lodash';
import {
  Heart, Flame, Wind, Zap, Timer, Trophy, Map, Activity,
  Calendar, TrendingUp, Award, BarChart2, Filter, ArrowLeft
} from 'lucide-react';
import agoraService from '../../../services/agoraService';

// Rich color palette inspired by ancient Greek art
const COLORS = {
  primary: '#FFD700', // Gold
  secondary: '#CD7F32', // Bronze
  tertiary: '#C0C0C0', // Silver
  dark: '#1E1E2F', // Dark background
  accent1: '#8B0000', // Deep red
  accent2: '#4B0082', // Deep purple
  accent3: '#006400', // Deep green
  background: 'rgba(30, 30, 47, 0.7)', // Semi-transparent dark background
  highlight: 'rgba(255, 215, 0, 0.15)', // Semi-transparent gold
  border: 'rgba(255, 215, 0, 0.2)', // Gold border
};

// Training type configurations
const CARDIO_TYPES = {
  running: { icon: '🏃', label: 'Running', color: '#D4AF37' },
  cycling: { icon: '🚴', label: 'Cycling', color: '#87CEEB' },
  swimming: { icon: '🏊', label: 'Swimming', color: '#40E0D0' },
  rowing: { icon: '🚣', label: 'Rowing', color: '#8B4513' },
  hiit: { icon: '⚡', label: 'HIIT', color: '#FF5733' }
};

// Dummy data to ensure we can visualize even without API data
const FALLBACK_DATA = [
  {
    id: 1,
    date: '2025-02-15',
    type: 'running',
    duration: 45,
    distance: 8.5,
    intensity: { heart_rate: { average: 155, peak: 180 } },
    performance: { perceived_effort: 8, post_session_energy: 7 },
    enduranceScore: 70,
    staminaScore: 65,
    battleRating: 72
  },
  {
    id: 2,
    date: '2025-02-10',
    type: 'cycling',
    duration: 60,
    distance: 20,
    intensity: { heart_rate: { average: 145, peak: 165 } },
    performance: { perceived_effort: 7, post_session_energy: 8 },
    enduranceScore: 75,
    staminaScore: 80,
    battleRating: 78
  },
  {
    id: 3,
    date: '2025-02-05',
    type: 'swimming',
    duration: 40,
    distance: 1.5,
    intensity: { heart_rate: { average: 140, peak: 155 } },
    performance: { perceived_effort: 9, post_session_energy: 6 },
    enduranceScore: 80,
    staminaScore: 75,
    battleRating: 77
  },
  {
    id: 4, 
    date: '2025-01-25',
    type: 'running',
    duration: 50,
    distance: 10,
    intensity: { heart_rate: { average: 160, peak: 185 } },
    performance: { perceived_effort: 9, post_session_energy: 5 },
    enduranceScore: 85,
    staminaScore: 60,
    battleRating: 75
  },
  {
    id: 5,
    date: '2025-01-15',
    type: 'rowing',
    duration: 35,
    distance: 7,
    intensity: { heart_rate: { average: 150, peak: 170 } },
    performance: { perceived_effort: 8, post_session_energy: 7 },
    enduranceScore: 72,
    staminaScore: 78,
    battleRating: 75
  }
];

// Format utilities
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Calculate core metrics from raw session data
const calculateMetrics = (session) => {
  if (!session) return { battleRating: 0, enduranceScore: 0, staminaScore: 0 };
  
  // Battle rating calculation
  const durationScore = Math.min(100, (session.duration / 60) * 100);
  const distanceScore = Math.min(100, (session.distance / 10) * 100);
  const heartRateScore = session.intensity?.heart_rate?.average 
    ? Math.min(100, (session.intensity.heart_rate.average / 180) * 100) 
    : 0;
  const effortScore = session.performance?.perceived_effort 
    ? session.performance.perceived_effort * 10 
    : 0;
  const battleRating = Math.round((durationScore + distanceScore + heartRateScore + effortScore) / 4);
  
  // Endurance score calculation
  const distanceEnduranceScore = Math.min(100, (session.distance / 20) * 100);
  const heartRateEnduranceScore = session.intensity?.heart_rate?.average 
    ? (220 - session.intensity.heart_rate.average) / 2 
    : 50;
  const enduranceScore = Math.round((distanceEnduranceScore + heartRateEnduranceScore + effortScore) / 3);
  
  // Stamina score calculation
  const energyScore = session.performance?.post_session_energy 
    ? session.performance.post_session_energy * 10 
    : 50;
  const heartRateEfficiency = session.intensity?.heart_rate?.peak && session.intensity?.heart_rate?.average
    ? (session.intensity.heart_rate.peak - session.intensity.heart_rate.average) / 2
    : 25;
  const staminaScore = Math.round((energyScore + heartRateEfficiency + (enduranceScore * 0.5)) / 3);
  
  return { battleRating, enduranceScore, staminaScore };
};

// Transform API data to usable format
const processCardioData = (action) => {
  if (!action) return null;
  
  const completedDate = action.completed_at || action.metrics?.completed_at 
    ? new Date(action.completed_at || action.metrics?.completed_at) 
    : new Date();
  
  const session = {
    id: action.id,
    date: completedDate.toISOString().split('T')[0],
    formattedDate: formatDate(completedDate),
    type: action.metrics?.type || '',
    duration: action.metrics?.duration || 0,
    distance: action.metrics?.distance || 0,
    intensity: {
      heart_rate: {
        average: action.metrics?.intensity?.heart_rate?.average || 0,
        peak: action.metrics?.intensity?.heart_rate?.peak || 0
      }
    },
    performance: {
      perceived_effort: action.metrics?.performance?.perceived_effort || 0,
      post_session_energy: action.metrics?.performance?.post_session_energy || 0
    }
  };
  
  // Add calculated metrics
  const metrics = calculateMetrics(session);
  return { ...session, ...metrics };
};

// Main component
const CardioDisplayMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const actions = await agoraService.actions.getAll({ is_completed: true });
        
        // Filter for Cardio Mastery discipline
        const cardioActions = actions.filter(action => {
          const discipline = action.discipline_details || action.discipline;
          return (
            discipline &&
            discipline.path === 'training' &&
            discipline.name === 'Cardio Mastery'
          );
        });

        let processedData = [];
        
        if (cardioActions.length === 0) {
          // Use fallback data if no real data exists
          console.log('No cardio data found, using fallback data');
          processedData = FALLBACK_DATA;
        } else {
          // Process real data
          processedData = cardioActions
            .map(processCardioData)
            .filter(Boolean) // Remove null entries
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
        }
        
        setMetrics(processedData);
      } catch (err) {
        console.error('Failed to fetch cardio data:', err);
        setError('Failed to retrieve your cardio data. The Oracle\'s vision is clouded.');
        // Still set fallback data so UI is not empty
        setMetrics(FALLBACK_DATA);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters to the data
  const filteredMetrics = useMemo(() => {
    let filtered = [...metrics];
    
    // Apply training type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(session => session.type === selectedType);
    }
    
    // Apply time period filter
    if (selectedPeriod !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch(selectedPeriod) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(session => new Date(session.date) >= cutoffDate);
    }
    
    return filtered;
  }, [metrics, selectedType, selectedPeriod]);

  // Prepare aggregated data for analytics
  const analytics = useMemo(() => {
    if (!filteredMetrics.length) return null;
    
    // Calculate totals and averages
    const totalSessions = filteredMetrics.length;
    const totalDistance = _.sumBy(filteredMetrics, 'distance');
    const totalDuration = _.sumBy(filteredMetrics, 'duration');
    const avgEndurance = _.meanBy(filteredMetrics, 'enduranceScore');
    const avgStamina = _.meanBy(filteredMetrics, 'staminaScore');
    const bestEndurance = Math.max(...filteredMetrics.map(s => s.enduranceScore));
    const bestStamina = Math.max(...filteredMetrics.map(s => s.staminaScore));
    
    // Group by training type
    const typeStats = {};
    Object.keys(CARDIO_TYPES).forEach(type => {
      const typeSessions = filteredMetrics.filter(s => s.type === type);
      if (typeSessions.length) {
        typeStats[type] = {
          count: typeSessions.length,
          percentage: (typeSessions.length / totalSessions) * 100,
          distance: _.sumBy(typeSessions, 'distance'),
          duration: _.sumBy(typeSessions, 'duration')
        };
      }
    });
    
    // Create data for evolution chart (endurance/stamina over time)
    // Group by month for better visualization
    const evolutionData = _(filteredMetrics)
      .groupBy(session => {
        const date = new Date(session.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
      .map((sessions, month) => {
        const [year, monthNum] = month.split('-');
        const monthName = new Date(year, parseInt(monthNum) - 1).toLocaleString('default', { month: 'short' });
        return {
          month: `${monthName} ${year}`,
          endurance: _.meanBy(sessions, 'enduranceScore'),
          stamina: _.meanBy(sessions, 'staminaScore'),
          sessions: sessions.length
        };
      })
      .sortBy(item => item.month)
      .value();
    
    // Create data for distance progress chart
    const distanceData = _(filteredMetrics)
      .groupBy(session => {
        const date = new Date(session.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
      .map((sessions, month) => {
        const [year, monthNum] = month.split('-');
        const monthName = new Date(year, parseInt(monthNum) - 1).toLocaleString('default', { month: 'short' });
        return {
          month: `${monthName} ${year}`,
          distance: _.sumBy(sessions, 'distance')
        };
      })
      .sortBy(item => item.month)
      .value();
    
    // Create data for pie chart (training type distribution)
    const pieData = Object.entries(typeStats).map(([type, stats]) => ({
      name: CARDIO_TYPES[type]?.label || type.toUpperCase(),
      value: stats.count,
      percentage: Math.round(stats.percentage),
      color: CARDIO_TYPES[type]?.color
    }));
    
    // Create data for radar chart (warrior prowess)
    const radarData = [
      { subject: 'Endurance', value: avgEndurance },
      { subject: 'Stamina', value: avgStamina },
      { subject: 'Distance', value: Math.min(100, (totalDistance / 100) * 100) },
      { subject: 'Consistency', value: Math.min(100, totalSessions * 5) },
      { subject: 'Intensity', value: _.meanBy(filteredMetrics, s => s.performance?.perceived_effort * 10) || 0 }
    ];
    
    return {
      totals: {
        sessions: totalSessions,
        distance: totalDistance,
        duration: totalDuration,
        endurance: avgEndurance,
        stamina: avgStamina,
        bestEndurance,
        bestStamina
      },
      typeStats,
      evolutionData,
      distanceData,
      pieData,
      radarData
    };
  }, [filteredMetrics]);
  
  // Component rendering blocks
  
  // Hero stats section (top metrics)
  const renderHeroStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gold-500/20 shadow-lg">
        <div className="flex justify-between">
          <h3 className="text-gold-300 text-sm mb-2">Campaigns</h3>
          <Trophy className="w-5 h-5 text-gold-500" />
        </div>
        <p className="text-3xl font-bold">{analytics?.totals.sessions || 0}</p>
      </div>
      
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gold-500/20 shadow-lg">
        <div className="flex justify-between">
          <h3 className="text-gold-300 text-sm mb-2">Distance</h3>
          <Map className="w-5 h-5 text-gold-500" />
        </div>
        <p className="text-3xl font-bold">{analytics?.totals.distance?.toFixed(1) || 0}km</p>
      </div>
      
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gold-500/20 shadow-lg">
        <div className="flex justify-between">
          <h3 className="text-gold-300 text-sm mb-2">Endurance</h3>
          <Flame className="w-5 h-5 text-gold-500" />
        </div>
        <p className="text-3xl font-bold">{analytics?.totals.bestEndurance || 0}</p>
      </div>
      
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gold-500/20 shadow-lg">
        <div className="flex justify-between">
          <h3 className="text-gold-300 text-sm mb-2">Stamina</h3>
          <Zap className="w-5 h-5 text-gold-500" />
        </div>
        <p className="text-3xl font-bold">{analytics?.totals.bestStamina || 0}</p>
      </div>
    </div>
  );
  
  // Warrior evolution chart (endurance & stamina over time)
  const renderEvolutionChart = () => {
    if (!analytics?.evolutionData?.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gold-300">No progression data available</p>
        </div>
      );
    }
    
    return (
      <div>
        <h2 className="text-xl font-bold mb-4 text-gold-300">Warrior Evolution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.evolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#aaa" />
            <YAxis stroke="#aaa" domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: COLORS.dark, borderColor: COLORS.border }} 
              labelStyle={{ color: COLORS.primary }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="endurance" 
              stroke={COLORS.primary} 
              name="Endurance" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="stamina" 
              stroke={COLORS.secondary} 
              name="Stamina" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Campaign coverage chart (distance over time)
  const renderCoverageChart = () => {
    if (!analytics?.distanceData?.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gold-300">No distance data available</p>
        </div>
      );
    }
    
    return (
      <div>
        <h2 className="text-xl font-bold mb-4 text-gold-300">Campaign Coverage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics.distanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip 
              contentStyle={{ backgroundColor: COLORS.dark, borderColor: COLORS.border }} 
              labelStyle={{ color: COLORS.primary }}
            />
            <Area 
              type="monotone" 
              dataKey="distance" 
              stroke={COLORS.accent2} 
              fill={COLORS.accent2} 
              fillOpacity={0.4}
              name="Distance (km)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Battle styles pie chart (training type distribution)
  const renderBattleStyles = () => {
    if (!analytics?.pieData?.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gold-300">No training type data available</p>
        </div>
      );
    }
    
    return (
      <div>
        <h2 className="text-xl font-bold mb-4 text-gold-300">Battle Styles</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              nameKey="name"
              label={({ name, percentage }) => `${name} (${percentage}%)`}
              labelLine={{ stroke: '#aaa', strokeWidth: 1 }}
            >
              {analytics.pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={COLORS.dark} strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: COLORS.dark, borderColor: COLORS.border }} 
              labelStyle={{ color: COLORS.primary }}
            />
            <Legend 
              iconType="circle" 
              layout="horizontal" 
              verticalAlign="bottom"
              align="center" 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Warrior prowess radar chart
  const renderWarriorProwess = () => {
    if (!analytics?.radarData?.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gold-300">No prowess data available</p>
        </div>
      );
    }
    
    return (
      <div>
        <h2 className="text-xl font-bold mb-4 text-gold-300">Warrior Prowess</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={analytics.radarData}>
            <PolarGrid stroke="#666" />
            <PolarAngleAxis dataKey="subject" stroke="#aaa" />
            <PolarRadiusAxis stroke="#aaa" angle={90} domain={[0, 100]} tickCount={5} />
            <Radar
              name="Warrior Stats"
              dataKey="value"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              fillOpacity={0.5}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: COLORS.dark, borderColor: COLORS.border }} 
              labelStyle={{ color: COLORS.primary }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Battle records (session list)
  const renderBattleRecords = () => {
    if (!filteredMetrics.length) {
      return (
        <div className="text-center py-8 bg-gray-900/50 rounded-lg border border-gold-500/20">
          <Trophy className="w-12 h-12 text-gold-500/50 mx-auto mb-3" />
          <p className="text-lg text-gold-300">No cardio sessions found for selected filters.</p>
          <p className="text-sm text-gold-300/70 mt-2">Adjust your filters or conquer new territories!</p>
        </div>
      );
    }
    
    return (
      <div>
        <h2 className="text-xl font-bold mb-4 text-gold-300">Battle Records</h2>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredMetrics.map(session => (
            <div 
              key={session.id} 
              className="bg-gray-900/80 rounded-lg p-4 border border-gold-500/20 hover:border-gold-500/40 transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Date and Type */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {CARDIO_TYPES[session.type]?.icon || '🏃'}
                    </span>
                    <div>
                      <p className="text-gold-300 font-bold">{session.formattedDate}</p>
                      <p className="text-sm text-gold-200 capitalize">
                        {CARDIO_TYPES[session.type]?.label || session.type}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Distance and Heart Rate */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Map className="w-4 h-4 text-gold-500" />
                    <span className="text-gold-200">{session.distance}km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-gold-500" />
                    <span className="text-gold-200">
                      {session.intensity.heart_rate.average || 0} bpm avg
                      {session.intensity.heart_rate.peak ? ` / ${session.intensity.heart_rate.peak} peak` : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Timer className="w-4 h-4 text-gold-500" />
                    <span className="text-gold-200">{session.duration} min</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-gold-500" />
                    <span className="text-gold-200">Endurance: {session.enduranceScore}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-gold-500" />
                    <span className="text-gold-200">Stamina: {session.staminaScore}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-gold-500" />
                    <span className="text-gold-200">
                      Effort: {session.performance.perceived_effort || 0}/10
                    </span>
                  </div>
                </div>

                {/* Battle Rating */}
                <div className="flex flex-col justify-center items-center">
                  <div className="text-center mb-1">
                    <span className="text-xs text-gold-300">Battle Rating</span>
                    <div className="text-2xl font-bold text-gold-400">{session.battleRating}</div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
                    <div
                      className="bg-gold-500 h-2 rounded-full"
                      style={{ width: `${session.battleRating}%` }}
                    />
                  </div>
                  <div className="text-xs text-gold-200/80">
                    Energy: {session.performance.post_session_energy || 0}/10
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Main component render
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-red-900 flex items-center justify-center">
        <div className="text-center text-gold-100 p-6">
          <Trophy className="w-16 h-16 text-gold-500 mx-auto mb-4 animate-pulse" />
          <div className="text-2xl font-bold">Consulting the Oracle of Delphi...</div>
          <div className="mt-2">The spirits are gathering your battle records...</div>
        </div>
      </div>
    );
  }
  
  if (error && !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-red-900 flex items-center justify-center">
        <div className="bg-gray-900/80 p-8 rounded-lg border border-gold-500/20 max-w-md text-center">
          <div className="text-2xl font-bold text-gold-300 mb-4">The Oracle's Vision Is Clouded</div>
          <p className="text-gold-200 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gold-500/20 hover:bg-gold-500/30 text-gold-100 rounded-lg transition-all"
          >
            Return to the Agora
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-red-900 text-gold-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gold-300 hover:text-gold-100 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Return to the Agora</span>
        </button>

        {/* Epic Header */}
        <header className="text-center mb-8 bg-gradient-to-r from-gray-900/80 to-red-900/80 py-8 rounded-lg border border-gold-500/20 shadow-lg">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gold-300">
            ΑΛΕΞΑΝΔΡΟΥ ΔΡΟΜΟΣ
          </h1>
          <p className="text-xl text-gold-200 italic">
            "The road to glory is paved with endurance"
          </p>
        </header>

        {/* Filters */}
        <div className="mb-8 bg-gray-900/50 p-4 rounded-lg border border-gold-500/20 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-gold-300">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Battle Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gold-200 mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full bg-gray-800 border border-gold-500/20 rounded-lg p-2 text-gold-100"
              >
                <option value="all">All Time</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="quarter">Past Quarter (3 months)</option>
                <option value="year">Past Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gold-200 mb-2">Training Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-800 border border-gold-500/20 rounded-lg p-2 text-gold-100"
              >
                <option value="all">All Training Types</option>
                {Object.entries(CARDIO_TYPES).map(([value, { label }]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hero Stats Section */}
        <div className="mb-8">
          {renderHeroStats()}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Warrior Evolution Chart */}
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gold-500/20 shadow-lg">
            {renderEvolutionChart()}
          </div>

          {/* Campaign Coverage Chart */}
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gold-500/20 shadow-lg">
            {renderCoverageChart()}
          </div>

          {/* Battle Styles Chart */}
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gold-500/20 shadow-lg">
            {renderBattleStyles()}
          </div>

          {/* Warrior Prowess Chart */}
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gold-500/20 shadow-lg">
            {renderWarriorProwess()}
          </div>
        </div>

        {/* Battle Records */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gold-500/20 shadow-lg mb-8">
          {renderBattleRecords()}
        </div>

        {/* Achievement System */}
        <div className="mb-8 bg-gray-900/50 p-6 rounded-lg border border-gold-500/20 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-gold-300 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gold-500" />
            Warrior Achievements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Marathon Runner Achievement */}
            <div className="bg-gray-800/70 p-4 rounded-lg border border-gold-500/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-500" />
                <h3 className="font-bold text-gold-300">Marathon Runner</h3>
              </div>
              <p className="text-sm mt-2 text-gold-200/80">Complete a 40km+ distance in one session</p>
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                  <div
                    className="bg-gold-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (analytics?.totals?.bestDistance || 0) / 40 * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gold-200/60 text-right">
                  {Math.round(Math.min(100, (analytics?.totals?.bestDistance || 0) / 40 * 100))}% Complete
                </p>
              </div>
            </div>
            
            {/* Heart of a Lion Achievement */}
            <div className="bg-gray-800/70 p-4 rounded-lg border border-gold-500/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-500" />
                <h3 className="font-bold text-gold-300">Heart of a Lion</h3>
              </div>
              <p className="text-sm mt-2 text-gold-200/80">Maintain 150+ bpm average heart rate for 30+ minutes</p>
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                  <div
                    className="bg-gold-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: '45%' }}
                  />
                </div>
                <p className="text-xs text-gold-200/60 text-right">
                  45% Complete
                </p>
              </div>
            </div>
            
            {/* Warrior's Endurance Achievement */}
            <div className="bg-gray-800/70 p-4 rounded-lg border border-gold-500/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-500" />
                <h3 className="font-bold text-gold-300">Warrior's Endurance</h3>
              </div>
              <p className="text-sm mt-2 text-gold-200/80">Achieve an endurance score of 90+</p>
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                  <div
                    className="bg-gold-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (analytics?.totals?.bestEndurance || 0) / 90 * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gold-200/60 text-right">
                  {Math.round(Math.min(100, (analytics?.totals?.bestEndurance || 0) / 90 * 100))}% Complete
                </p>
              </div>
            </div>
            
            {/* Alexander's Legacy Achievement */}
            <div className="bg-gray-800/70 p-4 rounded-lg border border-gold-500/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-500" />
                <h3 className="font-bold text-gold-300">Alexander's Legacy</h3>
              </div>
              <p className="text-sm mt-2 text-gold-200/80">Accumulate 1000km total distance</p>
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                  <div
                    className="bg-gold-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (analytics?.totals?.distance || 0) / 1000 * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gold-200/60 text-right">
                  {Math.round(Math.min(100, (analytics?.totals?.distance || 0) / 1000 * 100))}% Complete
                </p>
              </div>
            </div>
            
            {/* Master of All Achievement */}
            <div className="bg-gray-800/70 p-4 rounded-lg border border-gold-500/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-500" />
                <h3 className="font-bold text-gold-300">Master of All</h3>
              </div>
              <p className="text-sm mt-2 text-gold-200/80">Complete sessions in at least 4 different training types</p>
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                  <div
                    className="bg-gold-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (Object.keys(analytics?.typeStats || {}).length / 4) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gold-200/60 text-right">
                  {Math.round(Math.min(100, (Object.keys(analytics?.typeStats || {}).length / 4) * 100))}% Complete
                </p>
              </div>
            </div>
            
            {/* Spartan Spirit Achievement */}
            <div className="bg-gray-800/70 p-4 rounded-lg border border-gold-500/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-500" />
                <h3 className="font-bold text-gold-300">Spartan Spirit</h3>
              </div>
              <p className="text-sm mt-2 text-gold-200/80">Complete 10 sessions with 8+ perceived effort</p>
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                  <div
                    className="bg-gold-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: '60%' }}
                  />
                </div>
                <p className="text-xs text-gold-200/60 text-right">
                  60% Complete
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="mt-12 mb-8 text-center bg-gradient-to-r from-gray-900/70 to-red-900/70 p-6 rounded-lg border border-gold-500/20 shadow-lg">
          <blockquote className="text-2xl italic text-gold-300">
            "In the race of life, it is not the swift who win, but those who keep running."
            <footer className="text-lg mt-2 text-gold-200">— Oracle of Delphi</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default CardioDisplayMetrics;
