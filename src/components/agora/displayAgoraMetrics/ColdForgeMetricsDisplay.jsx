import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import _ from 'lodash';
import agoraService from '../../../services/agoraService';

// Utility functions
const getWeekNumber = (date) => {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
};

const calculateBattleRating = (metrics) => {
  // Algorithm to calculate warrior rating based on cold exposure metrics
  const durationScore = metrics.duration * 10;
  const tempScore = (20 - metrics.temperature) * 15; // Lower temp = higher score
  const breathingScore = metrics.breathing * 8;
  return Math.round((durationScore + tempScore + breathingScore) / 3);
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];
const EXPOSURE_TYPES = {
  cold_shower: 'Cold Shower',
  ice_bath: 'Ice Bath',
  winter_swim: 'Winter Swim',
  cryo: 'Cyro Chamber'
};

const ColdForgeMetricsDisplay = () => {
  const [metricsData, setMetricsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('all');
  const [selectedExposureType, setSelectedExposureType] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const actions = await agoraService.actions.getAll({ is_completed: true });
        
        const coldForgeActions = actions.filter(action => {
          const discipline = action.discipline_details || action.discipline;
          return discipline &&
                 discipline.path === 'exposure' &&
                 discipline.name === 'Cold Forge Training';
        });

        const transformed = coldForgeActions.map(action => {
          const rawDate = new Date(action.completed_at || action.metrics?.completed_at);
          return {
            rawDate,
            week: getWeekNumber(rawDate),
            date: rawDate.toLocaleDateString(),
            duration: action.metrics?.actual_duration || 0,
            temperature: action.metrics?.actual_temperature || 0,
            breathing: action.metrics?.breathing_rounds || 0,
            exposureType: action.metrics?.exposure_type || 'unknown',
            battleRating: calculateBattleRating({
              duration: action.metrics?.actual_duration || 0,
              temperature: action.metrics?.actual_temperature || 0,
              breathing: action.metrics?.breathing_rounds || 0
            })
          };
        });

        transformed.sort((a, b) => a.rawDate - b.rawDate);
        setMetricsData(transformed);
        computeAnalytics(transformed);
      } catch (error) {
        console.error('Error fetching Cold Forge Training metrics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const computeAnalytics = (data) => {
    const exposureStats = _.groupBy(data, 'exposureType');
    const exposureAnalytics = Object.entries(exposureStats).map(([type, sessions]) => ({
      type: EXPOSURE_TYPES[type] || type,
      count: sessions.length,
      avgDuration: _.meanBy(sessions, 'duration'),
      avgTemp: _.meanBy(sessions, 'temperature'),
      avgBreathing: _.meanBy(sessions, 'breathing'),
      avgBattleRating: _.meanBy(sessions, 'battleRating')
    }));

    const weeklyProgress = _.groupBy(data, 'week');
    const progressTrends = Object.entries(weeklyProgress).map(([week, sessions]) => ({
      week: `Week ${week}`,
      avgBattleRating: _.meanBy(sessions, 'battleRating'),
      avgDuration: _.meanBy(sessions, 'duration'),
      avgTemp: _.meanBy(sessions, 'temperature')
    }));

    setAnalytics({
      exposureAnalytics,
      progressTrends,
      totalSessions: data.length,
      bestBattleRating: _.maxBy(data, 'battleRating')?.battleRating || 0,
      coldestSession: _.minBy(data, 'temperature')?.temperature || 0,
      longestSession: _.maxBy(data, 'duration')?.duration || 0
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="text-center text-gold-100">
          <div className="text-2xl font-bold">Summoning the Ancient Wisdom...</div>
          <div className="mt-2">The Oracle processes your trials...</div>
        </div>
      </div>
    );
  }

  // Filter data based on selections
  const filteredData = metricsData.filter(d => 
    (selectedWeek === 'all' || d.week === Number(selectedWeek)) &&
    (selectedExposureType === 'all' || d.exposureType === selectedExposureType)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gold-100 p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gold-300 hover:text-gold-100 transition-colors duration-200"
        >
          ← Return to the Agora
        </button>

        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gold-300">
            Alexander's Cold Forge Chronicles
          </h1>
          <p className="text-xl text-gold-200">
            "Through suffering comes strength, through cold comes clarity."
          </p>
        </header>

        {/* Strategic Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
            <h3 className="text-gold-300 text-lg font-bold mb-2">Total Cold Forge Activities</h3>
            <p className="text-4xl font-bold">{analytics?.totalSessions || 0}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
            <h3 className="text-gold-300 text-lg font-bold mb-2">Greatest Battle Rating</h3>
            <p className="text-4xl font-bold">{analytics?.bestBattleRating || 0}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
            <h3 className="text-gold-300 text-lg font-bold mb-2">Coldest Conquest</h3>
            <p className="text-4xl font-bold">{analytics?.coldestSession}°C</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="bg-gray-700 text-gold-100 border border-gold-500/20 rounded px-4 py-2"
          >
            <option value="all">All Campaigns</option>
            {Array.from(new Set(metricsData.map(d => d.week))).sort().map(week => (
              <option key={week} value={week}>Campaign {week}</option>
            ))}
          </select>

          <select
            value={selectedExposureType}
            onChange={(e) => setSelectedExposureType(e.target.value)}
            className="bg-gray-700 text-gold-100 border border-gold-500/20 rounded px-4 py-2"
          >
            <option value="all">All Methods</option>
            {Object.entries(EXPOSURE_TYPES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Battle Rating Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
            <h2 className="text-2xl font-bold mb-4 text-gold-300">Battle Rating Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.progressTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#665" />
                <XAxis dataKey="week" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgBattleRating" stroke="#ffd700" name="Battle Rating" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Exposure Type Distribution */}
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
            <h2 className="text-2xl font-bold mb-4 text-gold-300">Training Methods</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.exposureAnalytics}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analytics?.exposureAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Duration Trends */}
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
            <h2 className="text-2xl font-bold mb-4 text-gold-300">Endurance Evolution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#665" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="duration" stroke="#8884d8" name="Duration (min)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Temperature Mastery */}
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
            <h2 className="text-2xl font-bold mb-4 text-gold-300">Temperature Mastery</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#665" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#82ca9d" name="Temperature (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Breathing Power */}
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
            <h2 className="text-2xl font-bold mb-4 text-gold-300">Breathing Power</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#665" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="breathing" stroke="#ffc658" name="Breathing Rounds" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Method Analysis */}
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gold-300">Strategic Method Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold-500/20">
                  <th className="pb-4 pr-4 text-gold-300">Method</th>
                  <th className="pb-4 px-4 text-gold-300">Frequency</th>
                  <th className="pb-4 px-4 text-gold-300">Avg Duration</th>
                  <th className="pb-4 px-4 text-gold-300">Avg Temperature</th>
                  <th className="pb-4 px-4 text-gold-300">Battle Rating</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.exposureAnalytics.map((stat, index) => (
                  <tr key={stat.type} className="border-b border-gold-500/10">
                  <td className="py-4 pr-4">{stat.type}</td>
                  <td className="py-4 px-4">{stat.count} sessions</td>
                  <td className="py-4 px-4">{stat.avgDuration.toFixed(1)} min</td>
                  <td className="py-4 px-4">{stat.avgTemp.toFixed(1)}°C</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="mr-2">{Math.round(stat.avgBattleRating)}</span>
                      <div className="w-24 bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gold-500 rounded-full h-2"
                          style={{ width: `${(stat.avgBattleRating / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Warrior's Progress Radar */}
    <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gold-300">Warrior's Progress Radar</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={[
          {
            subject: 'Endurance',
            A: (_.meanBy(filteredData, 'duration') / analytics?.longestSession) * 100,
            fullMark: 100,
          },
          {
            subject: 'Cold Resistance',
            A: (1 - (_.meanBy(filteredData, 'temperature') / 20)) * 100,
            fullMark: 100,
          },
          {
            subject: 'Breathing Power',
            A: (_.meanBy(filteredData, 'breathing') / 10) * 100,
            fullMark: 100,
          },
          {
            subject: 'Consistency',
            A: (filteredData.length / analytics?.totalSessions) * 100,
            fullMark: 100,
          },
          {
            subject: 'Battle Rating',
            A: (_.meanBy(filteredData, 'battleRating') / 100) * 100,
            fullMark: 100,
          },
        ]}>
          <PolarGrid stroke="#665" />
          <PolarAngleAxis dataKey="subject" stroke="#ccc" />
          <PolarRadiusAxis stroke="#ccc" />
          <Radar name="Warrior Stats" dataKey="A" stroke="#ffd700" fill="#ffd700" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>

    {/* Inspirational Quote */}
    <div className="text-center mt-12 mb-8">
      <blockquote className="text-2xl italic text-gold-300">
        "Fortune favors the bold who embrace the cold."
        <footer className="text-lg mt-2 text-gold-200">- Alexander the Great</footer>
      </blockquote>
    </div>

    {filteredData.length === 0 && (
      <div className="text-center py-12">
        <p className="text-xl text-gold-300">No battles recorded for the selected campaign period.</p>
      </div>
    )}
  </div>
</div>
);
};

export default ColdForgeMetricsDisplay;