import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Feather, Star, Wind, 
  Clock, Calendar, Scroll, MapPin, 
  BookOpen, Heart, Plus, ArrowLeft,
  Award, BookMarked, Users
} from 'lucide-react';
import agoraService from '../../../services/agoraService';

const PrayerDisplayMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [practices, setPractices] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    averageDepth: 0,
    longestSession: 0,
    consistency: 0
  });
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSession, setNewSession] = useState({
    type: 'meditation',
    duration: 15,
    location: '',
    intentions: '',
    depth: 5
  });

  // Current quote from ancient wisdom
  const [currentQuote, setCurrentQuote] = useState(0);
  const ancientWisdom = [
    { text: "Know thyself.", author: "Temple of Apollo at Delphi" },
    { text: "The unexamined life is not worth living.", author: "Socrates" },
    { text: "First, pray for peace within your own soul.", author: "Pythagoras" },
    { text: "Look within. Within is the fountain of good, and it will ever bubble up, if thou wilt ever dig.", author: "Marcus Aurelius" },
    { text: "True wisdom comes to each of us when we realize how little we understand about life, ourselves, and the world around us.", author: "Socrates" }
  ];

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        // Filter for prayer & meditation actions
        const response = await agoraService.actions.getAll({ domain: 'wisdom' });
        const prayerMeditation = response.filter(action => 
          action.discipline?.path === 'prayer' || action.metrics?.type?.includes('meditation')
        );
        
        setPractices(prayerMeditation);
        calculateStats(prayerMeditation);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prayer practices:', err);
        setError('Failed to retrieve your sacred practices');
        setLoading(false);
      }
    };

    fetchPractices();

    // Rotate quotes every 15 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % ancientWisdom.length);
    }, 15000);

    return () => clearInterval(quoteInterval);
  }, []);

  const calculateStats = (practices) => {
    if (!practices.length) return;

    const completedPractices = practices.filter(p => p.is_completed);
    
    const totalMinutes = completedPractices.reduce((sum, p) => 
      sum + (p.metrics?.actual_duration || 0), 0);
      
    const depths = completedPractices
      .filter(p => p.metrics?.depth)
      .map(p => p.metrics.depth);
      
    const averageDepth = depths.length 
      ? depths.reduce((sum, d) => sum + d, 0) / depths.length 
      : 0;
      
    const longestSession = completedPractices.length
      ? Math.max(...completedPractices.map(p => p.metrics?.actual_duration || 0))
      : 0;
      
    // Calculate consistency (% of days with practice in last 7 days)
    const last7Days = new Set();
    const practiceInPast7Days = new Set();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.add(date.toISOString().split('T')[0]);
    }
    
    completedPractices.forEach(practice => {
      if (practice.completed_at) {
        const date = new Date(practice.completed_at).toISOString().split('T')[0];
        if (last7Days.has(date)) {
          practiceInPast7Days.add(date);
        }
      }
    });
    
    const consistency = Math.round((practiceInPast7Days.size / 7) * 100);
    
    setStats({
      totalSessions: completedPractices.length,
      totalMinutes,
      averageDepth,
      longestSession,
      consistency
    });
  };

  const getSessionIcon = (type) => {
    switch(type) {
      case 'meditation': return <Moon className="w-5 h-5 text-blue-400" />;
      case 'contemplation': return <Star className="w-5 h-5 text-purple-400" />;
      case 'vocal': return <BookMarked className="w-5 h-5 text-green-400" />;
      case 'prayer': return <Heart className="w-5 h-5 text-red-400" />;
      case 'guided': return <Users className="w-5 h-5 text-yellow-400" />;
      default: return <Moon className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleCreateSession = async () => {
    try {
      // Get the Prayer & Meditation discipline
      const disciplines = await agoraService.disciplines.getByPath('prayer');
      const prayerDiscipline = disciplines.find(d => d.name === 'Prayer & Meditation');
      
      if (!prayerDiscipline) {
        throw new Error('Prayer & Meditation discipline not found');
      }
      
      const payload = {
        title: `${newSession.type === 'meditation' ? 'Meditation' : 'Prayer'} Session`,
        description: newSession.intentions || 'Sacred time for spiritual connection',
        action_type: 'daily',
        domain: 'wisdom',
        difficulty: 'mortal',
        discipline: prayerDiscipline.id,
        metrics: {
          type: newSession.type,
          target_duration: newSession.duration,
          location: newSession.location,
          intentions: newSession.intentions,
          depth: newSession.depth
        }
      };
      
      const response = await agoraService.actions.create(payload);
      console.log('Created new session:', response);
      
      // Refresh practices
      const updatedPractices = [...practices, response];
      setPractices(updatedPractices);
      calculateStats(updatedPractices);
      
      // Reset form
      setNewSession({
        type: 'meditation',
        duration: 15,
        location: '',
        intentions: '',
        depth: 5
      });
      setShowNewSession(false);
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Failed to create your sacred practice');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
        <p className="mt-4 text-white">Preparing the sacred space...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-900">
      <div className="text-center text-white">
        <div className="text-xl mb-4">An error occurred in the sacred space</div>
        <div>{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 text-white">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-indigo-900 to-purple-900 border-b border-indigo-500/50 shadow-lg">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <div className="p-2 bg-indigo-800 rounded-full mr-4">
                  <Feather className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-indigo-100">Ναός Προσευχής</h1>
                  <p className="text-indigo-300 mt-1">The Temple of Prayer & Meditation</p>
                </div>
              </div>
              <p className="mt-4 text-indigo-200 max-w-xl">
                "In stillness, find your strength. In silence, find your voice."
              </p>
            </div>
            <div className="bg-indigo-800/30 p-4 rounded-lg border border-indigo-600/30 shadow-inner">
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-300">{stats.totalSessions}</div>
                  <div className="text-xs text-indigo-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-300">{stats.totalMinutes}</div>
                  <div className="text-xs text-indigo-400">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-300">{stats.consistency}%</div>
                  <div className="text-xs text-indigo-400">Consistency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Ancient Wisdom Quote */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 rounded-lg border border-indigo-400/30 mb-8 shadow-lg">
          <div className="flex items-start">
            <BookOpen className="w-8 h-8 text-indigo-300 mr-4 mt-1" />
            <div>
              <blockquote className="text-xl italic text-indigo-100">
                "{ancientWisdom[currentQuote].text}"
              </blockquote>
              <cite className="block mt-2 text-indigo-300">— {ancientWisdom[currentQuote].author}</cite>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Practice History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-indigo-200 flex items-center">
                <Scroll className="w-6 h-6 mr-2" />
                Sacred Practices
              </h2>
              <button 
                onClick={() => setShowNewSession(true)}
                className={`rounded-full p-2 ${showNewSession ? 'bg-indigo-700 text-indigo-200' : 'bg-indigo-800 text-indigo-300'} hover:bg-indigo-700 transition-colors`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showNewSession ? (
              <div className="bg-indigo-900/60 rounded-lg p-6 border border-indigo-600/50 shadow-lg">
                <h3 className="text-xl font-medium text-indigo-200 mb-4">New Sacred Practice</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-indigo-300 mb-1">Practice Type</label>
                    <select
                      value={newSession.type}
                      onChange={(e) => setNewSession({...newSession, type: e.target.value})}
                      className="w-full bg-indigo-800 border border-indigo-600 rounded p-2 text-indigo-200"
                    >
                      <option value="meditation">Silent Meditation</option>
                      <option value="contemplation">Contemplative Reflection</option>
                      <option value="vocal">Vocal Prayer</option>
                      <option value="guided">Guided Meditation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-indigo-300 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={newSession.duration}
                      onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                      className="w-full bg-indigo-800 border border-indigo-600 rounded p-2 text-indigo-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-indigo-300 mb-1">Sacred Location</label>
                    <input
                      type="text"
                      value={newSession.location}
                      onChange={(e) => setNewSession({...newSession, location: e.target.value})}
                      placeholder="Temple, Garden, Private Sanctuary..."
                      className="w-full bg-indigo-800 border border-indigo-600 rounded p-2 text-indigo-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-indigo-300 mb-1">Sacred Intentions</label>
                    <textarea
                      value={newSession.intentions}
                      onChange={(e) => setNewSession({...newSession, intentions: e.target.value})}
                      placeholder="What spiritual gifts do you seek through this practice?"
                      className="w-full bg-indigo-800 border border-indigo-600 rounded p-2 text-indigo-200"
                      rows={3}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-indigo-300 mb-1">Planned Depth (1-10)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newSession.depth}
                        onChange={(e) => setNewSession({...newSession, depth: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="text-indigo-200 font-bold">{newSession.depth}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowNewSession(false)}
                      className="px-4 py-2 text-indigo-300 hover:text-indigo-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateSession}
                      className="px-5 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-md shadow-lg transition-colors"
                    >
                      Begin Sacred Practice
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {practices.length === 0 ? (
                  <div className="bg-indigo-900/30 rounded-lg p-8 text-center border border-indigo-600/20">
                    <Feather className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-indigo-300 text-lg">Your sacred journey awaits. Begin your first practice.</p>
                  </div>
                ) : (
                  practices.map((practice, i) => (
                    <div 
                      key={practice.id || i} 
                      className={`p-4 rounded-lg border ${practice.is_completed ? 
                        'bg-indigo-900/60 border-indigo-600/50' : 
                        'bg-indigo-900/30 border-indigo-700/30'} shadow-lg`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          {getSessionIcon(practice.metrics?.type)}
                          <div>
                            <h3 className="font-bold text-indigo-200">{practice.title}</h3>
                            <div className="text-sm text-indigo-400 mt-1">
                              {practice.metrics?.type === 'meditation' ? 'Meditation' : 'Prayer'} • 
                              {practice.is_completed ? 
                                ` ${practice.metrics?.actual_duration || '-'} minutes` : 
                                ` ${practice.metrics?.target_duration || '-'} minutes planned`}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {practice.is_completed ? (
                            <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded-full">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full">
                              Awaiting
                            </span>
                          )}
                          <span className="text-xs text-indigo-400 mt-1">
                            {practice.completed_at ? 
                              new Date(practice.completed_at).toLocaleDateString() : 
                              'Not yet completed'}
                          </span>
                        </div>
                      </div>
                      
                      {practice.metrics?.location && (
                        <div className="mt-2 flex items-center text-indigo-400 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {practice.metrics.location}
                        </div>
                      )}
                      
                      {practice.metrics?.intentions && (
                        <div className="mt-2 text-indigo-300 text-sm italic">
                          "{practice.metrics.intentions}"
                        </div>
                      )}
                      
                      {practice.is_completed && practice.reflection && (
                        <div className="mt-4 bg-indigo-800/30 p-3 rounded border border-indigo-700/30">
                          <div className="text-xs text-indigo-400 mb-1">Sacred Reflection:</div>
                          <p className="text-sm text-indigo-200">{practice.reflection}</p>
                        </div>
                      )}
                      
                      {practice.is_completed && practice.metrics?.depth && (
                        <div className="mt-2 flex items-center">
                          <div className="text-xs text-indigo-400 mr-2">Spiritual Depth:</div>
                          <div className="bg-indigo-900 h-2 rounded-full flex-1">
                            <div 
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{width: `${(practice.metrics.depth / 10) * 100}%`}}
                            ></div>
                          </div>
                          <div className="text-xs text-indigo-300 ml-2">{practice.metrics.depth}/10</div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Column: Wisdom & Stats */}
          <div className="space-y-6">
            {/* Spiritual Analytics */}
            <div className="bg-indigo-900/50 rounded-lg border border-indigo-600/30 shadow-md overflow-hidden">
              <div className="bg-indigo-800 p-4 border-b border-indigo-700">
                <h3 className="font-bold text-indigo-100 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Spiritual Analytics
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-indigo-300 text-sm">Overall Consistency</span>
                    <span className="text-indigo-200 text-sm">{stats.consistency}%</span>
                  </div>
                  <div className="w-full bg-indigo-950 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${stats.consistency}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-indigo-300 text-sm">Average Spiritual Depth</span>
                    <span className="text-indigo-200 text-sm">{stats.averageDepth.toFixed(1)}/10</span>
                  </div>
                  <div className="w-full bg-indigo-950 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(stats.averageDepth / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-2 grid grid-cols-2 gap-4">
                  <div className="bg-indigo-800/50 p-3 rounded-lg">
                    <div className="text-indigo-400 text-xs mb-1">Total Time</div>
                    <div className="text-xl font-bold text-indigo-100">{stats.totalMinutes} min</div>
                  </div>
                  <div className="bg-indigo-800/50 p-3 rounded-lg">
                    <div className="text-indigo-400 text-xs mb-1">Longest Session</div>
                    <div className="text-xl font-bold text-indigo-100">{stats.longestSession} min</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sacred Teachings */}
            <div className="bg-indigo-900/50 rounded-lg border border-indigo-600/30 shadow-md overflow-hidden">
              <div className="bg-indigo-800 p-4 border-b border-indigo-700">
                <h3 className="font-bold text-indigo-100 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Sacred Teachings
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-4">
                  <div className="bg-indigo-800/30 p-3 rounded border border-indigo-700/30">
                    <div className="text-indigo-300 font-medium mb-1">The Stillness Practice</div>
                    <p className="text-indigo-200 text-sm">
                      Begin with three deep breaths. On each exhale, release all thoughts. Allow your mind to empty like a vessel being prepared for sacred wine.
                    </p>
                  </div>
                  
                  <div className="bg-indigo-800/30 p-3 rounded border border-indigo-700/30">
                    <div className="text-indigo-300 font-medium mb-1">The Oracle's Contemplation</div>
                    <p className="text-indigo-200 text-sm">
                      Ask yourself one question of great importance. Then silence the questioning mind and allow wisdom to emerge from the depths.
                    </p>
                  </div>
                  
                  <div className="bg-indigo-800/30 p-3 rounded border border-indigo-700/30">
                    <div className="text-indigo-300 font-medium mb-1">The Breath of Apollo</div>
                    <p className="text-indigo-200 text-sm">
                      Breathe in for four counts. Hold for four. Release for six. Feel the divine light entering with each breath, cleansing with each release.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Achievement */}
            <div className="bg-gradient-to-r from-amber-900/50 to-amber-800/50 rounded-lg border border-amber-600/30 shadow-lg p-5">
              <div className="flex items-center gap-4">
                <div className="bg-amber-800/70 p-3 rounded-full">
                  <Award className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-200">Contemplative Explorer</h3>
                  <p className="text-amber-300 text-sm">Complete 7 different types of meditation practices</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-amber-300 mb-1">
                  <span>Progress</span>
                  <span>{Math.min(practices.length, 7)}/7</span>
                </div>
                <div className="w-full bg-amber-950 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${Math.min(practices.length / 7 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerDisplayMetrics;