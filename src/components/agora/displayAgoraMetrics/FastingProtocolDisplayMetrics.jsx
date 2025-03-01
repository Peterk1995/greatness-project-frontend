import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  Clock, Shield, Award, Trophy, Flame, Sparkles, 
  Brain, Weight, Calendar, ChevronLeft, Filter,
  Moon, Sun, ArrowUpRight, Zap, Droplets
} from 'lucide-react';

// Color scheme for the fasting metrics dashboard
const FASTING_COLORS = {
  primary: '#8B5CF6',
  secondary: '#2563EB',
  accent: '#FFD700',
  backgrounds: {
    dark: '#1E293B',
    medium: '#334155',
    light: '#475569',
  },
  charts: {
    duration: '#8B5CF6',
    weight: '#3B82F6',
    mental: '#F59E0B',
    physical: '#10B981',
    spiritual: '#EC4899',
  }
};

// Define all possible fasting protocols
const FASTING_PROTOCOLS = [
  '16/8 (Warrior Fast)',
  '20/4 (Spartan Protocol)',
  'OMAD (Monk\'s Discipline)',
  '36hr (Ascetic Trial)',
  '48hr (Mystic Journey)',
  '72hr+ (Oracle\'s Path)'
];

// Inspiring quotes about fasting and discipline
const FASTING_WISDOM_QUOTES = [
  { quote: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { quote: "Mastering others is strength; mastering yourself is true power.", author: "Lao Tzu" },
  { quote: "The body is temple, keep it pure and clean for the soul to reside in.", author: "B.K.S. Iyengar" },
  { quote: "The first wealth is health.", author: "Ralph Waldo Emerson" },
  { quote: "Temperance is a tree which as for its root very little contentment, and for its fruit calm and peace.", author: "Buddha" },
  { quote: "Fasting cleanses the soul, raises the mind, subjects one's flesh to the spirit.", author: "Pope Benedict XVI" }
];

const FastingProtocolDisplayMetrics = () => {
  const [metricsData, setMetricsData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedFastType, setSelectedFastType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [quote, setQuote] = useState(FASTING_WISDOM_QUOTES[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFastingMetrics();
    // Select a random quote
    const randomQuote = FASTING_WISDOM_QUOTES[Math.floor(Math.random() * FASTING_WISDOM_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  useEffect(() => {
    if (metricsData.length > 0) {
      computeAnalytics(filterData(metricsData));
    }
  }, [metricsData, selectedFastType, selectedPeriod]);

  const fetchFastingMetrics = async () => {
    try {
      setLoading(true);
      // Simulate fetching data from service
      // In a real app, you would use agoraService.actions.getAll()
      
      // This is sample data based on the payload output you shared
      const sampleData = [
        {
          id: 1,
          date: '2024-12-31',
          rawDate: new Date('2024-12-31'),
          fastType: '16/8 (Warrior Fast)',
          targetDuration: 16,
          actualDuration: 16,
          energyLevel: 7,
          mentalClarity: 6,
          breakingMethod: 'bone_broth (Gentle Recovery)',
          reflection: 'First day of fasting. Felt clear-headed by the afternoon.',
          xpEarned: 14
        },
        {
          id: 2,
          date: '2025-01-01',
          rawDate: new Date('2025-01-01'),
          fastType: '16/8 (Warrior Fast)',
          targetDuration: 16,
          actualDuration: 16,
          energyLevel: 7,
          mentalClarity: 6,
          breakingMethod: 'light_meal (Warrior\'s Feast)',
          reflection: 'New year, new discipline. Maintained focus throughout.',
          xpEarned: 16
        },
        {
          id: 3,
          date: '2025-01-02',
          rawDate: new Date('2025-01-02'),
          fastType: 'OMAD (Monk\'s Discipline)',
          targetDuration: 23,
          actualDuration: 23,
          energyLevel: 7,
          mentalClarity: 8,
          breakingMethod: 'bone_broth (Gentle Recovery)',
          reflection: 'One meal approach feels challenging but rewarding.',
          xpEarned: 23
        },
        {
          id: 4,
          date: '2025-01-05',
          rawDate: new Date('2025-01-05'),
          fastType: 'OMAD (Monk\'s Discipline)',
          targetDuration: 23,
          actualDuration: 23,
          energyLevel: 7,
          mentalClarity: 6,
          breakingMethod: 'fruits (Light Return)',
          reflection: 'Mental clarity increased in the afternoon.',
          xpEarned: 17
        },
        {
          id: 5,
          date: '2025-01-07',
          rawDate: new Date('2025-01-07'),
          fastType: '16/8 (Warrior Fast)',
          targetDuration: 16,
          actualDuration: 16,
          energyLevel: 7,
          mentalClarity: 7,
          breakingMethod: 'light_meal (Warrior\'s Feast)',
          reflection: 'Returned to warrior protocol. Steady energy throughout.',
          xpEarned: 16
        },
        {
          id: 6,
          date: '2025-01-13',
          rawDate: new Date('2025-01-13'),
          fastType: '36hr (Ascetic Trial)',
          targetDuration: 36,
          actualDuration: 36,
          energyLevel: 8,
          mentalClarity: 10,
          startingWeight: 75,
          finalWeight: 73.5,
          weightChange: 1.5,
          breakingMethod: 'bone_broth (Gentle Recovery)',
          reflection: 'Most challenging fast yet. Profound mental clarity by the end.',
          xpEarned: 53
        },
        {
          id: 7,
          date: '2025-01-09',
          rawDate: new Date('2025-01-09'),
          fastType: '20/4 (Spartan Protocol)',
          targetDuration: 20,
          actualDuration: 20,
          energyLevel: 7,
          mentalClarity: 7,
          breakingMethod: 'light_meal (Warrior\'s Feast)',
          reflection: 'The Spartan way brings discipline and focus.',
          xpEarned: 20
        }
      ];
      
      setMetricsData(sampleData);
      computeAnalytics(sampleData);
    } catch (error) {
      console.error('Error fetching fasting metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) => {
    let filtered = [...data];
    
    // Filter by fast type
    if (selectedFastType !== 'all') {
      filtered = filtered.filter(item => item.fastType === selectedFastType);
    }
    
    // Filter by time period
    if (selectedPeriod !== 'all') {
      const now = new Date();
      let periodStart = new Date();
      
      switch(selectedPeriod) {
        case 'week':
          periodStart.setDate(now.getDate() - 7);
          break;
        case 'month':
          periodStart.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          periodStart.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(item => item.rawDate >= periodStart);
    }
    
    return filtered;
  };

  const computeAnalytics = (data) => {
    if (!data || data.length === 0) {
      setAnalytics(null);
      return;
    }

    // Get unique fast types from data
    const uniqueFastTypes = [...new Set(data.map(item => item.fastType))];
    
    // Calculate fast type statistics
    const typeStats = uniqueFastTypes.map(type => {
      const typeItems = data.filter(item => item.fastType === type);
      return {
        name: type,
        count: typeItems.length,
        avgDuration: Math.round(typeItems.reduce((sum, item) => sum + item.actualDuration, 0) / typeItems.length),
        totalHours: typeItems.reduce((sum, item) => sum + item.actualDuration, 0),
        avgEnergyLevel: (typeItems.reduce((sum, item) => sum + item.energyLevel, 0) / typeItems.length).toFixed(1),
        avgMentalClarity: (typeItems.reduce((sum, item) => sum + item.mentalClarity, 0) / typeItems.length).toFixed(1),
        totalXP: typeItems.reduce((sum, item) => sum + item.xpEarned, 0)
      };
    });
    
    // Add any missing protocols to typeStats for the dropdown
    FASTING_PROTOCOLS.forEach(protocol => {
      if (!typeStats.some(stat => stat.name === protocol)) {
        typeStats.push({
          name: protocol,
          count: 0,
          avgDuration: 0,
          totalHours: 0,
          avgEnergyLevel: "0.0",
          avgMentalClarity: "0.0",
          totalXP: 0
        });
      }
    });

    // Calculate weekly progress data
    const weeklyData = {};
    data.forEach(item => {
      const weekStart = new Date(item.rawDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: `Week of ${weekStart.toLocaleDateString()}`,
          totalHours: 0,
          fastCount: 0,
          avgEnergyLevel: 0,
          avgMentalClarity: 0,
          totalXP: 0
        };
      }
      
      weeklyData[weekKey].totalHours += item.actualDuration;
      weeklyData[weekKey].fastCount += 1;
      weeklyData[weekKey].avgEnergyLevel += item.energyLevel;
      weeklyData[weekKey].avgMentalClarity += item.mentalClarity;
      weeklyData[weekKey].totalXP += item.xpEarned;
    });

    // Calculate averages for weekly data
    Object.keys(weeklyData).forEach(key => {
      if (weeklyData[key].fastCount > 0) {
        weeklyData[key].avgEnergyLevel = (weeklyData[key].avgEnergyLevel / weeklyData[key].fastCount).toFixed(1);
        weeklyData[key].avgMentalClarity = (weeklyData[key].avgMentalClarity / weeklyData[key].fastCount).toFixed(1);
      }
    });

    // Calculate streak (consecutive days with fasting)
    let currentStreak = 0;
    let bestStreak = 0;
    let lastFastDate = null;
    const sortedForStreak = [...data].sort((a, b) => a.rawDate - b.rawDate);
    
    sortedForStreak.forEach(item => {
      if (!lastFastDate) {
        currentStreak = 1;
      } else {
        const dayDiff = Math.round((item.rawDate - lastFastDate) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreak++;
        } else if (dayDiff > 1) {
          currentStreak = 1;
        }
      }
      
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
      
      lastFastDate = item.rawDate;
    });

    // Calculate weight metrics if weight tracking was used
    const weightTracking = data.filter(item => item.startingWeight && item.finalWeight);
    const weightStats = {
      tracked: weightTracking.length > 0,
      totalLost: weightTracking.reduce((sum, item) => sum + (item.weightChange || 0), 0).toFixed(1),
      avgLossPerFast: weightTracking.length > 0 
        ? (weightTracking.reduce((sum, item) => sum + (item.weightChange || 0), 0) / weightTracking.length).toFixed(2)
        : 0,
      bestSingleFast: weightTracking.length > 0
        ? Math.max(...weightTracking.map(item => item.weightChange || 0))
        : 0
    };

    // Calculate total metrics
    const totalStats = {
      totalFasts: data.length,
      totalHours: data.reduce((sum, item) => sum + item.actualDuration, 0),
      longestFast: Math.max(...data.map(item => item.actualDuration)),
      avgDuration: (data.reduce((sum, item) => sum + item.actualDuration, 0) / data.length).toFixed(1),
      avgEnergyLevel: (data.reduce((sum, item) => sum + item.energyLevel, 0) / data.length).toFixed(1),
      avgMentalClarity: (data.reduce((sum, item) => sum + item.mentalClarity, 0) / data.length).toFixed(1),
      totalXP: data.reduce((sum, item) => sum + item.xpEarned, 0),
      currentStreak,
      bestStreak,
      typeStats,
      weeklyProgress: Object.values(weeklyData).sort((a, b) => 
        new Date(a.week.split('Week of ')[1]) - new Date(b.week.split('Week of ')[1])),
      weightStats
    };

    setAnalytics(totalStats);
  };

  const calculateMasteryLevel = (hours) => {
    if (hours >= 500) return { level: 'Ascetic Master', icon: <Moon className="w-6 h-6 text-yellow-400" /> };
    if (hours >= 300) return { level: 'Fasting Sage', icon: <Brain className="w-6 h-6 text-indigo-400" /> };
    if (hours >= 200) return { level: 'Discipline Adept', icon: <Shield className="w-6 h-6 text-blue-400" /> };
    if (hours >= 100) return { level: 'Warrior Faster', icon: <Flame className="w-6 h-6 text-orange-400" /> };
    return { level: 'Fasting Initiate', icon: <Clock className="w-6 h-6 text-purple-400" /> };
  };

  const renderHeroSection = () => {
    if (!analytics) return null;
    
    const mastery = calculateMasteryLevel(analytics.totalHours);
    
    return (
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700 mb-8">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Spartan Discipline</h2>
              <p className="text-slate-200 text-lg">Your path to mastery through abstention</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0 bg-slate-800/70 px-4 py-3 rounded-lg border border-slate-600">
              {mastery.icon}
              <div>
                <span className="text-slate-200 text-sm">Mastery Level</span>
                <h3 className="text-xl font-bold text-white">{mastery.level}</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700 flex flex-col items-center">
              <Clock className="w-10 h-10 text-purple-300 mb-2" />
              <span className="text-slate-200 text-sm">Total Fasting Hours</span>
              <span className="text-3xl font-bold text-white">{analytics.totalHours}</span>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700 flex flex-col items-center">
              <Trophy className="w-10 h-10 text-yellow-300 mb-2" />
              <span className="text-slate-200 text-sm">Total Fasts</span>
              <span className="text-3xl font-bold text-white">{analytics.totalFasts}</span>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700 flex flex-col items-center">
              <Zap className="w-10 h-10 text-emerald-300 mb-2" />
              <span className="text-slate-200 text-sm">Current Streak</span>
              <span className="text-3xl font-bold text-white">{analytics.currentStreak} days</span>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700 flex flex-col items-center">
              <Brain className="w-10 h-10 text-blue-300 mb-2" />
              <span className="text-slate-200 text-sm">Mental Clarity</span>
              <span className="text-3xl font-bold text-white">{analytics.avgMentalClarity}/10</span>
            </div>
          </div>

          {analytics.weightStats.tracked && (
            <div className="mt-8 bg-slate-800/60 rounded-xl p-5 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center">
                <Weight className="w-8 h-8 text-blue-300 mr-4" />
                <div>
                  <span className="text-slate-200 text-sm">Total Weight Loss</span>
                  <div className="text-2xl font-bold text-white">{analytics.weightStats.totalLost} kg</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-200 text-sm">Avg. Loss Per Fast</span>
                <div className="text-xl font-bold text-white">{analytics.weightStats.avgLossPerFast} kg</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFastTypeDistribution = () => {
    if (!analytics?.typeStats || analytics.typeStats.length === 0) return null;
    
    // Filter out protocols with 0 count for the charts (but keep them in dropdown)
    const activeProtocols = analytics.typeStats.filter(stat => stat.count > 0);
    
    if (activeProtocols.length === 0) return null;
    
    // Data for the radar chart to ensure it's properly formatted
    const mentalPerformanceData = activeProtocols.map(protocol => ({
      subject: protocol.name.split(' ')[0], // Just show first part of name
      mentalClarity: parseFloat(protocol.avgMentalClarity),
      energyLevel: parseFloat(protocol.avgEnergyLevel)
    }));
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Fasting Protocols</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeProtocols}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {activeProtocols.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={Object.values(FASTING_COLORS.charts)[index % Object.values(FASTING_COLORS.charts).length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [value, props.payload.name]}
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', color: 'white' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Mental Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mentalPerformanceData}>
                  <PolarGrid stroke="#666" />
                  <PolarAngleAxis dataKey="subject" stroke="#ccc" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#ccc" />
                  <Radar
                    name="Mental Clarity"
                    dataKey="mentalClarity"
                    stroke={FASTING_COLORS.charts.mental}
                    fill={FASTING_COLORS.charts.mental}
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Energy Level"
                    dataKey="energyLevel"
                    stroke={FASTING_COLORS.charts.physical}
                    fill={FASTING_COLORS.charts.physical}
                    fillOpacity={0.6}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', color: 'white' }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Improved dropdown rendering
  const renderFilterDropdowns = () => (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <div className="flex items-center bg-slate-800/70 rounded-lg overflow-hidden border border-slate-700">
        <span className="bg-slate-700 text-slate-200 p-2">
          <Filter className="w-5 h-5" />
        </span>
        <select
          value={selectedFastType}
          onChange={(e) => setSelectedFastType(e.target.value)}
          className="bg-transparent text-slate-200 p-2 pr-8 border-none outline-none appearance-none"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '0.65em auto',
            paddingRight: '1.5rem'
          }}
        >
          <option value="all">All Protocols</option>
          {FASTING_PROTOCOLS.map((protocol) => (
            <option key={protocol} value={protocol}>
              {protocol}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center bg-slate-800/70 rounded-lg overflow-hidden border border-slate-700">
        <span className="bg-slate-700 text-slate-200 p-2">
          <Calendar className="w-5 h-5" />
        </span>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-transparent text-slate-200 p-2 pr-8 border-none outline-none appearance-none"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '0.65em auto',
            paddingRight: '1.5rem'
          }}
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 90 Days</option>
        </select>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="inline-block">
            <Clock className="w-16 h-16 text-purple-300 animate-pulse" />
          </div>
          <p className="mt-4 text-xl text-slate-200">Measuring your discipline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-slate-300 hover:text-slate-100 transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Return to the Agora</span>
        </button>

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-300 to-indigo-400">
            The Disciplines of Fasting
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            "Control of appetite is the beginning of all greatness"
          </p>
        </header>
        
        {/* Filters */}
        {renderFilterDropdowns()}

        {/* Main Content */}
        {metricsData.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-slate-200 mb-2">Your Fasting Journey Awaits</h3>
            <p className="text-slate-300 max-w-md mx-auto">
              Begin your path of discipline. Complete fasting protocols to see your progress.
            </p>
          </div>
        ) : (
          <>
            {renderHeroSection()}
            {renderFastTypeDistribution()}
          </>
        )}
      </div>
    </div>
  );
};

export default FastingProtocolDisplayMetrics;