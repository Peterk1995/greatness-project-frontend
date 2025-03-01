import React, { useState, useEffect } from 'react';
// Add these imports at the top of your file
import { useNavigate } from 'react-router-dom';
import agoraService from '../../../services/agoraService';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  Scroll, Book, Award, Trophy, Flame, Sparkles, 
  Brain, Crown, Star, Calendar, ChevronLeft,
  Filter
} from 'lucide-react';

// Color scheme for the reading metrics dashboard
const COLORS = {
  primary: '#7C3AED', // Rich purple
  secondary: '#2563EB', // Royal blue
  accent: '#FFD700', // Gold
  backgrounds: {
    dark: '#1E1B4B', // Deep indigo
    medium: '#312E81', // Indigo
    light: '#4338CA', // Medium indigo
  },
  charts: {
    pages: '#8B5CF6', // Purple
    books: '#3B82F6', // Blue
    wisdom: '#F59E0B', // Amber
    insight: '#10B981', // Emerald
    greatness: '#EC4899', // Pink
  }
};

// Greek-inspired quotes about reading and wisdom
const WISDOM_QUOTES = [
  { quote: "Knowledge is the eye of desire and can become the pilot of the soul.", author: "Will Durant" },
  { quote: "Wonder is the beginning of wisdom.", author: "Socrates" },
  { quote: "Employ your time in improving yourself by other men's writings.", author: "Socrates" },
  { quote: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { quote: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { quote: "Wisdom begins in wonder.", author: "Socrates" }
];

const ReadingDisplayMetrics = () => {
  const [metricsData, setMetricsData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [quote, setQuote] = useState(WISDOM_QUOTES[0]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReadingMetrics();
    
    // Select a random quote
    const randomQuote = WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  useEffect(() => {
    if (metricsData.length > 0) {
      computeAnalytics(filterData(metricsData));
    }
  }, [metricsData, selectedGenre, selectedPeriod]);

  const fetchReadingMetrics = async () => {
    try {
      setLoading(true);
      // Get all completed reading actions
      const actions = await agoraService.actions.getAll({
        is_completed: true,
        discipline__name: 'Reading Challenge'
      });

      // Transform the data for our metrics display
      const transformed = actions.map(action => {
        const completedDate = new Date(action.completed_at || action.metrics?.completed_at);
        return {
          id: action.id,
          date: completedDate.toLocaleDateString(),
          rawDate: completedDate,
          title: action.metrics?.book_title || 'Unknown Book',
          genre: action.metrics?.genre || 'unknown',
          targetPages: action.metrics?.target_pages || 0,
          actualPages: action.metrics?.actual_pages || 0,
          notes: action.metrics?.notes || '',
          noteQuality: action.metrics?.note_quality || 'standard',
          reflection: action.reflection || '',
          xpEarned: action.final_xp || 0
        };
      });

      // Sort by date, newest first
      transformed.sort((a, b) => b.rawDate - a.rawDate);
      
      setMetricsData(transformed);
      computeAnalytics(transformed);
    } catch (error) {
      console.error('Error fetching reading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) => {
    let filtered = [...data];
    
    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(item => item.genre === selectedGenre);
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

    // Get all genres
    const genres = [...new Set(data.map(item => item.genre))];
    
    // Calculate genre statistics
    const genreStats = genres.map(genre => {
      const genreItems = data.filter(item => item.genre === genre);
      return {
        name: genre,
        count: genreItems.length,
        totalPages: genreItems.reduce((sum, item) => sum + item.actualPages, 0),
        avgPages: Math.round(genreItems.reduce((sum, item) => sum + item.actualPages, 0) / genreItems.length),
        totalXP: genreItems.reduce((sum, item) => sum + item.xpEarned, 0)
      };
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
          totalPages: 0,
          booksRead: 0,
          totalXP: 0
        };
      }
      
      weeklyData[weekKey].totalPages += item.actualPages;
      weeklyData[weekKey].booksRead += 1;
      weeklyData[weekKey].totalXP += item.xpEarned;
    });

    // Calculate total metrics
    const totalStats = {
      totalBooks: data.length,
      totalPages: data.reduce((sum, item) => sum + item.actualPages, 0),
      avgPagesPerDay: Math.round(data.reduce((sum, item) => sum + item.actualPages, 0) / 
                             (data.length ? (Math.max(...data.map(d => d.rawDate)) - 
                                           Math.min(...data.map(d => d.rawDate))) / (1000 * 60 * 60 * 24) : 1)),
      totalXP: data.reduce((sum, item) => sum + item.xpEarned, 0),
      deepStudySessions: data.filter(item => item.noteQuality === 'extensive').length,
      mostReadGenre: genreStats.sort((a, b) => b.count - a.count)[0]?.name || 'None',
      genreStats,
      weeklyProgress: Object.values(weeklyData).sort((a, b) => 
        new Date(a.week.split('Week of ')[1]) - new Date(b.week.split('Week of ')[1]))
    };

    setAnalytics(totalStats);
  };

  // Calculate mastery level based on pages read
  const calculateMasteryLevel = (pages) => {
    if (pages >= 5000) return { level: 'Divine Scholar', icon: <Crown className="w-6 h-6 text-yellow-400" /> };
    if (pages >= 3000) return { level: 'Philosopher King', icon: <Brain className="w-6 h-6 text-indigo-400" /> };
    if (pages >= 1500) return { level: 'Master Strategist', icon: <Scroll className="w-6 h-6 text-blue-400" /> };
    if (pages >= 750) return { level: 'Dedicated Student', icon: <Book className="w-6 h-6 text-emerald-400" /> };
    return { level: 'Aspiring Scholar', icon: <Scroll className="w-6 h-6 text-purple-400" /> };
  };

  const renderHeroSection = () => {
    if (!analytics) return null;
    
    const mastery = calculateMasteryLevel(analytics.totalPages);
    
    return (
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-2xl overflow-hidden shadow-xl border border-indigo-700 mb-8">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">The Great Library</h2>
              <p className="text-indigo-200 text-lg">Your path to wisdom and glory</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0 bg-indigo-800/70 px-4 py-3 rounded-lg border border-indigo-600">
              {mastery.icon}
              <div>
                <span className="text-indigo-200 text-sm">Mastery Level</span>
                <h3 className="text-xl font-bold text-white">{mastery.level}</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-indigo-800/60 rounded-xl p-5 border border-indigo-700 flex flex-col items-center">
              <Book className="w-10 h-10 text-blue-300 mb-2" />
              <span className="text-indigo-200 text-sm">Total Books</span>
              <span className="text-3xl font-bold text-white">{analytics.totalBooks}</span>
            </div>

            <div className="bg-indigo-800/60 rounded-xl p-5 border border-indigo-700 flex flex-col items-center">
              <Scroll className="w-10 h-10 text-purple-300 mb-2" />
              <span className="text-indigo-200 text-sm">Pages Conquered</span>
              <span className="text-3xl font-bold text-white">{analytics.totalPages.toLocaleString()}</span>
            </div>

            <div className="bg-indigo-800/60 rounded-xl p-5 border border-indigo-700 flex flex-col items-center">
              <Brain className="w-10 h-10 text-emerald-300 mb-2" />
              <span className="text-indigo-200 text-sm">Deep Study Sessions</span>
              <span className="text-3xl font-bold text-white">{analytics.deepStudySessions}</span>
            </div>

            <div className="bg-indigo-800/60 rounded-xl p-5 border border-indigo-700 flex flex-col items-center">
              <Star className="w-10 h-10 text-yellow-300 mb-2" />
              <span className="text-indigo-200 text-sm">Wisdom XP Gained</span>
              <span className="text-3xl font-bold text-white">{analytics.totalXP.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProgress = () => {
    if (!analytics?.weeklyProgress || analytics.weeklyProgress.length === 0) return null;
    
    return (
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl border border-indigo-700 mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Your Reading Campaign</h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.weeklyProgress}>
                <defs>
                  <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.charts.pages} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.charts.pages} stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="week" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1B4B', borderColor: '#4338CA', color: 'white' }}
                  labelStyle={{ color: 'white' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="totalPages" 
                  name="Pages Read" 
                  stroke={COLORS.charts.pages} 
                  fillOpacity={1} 
                  fill="url(#colorPages)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="booksRead" 
                  name="Books Completed" 
                  stroke={COLORS.charts.books} 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderGenreDistribution = () => {
    if (!analytics?.genreStats || analytics.genreStats.length === 0) return null;
    
    // Transform genre names to be more readable
    const transformedGenreStats = analytics.genreStats.map(stat => ({
      ...stat,
      name: stat.name.charAt(0).toUpperCase() + stat.name.slice(1).replace('_', ' ')
    }));
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl border border-indigo-700">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Knowledge Realms</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transformedGenreStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalPages"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {transformedGenreStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(COLORS.charts)[index % Object.values(COLORS.charts).length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value} pages`}
                    contentStyle={{ backgroundColor: '#1E1B4B', borderColor: '#4338CA', color: 'white' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl border border-indigo-700">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Warrior Scholar Mastery</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={transformedGenreStats}>
                  <PolarGrid stroke="#666" />
                  <PolarAngleAxis dataKey="name" stroke="#ccc" />
                  <PolarRadiusAxis stroke="#ccc" />
                  <Radar
                    name="Books Read"
                    dataKey="count"
                    stroke={COLORS.charts.wisdom}
                    fill={COLORS.charts.wisdom}
                    fillOpacity={0.6}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E1B4B', borderColor: '#4338CA', color: 'white' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecentBooks = () => {
    if (!metricsData || metricsData.length === 0) return null;
    
    // Get the most recent 5 books
    const recentBooks = metricsData.slice(0, 5);
    
    return (
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl border border-indigo-700 mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Conquests</h2>
          
          <div className="space-y-4">
            {recentBooks.map((book, index) => (
              <div 
                key={index} 
                className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-700 hover:border-indigo-500 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{book.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-indigo-300 text-sm capitalize">{book.genre.replace('_', ' ')}</span>
                      <span className="mx-2 text-indigo-500">•</span>
                      <span className="text-indigo-300 text-sm">{book.date}</span>
                    </div>
                  </div>
                  <div className="bg-indigo-700/50 px-3 py-1.5 rounded-lg border border-indigo-600">
                    <span className="text-white font-bold">{book.actualPages} pages</span>
                  </div>
                </div>
                
                {book.reflection && (
                  <div className="mt-3 text-indigo-200 text-sm italic border-l-2 border-indigo-500 pl-3">
                    "{book.reflection.slice(0, 120)}..."
                  </div>
                )}
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-300 text-sm">{book.xpEarned} XP</span>
                  </div>
                  
                  {book.noteQuality === 'extensive' && (
                    <div className="bg-indigo-900/80 text-xs px-2 py-1 rounded text-indigo-300 border border-indigo-700">
                      Deep Study
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWisdomQuote = () => {
    return (
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl border border-indigo-700 mb-8">
        <div className="p-8 text-center">
          <div className="inline-block bg-indigo-800/50 p-3 rounded-full border border-indigo-700 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          
          <blockquote className="text-2xl font-serif text-white italic mb-4">
            "{quote.quote}"
          </blockquote>
          
          <cite className="text-indigo-300">— {quote.author}</cite>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="text-center">
          <div className="inline-block">
            <Book className="w-16 h-16 text-indigo-300 animate-pulse" />
          </div>
          <p className="mt-4 text-xl text-indigo-200">Unfurling the scrolls of knowledge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-300 hover:text-indigo-100 transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Return to the Agora</span>
        </button>

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-400">
            Chronicles of Knowledge
          </h1>
          <p className="text-indigo-300 text-lg max-w-2xl mx-auto">
            "The conquest of wisdom requires the same courage as the conquest of territory."
          </p>
        </header>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center bg-indigo-900/70 rounded-lg overflow-hidden">
            <span className="bg-indigo-800 text-indigo-200 p-2"><Filter className="w-5 h-5" /></span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-transparent text-indigo-200 p-2 border-none outline-none"
            >
              <option value="all">All Subjects</option>
              {analytics?.genreStats.map((genre) => (
                <option key={genre.name} value={genre.name}>
                  {genre.name.charAt(0).toUpperCase() + genre.name.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center bg-indigo-900/70 rounded-lg overflow-hidden">
            <span className="bg-indigo-800 text-indigo-200 p-2"><Calendar className="w-5 h-5" /></span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-indigo-200 p-2 border-none outline-none"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        {metricsData.length === 0 ? (
          <div className="text-center py-12 bg-indigo-900/30 rounded-lg border border-indigo-800">
            <Book className="w-16 h-16 text-indigo-300 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-indigo-200 mb-2">Your Library Awaits</h3>
            <p className="text-indigo-300 max-w-md mx-auto">
              Begin your journey of knowledge. Complete reading activities to see your progress.
            </p>
          </div>
        ) : (
          <>
            {renderHeroSection()}
            {renderProgress()}
            {renderGenreDistribution()}
            {renderRecentBooks()}
            {renderWisdomQuote()}
          </>
        )}
      </div>
    </div>
  );
};

export default ReadingDisplayMetrics;