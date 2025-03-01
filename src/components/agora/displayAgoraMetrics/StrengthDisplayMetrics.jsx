import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Area,
  ComposedChart
} from 'recharts';
import _ from 'lodash';
import { Search, Filter, Trophy, Shield, Swords, ChevronDown, Calendar } from 'lucide-react';
import agoraService from '../../../services/agoraService';

const COLORS = {
  sparta: '#CD7F32',    // Bronze
  athens: '#FFD700',    // Gold
  thebes: '#C0C0C0',     // Silver
  macedonia: '#8B0000',  // Dark Red
  olympus: '#4B0082'     // Imperial Purple
};

// -------------------- Heatmap Helpers --------------------

// Weekday and Month labels for the heatmap
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Generate heatmap data from the workouts list
const generateHeatmapData = (workouts) => {
  const heatmapData = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 84); // Show last 12 weeks

  // Generate an entry for each day between startDate and today
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const workoutsOnDay = workouts.filter(w =>
      w.rawDate.toISOString().split('T')[0] === dateStr
    );

    heatmapData.push({
      date: new Date(d),
      value: workoutsOnDay.length ? Math.max(...workoutsOnDay.map(w => w.battleRating)) : 0,
      workouts: workoutsOnDay
    });
  }

  // Group days into weeks
  const weeks = [];
  let currentWeek = [];

  heatmapData.forEach((day) => {
    currentWeek.push(day);
    if (day.date.getDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};

// A single cell in the heatmap
const HeatmapCell = ({ day, onHover, onLeave }) => {
  const getColor = (value) => {
    if (value === 0) return 'bg-gray-800';
    if (value < 30) return 'bg-red-900';
    if (value < 50) return 'bg-red-700';
    if (value < 70) return 'bg-red-500';
    if (value < 90) return 'bg-red-300';
    return 'bg-red-200';
  };

  return (
    <div
      className={`w-8 h-8 ${getColor(day.value)} rounded-sm m-0.5 cursor-pointer 
                  transition-all duration-200 hover:ring-2 hover:ring-gold-500`}
      onMouseEnter={() => onHover(day)}
      onMouseLeave={onLeave}
    />
  );
};

// HeatmapSection component displays the training frequency & intensity heatmap.
const HeatmapSection = ({ workouts }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const weeks = generateHeatmapData(workouts);

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-gold-500/20 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gold-300">Training Frequency & Intensity</h2>
      
      <div className="flex mb-4">
        {/* Day labels */}
        <div className="w-12 mr-2">
          {/* Spacer for alignment */}
        </div>
        <div className="flex flex-1 justify-between px-2">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-sm text-gold-200">{day}</div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex items-center mb-2">
            {/* Month label (display only on first week of the month) */}
            <div className="w-12 text-sm text-gold-200">
              {week[0].date.getDate() <= 7 && MONTHS[week[0].date.getMonth()]}
            </div>
            <div className="flex flex-1">
              {week.map((day, dayIndex) => (
                <HeatmapCell
                  key={dayIndex}
                  day={day}
                  onHover={setHoveredDay}
                  onLeave={() => setHoveredDay(null)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-end space-x-4">
        <div className="text-sm text-gold-200">Intensity:</div>
        {[0, 30, 50, 70, 90].map((threshold, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-4 h-4 rounded-sm ${
              threshold === 0 ? 'bg-gray-800' :
              threshold < 30 ? 'bg-red-900' :
              threshold < 50 ? 'bg-red-700' :
              threshold < 70 ? 'bg-red-500' :
              threshold < 90 ? 'bg-red-300' :
              'bg-red-200'
            }`} />
            <span className="ml-1 text-sm text-gold-200">{threshold}+</span>
          </div>
        ))}
      </div>

      {/* Hover Details */}
      {hoveredDay && hoveredDay.workouts.length > 0 && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
          <div className="font-bold text-gold-300 mb-2">
            {hoveredDay.date.toLocaleDateString()} Training Details
          </div>
          <div className="space-y-2">
            {hoveredDay.workouts.map((workout, i) => (
              <div key={i} className="text-sm">
                <div className="text-gold-200">Battle Rating: {workout.battleRating}</div>
                <div className="text-gold-200">
                  Exercises: {workout.exercises.map(e => e.name).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------- StrengthTrainingMetricsDisplay Component --------------------

// Calculate various warrior metrics
const calculateMetrics = (workout) => {
  const exercises = workout.exercises || [];
  
  // Total Volume (weight * sets * reps)
  const totalVolume = exercises.reduce((sum, ex) => {
    return sum + (parseInt(ex.weight) || 0) * (parseInt(ex.sets) || 0) * (parseInt(ex.reps) || 0);
  }, 0);

  // Max Weight lifted
  const maxWeight = Math.max(...exercises.map(ex => parseInt(ex.weight) || 0));

  // Total Working Sets
  const totalSets = exercises.reduce((sum, ex) => sum + (parseInt(ex.sets) || 0), 0);

  return {
    totalVolume,
    maxWeight,
    totalSets,
    energyLevel: workout.energyLevel || 0,
    restPeriod: workout.restPeriod || 0
  };
};

// Calculate Battle Rating (overall workout score)
const calculateBattleRating = (workout) => {
  const metrics = calculateMetrics(workout);
  
  const volumeScore = Math.min(100, metrics.totalVolume / 100);
  const intensityScore = metrics.maxWeight * 0.5;
  const enduranceScore = metrics.totalSets * 5;
  const energyScore = metrics.energyLevel * 10;
  
  return Math.min(100, Math.round((volumeScore + intensityScore + enduranceScore + energyScore) / 4));
};

const StrengthTrainingMetricsDisplay = () => {
  // State Management
  const [metricsData, setMetricsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortMetric, setSortMetric] = useState('date');
  const [selectedView, setSelectedView] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  // Fetch and transform data
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const actions = await agoraService.actions.getAll({ is_completed: true });
        
        const strengthActions = actions.filter(action => {
          const discipline = action.discipline_details || action.discipline;
          return discipline &&
                 discipline.path === 'training' &&
                 discipline.name === 'Strength Training';
        });

        const transformed = strengthActions.map(action => {
          const completedDate = new Date(action.completed_at || action.metrics?.completed_at);
          const workoutData = {
            id: action.id,
            date: completedDate.toLocaleDateString(),
            rawDate: completedDate,
            exercises: action.metrics?.exercises || [],
            restPeriod: action.metrics?.rest_period || 0,
            energyLevel: action.metrics?.energy_level || 0,
            reflection: action.reflection || '',
            battleRating: 0, // Will be calculated
            volumeMetrics: null, // Will be calculated
          };

          // Calculate advanced metrics
          const metrics = calculateMetrics(workoutData);
          workoutData.volumeMetrics = metrics;
          workoutData.battleRating = calculateBattleRating(workoutData);

          return workoutData;
        });

        // Newest sessions first
        transformed.sort((a, b) => b.rawDate - a.rawDate);
        setMetricsData(transformed);
        setFilteredData(transformed);
        computeAnalytics(transformed);
      } catch (error) {
        console.error('Error fetching strength metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...metricsData];

    // Search term filter (exercises or reflections)
    if (searchTerm) {
      filtered = filtered.filter(workout => 
        workout.exercises.some(ex => 
          ex.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        workout.reflection.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Exercise filter
    if (selectedExercise !== 'all') {
      filtered = filtered.filter(workout =>
        workout.exercises.some(ex => ex.name === selectedExercise)
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const pastDate = new Date();
      switch (dateRange) {
        case 'week':
          pastDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          pastDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          pastDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }
      filtered = filtered.filter(workout => workout.rawDate >= pastDate);
    }

    // Sort the data
    filtered.sort((a, b) => {
      switch (sortMetric) {
        case 'battleRating':
          return b.battleRating - a.battleRating;
        case 'volume':
          return b.volumeMetrics.totalVolume - a.volumeMetrics.totalVolume;
        case 'date':
        default:
          return b.rawDate - a.rawDate;
      }
    });

    setFilteredData(filtered);
  }, [metricsData, searchTerm, selectedExercise, dateRange, sortMetric]);

  // Compute analytics for the filtered data
  const computeAnalytics = (data) => {
    const exercises = _.uniq(data.flatMap(w => w.exercises.map(e => e.name)));
    
    const exerciseStats = exercises.map(exercise => {
      const allSets = data.flatMap(w => 
        w.exercises
          .filter(e => e.name === exercise)
          .map(e => ({
            weight: parseInt(e.weight) || 0,
            reps: parseInt(e.reps) || 0,
            sets: parseInt(e.sets) || 0,
            date: w.date
          }))
      );

      return {
        name: exercise,
        maxWeight: Math.max(...allSets.map(s => s.weight)),
        totalVolume: allSets.reduce((sum, s) => sum + (s.weight * s.reps * s.sets), 0),
        frequency: allSets.length,
        progression: _.chain(allSets)
          .groupBy('date')
          .map((sets, date) => ({
            date,
            maxWeight: Math.max(...sets.map(s => s.weight))
          }))
          .value()
      };
    });

    setAnalytics({
      totalSessions: data.length,
      totalVolume: data.reduce((sum, w) => sum + w.volumeMetrics.totalVolume, 0),
      averageRating: _.meanBy(data, 'battleRating'),
      bestRating: Math.max(...data.map(w => w.battleRating)),
      exerciseStats,
      exercises
    });
  };

  const renderSearchAndFilters = () => (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-gold-500/20 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search exercises or reflections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gold-500/20 rounded-lg p-2 pl-8 text-gold-100"
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gold-500/50" />
        </div>

        {/* Exercise Filter */}
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="bg-gray-800 border border-gold-500/20 rounded-lg p-2 text-gold-100"
        >
          <option value="all">All Exercises</option>
          {analytics?.exercises.map(ex => (
            <option key={ex} value={ex}>{ex}</option>
          ))}
        </select>

        {/* Date Range */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-gray-800 border border-gold-500/20 rounded-lg p-2 text-gold-100"
        >
          <option value="all">All Time</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
          <option value="quarter">Past Quarter</option>
        </select>

        {/* Sort */}
        <select
          value={sortMetric}
          onChange={(e) => setSortMetric(e.target.value)}
          className="bg-gray-800 border border-gold-500/20 rounded-lg p-2 text-gold-100"
        >
          <option value="date">Sort by Date</option>
          <option value="battleRating">Sort by Battle Rating</option>
          <option value="volume">Sort by Volume</option>
        </select>
      </div>
    </div>
  );

  // --- Tab Rendering Functions ---

  // Overview Tab: Display overall session counts, volume, and ratings
  const renderOverviewTab = () => (
    <div>
      <h2 className="text-3xl font-bold mb-4">Overview</h2>
      {analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p>Total Sessions</p>
            <h3 className="text-xl font-bold">{analytics.totalSessions}</h3>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p>Total Volume</p>
            <h3 className="text-xl font-bold">{analytics.totalVolume}</h3>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p>Average Battle Rating</p>
            <h3 className="text-xl font-bold">{analytics.averageRating.toFixed(1)}</h3>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p>Best Battle Rating</p>
            <h3 className="text-xl font-bold">{analytics.bestRating}</h3>
          </div>
        </div>
      ) : (
        <p>Loading analytics...</p>
      )}
    </div>
  );

  // Battles Tab: Visualize each workout’s battle rating and volume
  const renderBattlesTab = () => (
    <div>
      <h2 className="text-3xl font-bold mb-4">Battles</h2>
      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={(data) => data.volumeMetrics.totalVolume}
              name="Total Volume"
              barSize={20}
              fill="#8884d8"
            />
            <Line type="monotone" dataKey="battleRating" name="Battle Rating" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <p>No battles data available.</p>
      )}
    </div>
  );

  // Analysis Tab: Show exercise progression (requires a specific exercise selection)
  const renderAnalysisTab = () => {
    if (selectedExercise === 'all') {
      return <p>Please select a specific exercise from the filter above to view analysis.</p>;
    }
    const stats = analytics?.exerciseStats.find(e => e.name === selectedExercise);
    if (!stats) {
      return <p>No data available for {selectedExercise}.</p>;
    }
    return (
      <div>
        <h2 className="text-3xl font-bold mb-4">Analysis: {selectedExercise}</h2>
        {stats.progression && stats.progression.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.progression}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="maxWeight" stroke="#82ca9d" name="Max Weight" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No progression data available.</p>
        )}
      </div>
    );
  };

  // Records Tab: List record performances per exercise
  const renderRecordsTab = () => (
    <div>
      <h2 className="text-3xl font-bold mb-4">Records</h2>
      {analytics && analytics.exerciseStats && analytics.exerciseStats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.exerciseStats.map(stat => (
            <div key={stat.name} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold">{stat.name}</h3>
              <p>Max Weight: {stat.maxWeight}</p>
              <p>Total Volume: {stat.totalVolume}</p>
              <p>Frequency: {stat.frequency}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No records available.</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-red-900 text-gold-100 p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-red-900 text-gold-100 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gold-300 hover:text-gold-100 transition-colors duration-200"
        >
          ← Return to the Agora
        </button>

        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gold-300">
            ΑΛΕΞΑΝΔΡΟΥ ΠΑΛΑΙΣΤΡΑ
          </h1>
          <p className="text-xl text-gold-200">
            "Through iron, we forge both body and spirit."
          </p>
        </header>

        {renderSearchAndFilters()}

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {['overview', 'battles', 'analysis', 'records'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedView(tab)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                selectedView === tab
                  ? 'bg-gold-500/20 text-gold-300'
                  : 'hover:bg-gold-500/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Render content based on the selected view */}
        {selectedView === 'overview' && renderOverviewTab()}
        {selectedView === 'battles' && renderBattlesTab()}
        {selectedView === 'analysis' && (
          <>
            <HeatmapSection workouts={metricsData} />
            {renderAnalysisTab()}
          </>
        )}
        {selectedView === 'records' && renderRecordsTab()}
      </div>
    </div>
  );
};

export default StrengthTrainingMetricsDisplay;
