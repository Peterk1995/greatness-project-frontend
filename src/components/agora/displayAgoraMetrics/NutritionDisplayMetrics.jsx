import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart,
  Area
} from 'recharts';
import _ from 'lodash';
import agoraService from '../../../services/agoraService';

// Colors for different nutrient types
const MACRO_COLORS = {
  protein: '#FF8042',
  carbs: '#00C49F',
  fats: '#FFBB28'
};

// Calculate warrior nutrition score
const calculateWarriorScore = (metrics) => {
  if (!metrics?.macros) return 0;
  
  const proteinScore = (metrics.macros.protein / metrics.calories.target) * 100 * 1.2; // Extra weight for protein
  const carbScore = (metrics.macros.carbs / metrics.calories.target) * 100;
  const fatScore = (metrics.macros.fats / metrics.calories.target) * 100 * 0.8;
  
  return Math.min(100, Math.round((proteinScore + carbScore + fatScore) / 3));
};

const NutritionMetricsDisplay = () => {
  const [metricsData, setMetricsData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const actions = await agoraService.actions.getAll({ is_completed: true });
        
        const nutritionActions = actions.filter(action => {
          const discipline = action.discipline_details || action.discipline;
          return discipline &&
                 discipline.path === 'fasting' &&
                 discipline.name === 'Nutrition Tracking';
        });

        const transformed = nutritionActions.map(action => {
          const completedDate = new Date(action.completed_at || action.metrics?.completed_at);
          return {
            date: completedDate.toLocaleDateString(),
            rawDate: completedDate,
            calories: {
              target: action.metrics?.calories?.target || 0,
              actual: action.metrics?.calories?.actual || 0
            },
            macros: {
              protein: action.metrics?.macros?.protein || 0,
              carbs: action.metrics?.macros?.carbs || 0,
              fats: action.metrics?.macros?.fats || 0
            },
            isFasting: action.metrics?.is_fasting || false,
            reflection: action.reflection || '',
            warriorScore: calculateWarriorScore(action.metrics)
          };
        });

        transformed.sort((a, b) => a.rawDate - b.rawDate);
        setMetricsData(transformed);
        computeAnalytics(transformed);
      } catch (error) {
        console.error('Error fetching nutrition metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const computeAnalytics = (data) => {
    const latestEntry = data[data.length - 1];
    const weeklyData = _.groupBy(data, item => 
      item.rawDate.toISOString().slice(0, 10)
    );

    const weeklyAverages = Object.entries(weeklyData).map(([week, entries]) => ({
      week,
      avgCalories: _.meanBy(entries, 'calories.actual'),
      avgProtein: _.meanBy(entries, d => d.macros.protein),
      avgCarbs: _.meanBy(entries, d => d.macros.carbs),
      avgFats: _.meanBy(entries, d => d.macros.fats),
      avgWarriorScore: _.meanBy(entries, 'warriorScore')
    }));

    setAnalytics({
      totalEntries: data.length,
      averageCalories: _.meanBy(data, 'calories.actual'),
      averageProtein: _.meanBy(data, d => d.macros.protein),
      averageCarbs: _.meanBy(data, d => d.macros.carbs),
      averageFats: _.meanBy(data, d => d.macros.fats),
      bestWarriorScore: _.maxBy(data, 'warriorScore')?.warriorScore || 0,
      weeklyAverages,
      latestMetrics: latestEntry
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="text-center text-gold-100">
          <div className="text-2xl font-bold">Consulting the Oracle of Delphi...</div>
          <div className="mt-2">Analyzing thy nutritional conquests...</div>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <>
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
          <h3 className="text-gold-300 text-lg font-bold mb-2">Warrior Score</h3>
          <p className="text-4xl font-bold">{analytics?.bestWarriorScore || 0}</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
          <h3 className="text-gold-300 text-lg font-bold mb-2">Avg. Calories</h3>
          <p className="text-4xl font-bold">{Math.round(analytics?.averageCalories || 0)}</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
          <h3 className="text-gold-300 text-lg font-bold mb-2">Avg. Protein</h3>
          <p className="text-4xl font-bold">{Math.round(analytics?.averageProtein || 0)}g</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
          <h3 className="text-gold-300 text-lg font-bold mb-2">Total Entries</h3>
          <p className="text-4xl font-bold">{analytics?.totalEntries || 0}</p>
        </div>
      </div>

      {/* Macros Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
          <h2 className="text-2xl font-bold mb-4 text-gold-300">Macronutrient Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Protein', value: analytics?.latestMetrics?.macros.protein || 0 },
                  { name: 'Carbs', value: analytics?.latestMetrics?.macros.carbs || 0 },
                  { name: 'Fats', value: analytics?.latestMetrics?.macros.fats || 0 }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {Object.values(MACRO_COLORS).map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Warrior Score Trend */}
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
          <h2 className="text-2xl font-bold mb-4 text-gold-300">Warrior Score Progression</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#666" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="warriorScore" 
                stroke="#ffd700" 
                name="Warrior Score"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Caloric and Macro Trends */}
      <div className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gold-300">Nutritional Battle Log</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#666" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="calories.actual" name="Calories" fill="#8884d8" />
            <Line type="monotone" dataKey="macros.protein" name="Protein" stroke={MACRO_COLORS.protein} />
            <Line type="monotone" dataKey="macros.carbs" name="Carbs" stroke={MACRO_COLORS.carbs} />
            <Line type="monotone" dataKey="macros.fats" name="Fats" stroke={MACRO_COLORS.fats} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );

  const renderJournalTab = () => (
    <div className="space-y-6">
      {metricsData.map((entry, index) => (
        <div key={index} className="bg-gray-700/50 rounded-lg p-6 border border-gold-500/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gold-300">{entry.date}</h3>
              <p className="text-sm text-gold-200 mt-1">
                Warrior Score: {entry.warriorScore}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{entry.calories.actual} / {entry.calories.target} cal</p>
              <p className="text-sm text-gold-200">
                {entry.isFasting ? 'Fasting Day' : 'Regular Day'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-800/50 rounded">
              <p className="text-sm text-gold-200">Protein</p>
              <p className="text-lg font-bold">{entry.macros.protein}g</p>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded">
              <p className="text-sm text-gold-200">Carbs</p>
              <p className="text-lg font-bold">{entry.macros.carbs}g</p>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded">
              <p className="text-sm text-gold-200">Fats</p>
              <p className="text-lg font-bold">{entry.macros.fats}g</p>
            </div>
          </div>

          {entry.reflection && (
            <div className="mt-4">
              <h4 className="text-gold-300 font-semibold mb-2">Reflection</h4>
              <p className="text-gold-100 italic">{entry.reflection}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gold-100 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gold-300 hover:text-gold-100 transition-colors duration-200"
        >
          ← Return to the Agora
        </button>

        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gold-300">
            Alexander's Nutritional Chronicles
          </h1>
          <p className="text-xl text-gold-200">
            "An army marches on its stomach" - Ancient Wisdom
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedTab === 'overview'
                ? 'bg-gold-500/20 text-gold-300'
                : 'hover:bg-gold-500/10'
            }`}
          >
            Strategic Overview
          </button>
          <button
            onClick={() => setSelectedTab('journal')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedTab === 'journal'
                ? 'bg-gold-500/20 text-gold-300'
                : 'hover:bg-gold-500/10'
            }`}
          >
            Battle Journal
          </button>
        </div>

        {selectedTab === 'overview' ? renderOverviewTab() : renderJournalTab()}

        {/* Inspirational Quote */}
        <div className="text-center mt-12">
          <blockquote className="text-2xl italic text-gold-300">
            "Let food be thy medicine, and medicine be thy food."
            <footer className="text-lg mt-2 text-gold-200">- Hippocrates</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default NutritionMetricsDisplay;