import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import _ from 'lodash';
import agoraService from '../../../services/agoraService';

const COLORS = {
  gold: '#FFD700',
  purple: '#9F7AEA',
  blue: '#63B3ED',
  indigo: '#7F9CF5'
};

// Calculate spiritual wisdom score based on study metrics
const calculateWisdomScore = (metrics) => {
  if (!metrics) return 0;
  const pagesScore = (metrics.actual_pages / metrics.targetPages) * 50;
  const versesScore = (metrics.actual_verses / metrics.targetVerses) * 50;
  return Math.min(100, Math.round(pagesScore + versesScore));
};

const OverviewTab = ({ metricsData, analytics }) => (
  <>
    {/* Sacred Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-indigo-900/50 rounded-lg p-6 border border-gold-500/20 text-center">
        <h3 className="text-gold-300 text-lg font-bold mb-2">Highest Wisdom</h3>
        <p className="text-4xl font-bold">{analytics?.highestWisdomScore || 0}</p>
      </div>
      <div className="bg-indigo-900/50 rounded-lg p-6 border border-gold-500/20 text-center">
        <h3 className="text-gold-300 text-lg font-bold mb-2">Total Pages</h3>
        <p className="text-4xl font-bold">{analytics?.totalPages || 0}</p>
      </div>
      <div className="bg-indigo-900/50 rounded-lg p-6 border border-gold-500/20 text-center">
        <h3 className="text-gold-300 text-lg font-bold mb-2">Verses Mastered</h3>
        <p className="text-4xl font-bold">{analytics?.totalVerses || 0}</p>
      </div>
      <div className="bg-indigo-900/50 rounded-lg p-6 border border-gold-500/20 text-center">
        <h3 className="text-gold-300 text-lg font-bold mb-2">Study Sessions</h3>
        <p className="text-4xl font-bold">{analytics?.totalSessions || 0}</p>
      </div>
    </div>

    {/* Wisdom Progress Charts */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="bg-indigo-900/50 rounded-lg p-6 border border-gold-500/20 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gold-300">Wisdom Score Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#666" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="wisdomScore"
              stroke={COLORS.gold}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-indigo-900/50 rounded-lg p-6 border border-gold-500/20 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gold-300">Study Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#666" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="actualPages" name="Pages Read" fill={COLORS.purple} barSize={30} />
            <Line
              type="monotone"
              dataKey="actualVerses"
              name="Verses Mastered"
              stroke={COLORS.gold}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  </>
);

const JournalTab = ({ metricsData }) => (
  <div className="space-y-6">
    {metricsData.map((entry, index) => (
      <div key={index} className="bg-indigo-900/50 rounded-lg p-6 border border-gold-500/20 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-gold-300">{entry.date}</h3>
            <p className="text-sm text-gold-200 mt-1">Wisdom Score: {entry.wisdomScore}</p>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <p className="text-lg font-bold">{entry.actualPages} pages read</p>
            <p className="text-sm text-gold-200">{entry.actualVerses} verses mastered</p>
          </div>
        </div>
        {entry.notes && (
          <div className="mb-4 p-4 bg-purple-900/30 rounded-lg">
            <h4 className="text-gold-300 font-semibold mb-2">Study Notes</h4>
            <p className="text-gold-100">{entry.notes}</p>
          </div>
        )}
        {entry.reflection && (
          <div className="p-4 bg-blue-900/30 rounded-lg">
            <h4 className="text-gold-300 font-semibold mb-2">Sacred Reflection</h4>
            <p className="text-gold-100 italic">{entry.reflection}</p>
          </div>
        )}
      </div>
    ))}
  </div>
);

const ScriptureMetricsDisplay = () => {
  const [metricsData, setMetricsData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const actions = await agoraService.actions.getAll({ is_completed: true });
        const scriptureActions = actions.filter(action => {
          const discipline = action.discipline_details || action.discipline;
          return (
            discipline &&
            discipline.path === 'scripture' &&
            discipline.name === 'Scripture Study'
          );
        });
        const transformed = scriptureActions.map(action => {
          const completedDate = new Date(action.completed_at || action.metrics?.completed_at);
          return {
            date: completedDate.toLocaleDateString(),
            rawDate: completedDate,
            targetPages: action.metrics?.targetPages ?? 0,
            actualPages: action.metrics?.actual_pages ?? 0,
            targetVerses: action.metrics?.targetVerses ?? 0,
            actualVerses: action.metrics?.actual_verses ?? 0,
            notes: action.metrics?.notes ?? '',
            reflection: action.reflection ?? '',
            wisdomScore: calculateWisdomScore(action.metrics),
            timestamp: action.metrics?.timestamp
          };
        });
        transformed.sort((a, b) => a.rawDate - b.rawDate);
        setMetricsData(transformed);
      } catch (error) {
        console.error('Error fetching scripture metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const analytics = useMemo(() => {
    if (metricsData.length === 0) return null;
    const latestEntry = metricsData[metricsData.length - 1];
    const groupedByDay = _.groupBy(metricsData, entry =>
      entry.rawDate.toISOString().slice(0, 10)
    );
    const weeklyAverages = Object.entries(groupedByDay).map(([day, entries]) => ({
      day,
      avgPages: _.meanBy(entries, 'actualPages'),
      avgVerses: _.meanBy(entries, 'actualVerses'),
      avgWisdomScore: _.meanBy(entries, 'wisdomScore')
    }));
    return {
      totalSessions: metricsData.length,
      totalPages: _.sumBy(metricsData, 'actualPages'),
      totalVerses: _.sumBy(metricsData, 'actualVerses'),
      averageWisdomScore: _.meanBy(metricsData, 'wisdomScore'),
      highestWisdomScore: _.maxBy(metricsData, 'wisdomScore')?.wisdomScore || 0,
      mostPagesInDay: _.maxBy(metricsData, 'actualPages')?.actualPages || 0,
      weeklyAverages,
      latestMetrics: latestEntry
    };
  }, [metricsData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-900">
        <div className="text-center text-gold-100">
          <div className="text-2xl font-bold">Contemplating Divine Wisdom...</div>
          <div className="mt-2">Gathering thy sacred reflections...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 text-gold-100 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gold-300 hover:text-gold-100 transition-colors duration-200"
        >
          ← Return to the Agora
        </button>

        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 text-gold-300">
            Alexander's Epic Chronicles
          </h1>
          <p className="text-xl text-gold-200">
            "In the annals of history, wisdom conquers all."
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-6 py-2 rounded-full transition-colors duration-200 ${
              selectedTab === 'overview'
                ? 'bg-gold-500/20 text-gold-300'
                : 'hover:bg-gold-500/10'
            }`}
          >
            Divine Overview
          </button>
          <button
            onClick={() => setSelectedTab('journal')}
            className={`px-6 py-2 rounded-full transition-colors duration-200 ${
              selectedTab === 'journal'
                ? 'bg-gold-500/20 text-gold-300'
                : 'hover:bg-gold-500/10'
            }`}
          >
            Sacred Journal
          </button>
        </div>

        {selectedTab === 'overview' ? (
          <OverviewTab metricsData={metricsData} analytics={analytics} />
        ) : (
          <JournalTab metricsData={metricsData} />
        )}

        <div className="text-center mt-12">
          <blockquote className="text-2xl italic text-gold-300">
            "Knowledge comes, but wisdom lingers."
            <footer className="text-lg mt-2 text-gold-200">- Ancient Proverb</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default ScriptureMetricsDisplay;
