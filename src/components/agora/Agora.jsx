import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import agoraService from '../../services/agoraService';
import CreateActionModal from './CreateActionModal';
import { motion, AnimatePresence } from 'framer-motion';

// Import all completion modals
import FastingCompletionModal from './completionMetricsModal/FastingCompletionModal';
import ScriptureCompletionModal from './completionMetricsModal/ScriptureCompletionModal';
import CardioCompletionModal from './completionMetricsModal/CardioCompletionModal';
import StrengthTrainingCompletionModal from './completionMetricsModal/StrengthTrainingCompletionModal';
import ExposureCompletionModal from './completionMetricsModal/ExposureCompletionModal';
import PrayerCompletionModal from './completionMetricsModal/PrayerCompletionModal';
import ReadingCompletionModal from './completionMetricsModal/ReadingCompletionModal';
import NutritionCompletionModal from './completionMetricsModal/NutritionCompletionModal';

// Import Lucide icons
import {
  Scroll, Sword, Trophy, Map, Star, 
  Landmark, Library, Wind, 
  BookOpen, Dumbbell, Droplet, PenTool, 
  Clock, ChevronRight, Plus, X, Eye,
  Sun, Compass, LucideFlame, ThermometerIcon, FireIcon
} from 'lucide-react';

// ===========================================================================
// CONSTANTS AND HELPERS
// ===========================================================================

// Heroic quotes for inspiration
const HEROIC_QUOTES = [
  { quote: "Fortune favors the bold.", author: "Alexander the Great" },
  { quote: "There is nothing impossible to him who will try.", author: "Alexander the Great" },
  { quote: "I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.", author: "Alexander the Great" },
  { quote: "A tomb now suffices him for whom the world was not enough.", author: "Alexander the Great" },
  { quote: "Excellence is an art won by training and habituation.", author: "Aristotle" },
  { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
];

// Get a random quote
const getRandomQuote = () => HEROIC_QUOTES[Math.floor(Math.random() * HEROIC_QUOTES.length)];

// Discipline pathways and their associated gods
const DISCIPLINE_PATHWAYS = {
  training: { 
    name: "Warrior's Path", 
    god: "Ares", 
    icon: Sword,
    color: "from-red-500 to-orange-600",
    darkColor: "from-red-900 to-red-700",
    description: "Forge your body into a weapon of conquest" 
  },
  exposure: { 
    name: "Elemental Mastery", 
    god: "Poseidon", 
    icon: Wind,
    color: "from-cyan-500 to-blue-600",
    darkColor: "from-cyan-900 to-blue-800",
    description: "Command the elements like the god of seas" 
  },
  scripture: { 
    name: "Divine Wisdom", 
    god: "Athena", 
    icon: Scroll,
    color: "from-blue-500 to-indigo-600",
    darkColor: "from-blue-900 to-indigo-800",
    description: "Cultivate the wisdom of the gods themselves" 
  },
  prayer: { 
    name: "Spiritual Ascension", 
    god: "Apollo", 
    icon: Sun,
    color: "from-yellow-500 to-amber-600",
    darkColor: "from-yellow-900 to-amber-800",
    description: "Elevate your spirit to touch the divine" 
  },
  fasting: { 
    name: "Mortal Transcendence", 
    god: "Asclepius", 
    icon: Droplet,
    color: "from-emerald-500 to-green-600",
    darkColor: "from-emerald-900 to-green-800",
    description: "Master the body to free the mind" 
  },
  reading: { 
    name: "Path of Knowledge", 
    god: "Hermes", 
    icon: BookOpen,
    color: "from-purple-500 to-violet-600",
    darkColor: "from-purple-900 to-violet-800",
    description: "Gather wisdom like the messenger of gods" 
  }
};

// Domain colors and patrons
const DOMAIN_PATRONS = {
  conquest: { 
    name: "Alexander",
    title: "The Conqueror", 
    icon: Sword,
    color: "text-red-500",
    darkColor: "text-red-400",
    bgColor: "from-red-500 to-red-600",
    darkBgColor: "from-red-900/40 to-red-800/40",
    borderColor: "border-red-400",
    darkBorderColor: "border-red-700",
  },
  wisdom: { 
    name: "Aristotle",
    title: "The Sage", 
    icon: Scroll,
    color: "text-blue-500",
    darkColor: "text-blue-400",
    bgColor: "from-blue-500 to-blue-600",
    darkBgColor: "from-blue-900/40 to-blue-800/40",
    borderColor: "border-blue-400",
    darkBorderColor: "border-blue-700",
  },
  cultural: { 
    name: "Pericles",
    title: "The Statesman", 
    icon: Landmark,
    color: "text-emerald-500",
    darkColor: "text-emerald-400",
    bgColor: "from-emerald-500 to-emerald-600",
    darkBgColor: "from-emerald-900/40 to-emerald-800/40",
    borderColor: "border-emerald-400",
    darkBorderColor: "border-emerald-700",
  },
  legacy: { 
    name: "Homer",
    title: "The Immortal", 
    icon: Star,
    color: "text-purple-500",
    darkColor: "text-purple-400",
    bgColor: "from-purple-500 to-purple-600",
    darkBgColor: "from-purple-900/40 to-purple-800/40",
    borderColor: "border-purple-400",
    darkBorderColor: "border-purple-700",
  }
};

// Convert discipline to pathway
const getDisciplinePathway = (discipline) => {
  if (!discipline) return DISCIPLINE_PATHWAYS.scripture;
  
  const path = typeof discipline === 'object' ? discipline.path : discipline;
  return DISCIPLINE_PATHWAYS[path] || DISCIPLINE_PATHWAYS.scripture;
};

// Get time of day greeting
const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Χαίρετε! Good morning";
  if (hour < 18) return "Χαίρετε! Good afternoon";
  return "Χαίρετε! Good evening";
};

// ===========================================================================
// COMPONENT: ORACLE'S WISDOM
// ===========================================================================

const OracleWisdom = ({ completedActions, totalActions, isDarkMode }) => {
  // Calculate actual completion percentage based on completed actions
  const completedCount = completedActions.length;
  const totalCount = totalActions || 0;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Get a quote to display
  const quote = getRandomQuote();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl overflow-hidden shadow-xl mb-8 border
                 ${isDarkMode 
                   ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-700' 
                   : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-full mr-4 
                          ${isDarkMode 
                            ? 'bg-indigo-900/60 text-indigo-300' 
                            : 'bg-indigo-100 text-indigo-600'}`}>
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                Oracle's Wisdom
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Divine guidance for your journey
              </p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className={`px-3 py-1 rounded-full text-sm
                        ${isDarkMode 
                          ? 'bg-indigo-900/50 text-indigo-300' 
                          : 'bg-indigo-100 text-indigo-700'}`}>
            {completedCount} of {totalCount} quests completed
          </div>
        </div>
        
        <blockquote className={`italic my-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          "{quote.quote}"
        </blockquote>
        <div className="text-right text-sm mb-4">
          <cite className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
            — {quote.author}
          </cite>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Quest Completion</span>
            <span className={isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}>
              {completionPercentage}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className={`h-full rounded-full ${isDarkMode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================================================
// COMPONENT: STATS DASHBOARD
// ===========================================================================

const StatsDashboard = ({ completedActions, pendingActions, isDarkMode }) => {
  // Calculate some stats
  const todayCompleted = completedActions.filter(action => {
    const completedDate = new Date(action.completed_at);
    const today = new Date();
    return completedDate.toDateString() === today.toDateString();
  }).length;
  
  // Count actions by domain
  const actionsByDomain = completedActions.reduce((acc, action) => {
    const domain = action.domain || 'wisdom';
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {});
  
  // Find domain with most completed actions
  let strongestDomain = "wisdom";
  let highestCount = 0;
  
  Object.entries(actionsByDomain).forEach(([domain, count]) => {
    if (count > highestCount) {
      highestCount = count;
      strongestDomain = domain;
    }
  });
  
  const patron = DOMAIN_PATRONS[strongestDomain];
  const PatronIcon = patron.icon;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`rounded-xl overflow-hidden shadow-xl mb-8 border
                 ${isDarkMode 
                   ? 'bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border-amber-700' 
                   : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'}`}
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className={`p-3 rounded-full mr-4 
                         ${isDarkMode 
                           ? 'bg-amber-900/60 text-amber-300' 
                           : 'bg-amber-100 text-amber-600'}`}>
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
              Heroic Metrics
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              The measure of your greatness
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-sm text-gray-500 mb-1">Completed Today</div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
              {todayCompleted}
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-sm text-gray-500 mb-1">Quests Completed</div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
              {completedActions.length}
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-sm text-gray-500 mb-1">Quests Pending</div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
              {pendingActions.length}
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-gray-500 mb-1">Your Divine Patron</div>
              <div className={`text-lg font-bold ${isDarkMode ? patron.darkColor : patron.color}`}>
                {patron.name}, {patron.title}
              </div>
            </div>
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <PatronIcon className={`w-6 h-6 ${isDarkMode ? patron.darkColor : patron.color}`} />
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Domain strength based on your completed quests
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================================================
// COMPONENT: PATHWAY CARD
// ===========================================================================

const PathwayCard = ({ discipline, onClick, isDarkMode }) => {
  const pathway = getDisciplinePathway(discipline);
  const PathwayIcon = pathway.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`rounded-xl overflow-hidden shadow-lg cursor-pointer border
                ${isDarkMode 
                  ? `bg-gradient-to-br ${pathway.darkColor} border-gray-700` 
                  : `bg-gradient-to-br ${pathway.color} border-gray-200`}`}
    >
      <div className="p-5 text-white">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">
            {discipline.name}
          </h3>
          <div className="p-2 rounded-full bg-white/10">
            <PathwayIcon className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <span className="text-sm text-white/80">
            Under the patronage of
          </span>
          <span className="ml-1 font-semibold text-white">
            {pathway.god}
          </span>
        </div>
        
        <p className="text-white/90 text-sm mb-4">
          {pathway.description}
        </p>
        
        <div className="mt-auto text-xs text-white/80 flex items-center justify-end">
          <span>View Metrics</span>
          <ChevronRight className="w-3 h-3 ml-1" />
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================================================
// COMPONENT: QUEST CARD
// ===========================================================================

const QuestCard = ({ action, onComplete, isDarkMode, completed = false }) => {
  const discipline = action.discipline_details || action.discipline;
  const pathway = getDisciplinePathway(discipline);
  const domain = action.domain || 'wisdom';
  const patron = DOMAIN_PATRONS[domain] || DOMAIN_PATRONS.wisdom;
  const PathwayIcon = pathway.icon;
  const PatronIcon = patron.icon;
  
  // Format completion date
  const formattedDate = action.completed_at
    ? new Date(action.completed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;
  
  // Calculate hours until open
  let hoursUntilOpen = 0;
  let canCompleteNow = true;
  if (!completed && action.completion_window_start) {
    const now = new Date();
    const start = new Date(action.completion_window_start);
    const diffMs = start - now;
    hoursUntilOpen = diffMs / 3600000;
    canCompleteNow = process.env.NODE_ENV === 'development' ? true : hoursUntilOpen <= 0;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`rounded-xl overflow-hidden shadow-lg border relative
                ${isDarkMode 
                  ? `bg-gradient-to-br ${patron.darkBgColor} ${patron.darkBorderColor}` 
                  : `bg-white border-gray-200`}`}
    >
      {/* Decorative greek key pattern top border */}
      <div className={`h-1 w-full ${isDarkMode 
        ? `bg-gradient-to-r ${pathway.darkColor}` 
        : `bg-gradient-to-r ${pathway.color}`}`} 
      />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`text-xl font-semibold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {action.title}
            </h3>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {discipline && typeof discipline === 'object' ? discipline.name : 'Divine Challenge'}
            </p>
          </div>
          <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <PathwayIcon className={`w-6 h-6 ${isDarkMode ? pathway.darkColor : pathway.color}`} />
          </div>
        </div>
        
        {!completed && (
          <div className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="font-medium">Target:</span> {action.target_value} {action.discipline_details?.metric_unit || 'units'}
          </div>
        )}
        
        {/* Completion info or countdown */}
        {completed ? (
          <div className="flex justify-between items-center mb-4">
            <div className={`flex items-center ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              <Trophy className="w-4 h-4 mr-1.5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            {formattedDate && (
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formattedDate}
              </span>
            )}
          </div>
        ) : (
          !canCompleteNow && (
            <div className={`flex items-center text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'} mb-4`}>
              <Clock className="w-4 h-4 mr-1.5" />
              <span>Opens in {hoursUntilOpen.toFixed(1)} hours</span>
            </div>
          )
        )}
        
        {/* XP reward if completed */}
        {completed && action.final_xp && (
          <div className={`mb-4 text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
            <span className="font-medium">+{action.final_xp} XP</span> rewarded
          </div>
        )}
        
        {/* Domain and patron section */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className={`p-1.5 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <PatronIcon className={`w-4 h-4 ${isDarkMode ? patron.darkColor : patron.color}`} />
            </div>
            <div className="ml-2">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Patron
              </span>
              <p className={`text-xs font-medium ${isDarkMode ? patron.darkColor : patron.color}`}>
                {patron.name}
              </p>
            </div>
          </div>
          
          {completed ? (
            <button
              onClick={() => onComplete(action)}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 
                        ${isDarkMode 
                          ? `bg-gray-800 hover:bg-gray-700 ${patron.darkColor}` 
                          : `bg-gray-100 hover:bg-gray-200 ${patron.color}`}`}
            >
              <Eye className="w-4 h-4" />
              Details
            </button>
          ) : (
            <button
              onClick={() => onComplete(action)}
              disabled={!canCompleteNow}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors
                ${canCompleteNow
                  ? isDarkMode
                    ? `bg-gradient-to-r ${pathway.darkColor} text-white hover:opacity-90`
                    : `bg-gradient-to-r ${pathway.color} text-white hover:opacity-90`
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              <Trophy className="w-4 h-4" />
              Complete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================================================
// COMPONENT: QUICK STATS
// ===========================================================================

const QuickStats = ({ completedActions, isDarkMode }) => {
  // Count by discipline path
  const countByPath = completedActions.reduce((acc, action) => {
    const discipline = action.discipline_details || action.discipline;
    if (discipline && discipline.path) {
      acc[discipline.path] = (acc[discipline.path] || 0) + 1;
    }
    return acc;
  }, {});
  
  // Get path with most completions
  let topPath = 'scripture';
  let topCount = 0;
  
  Object.entries(countByPath).forEach(([path, count]) => {
    if (count > topCount) {
      topCount = count;
      topPath = path;
    }
  });
  
  // Get pathway info
  const pathway = DISCIPLINE_PATHWAYS[topPath];
  const PathwayIcon = pathway?.icon || Scroll;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`rounded-xl overflow-hidden shadow-xl mb-8 border
                 ${isDarkMode 
                   ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700' 
                   : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Your Disciplines at a Glance
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Areas where you've shown excellence
            </p>
          </div>
          <div className={`p-3 rounded-full 
                         ${isDarkMode 
                           ? 'bg-gray-700 text-gray-300' 
                           : 'bg-gray-100 text-gray-600'}`}>
            <ThermometerIcon className="w-6 h-6" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Strongest Pathway */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-full 
                             ${isDarkMode 
                               ? `bg-gray-700 ${pathway?.darkColor || 'text-blue-400'}` 
                               : `bg-gray-100 ${pathway?.color.split(' ')[0] || 'text-blue-500'}`}`}>
                <PathwayIcon className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {pathway?.name || 'Divine Wisdom'}
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {topCount}
            </div>
            <div className="text-xs text-gray-500">
              Completed quests in your strongest discipline
            </div>
          </div>
          
          {/* Discipline Diversity */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-full 
                             ${isDarkMode 
                               ? 'bg-gray-700 text-amber-400' 
                               : 'bg-gray-100 text-amber-500'}`}>
                <LucideFlame className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Discipline Breadth
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {Object.keys(countByPath).length}
            </div>
            <div className="text-xs text-gray-500">
              Different disciplines practiced
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================================================
// COMPONENT: NO CONTENT PLACEHOLDER
// ===========================================================================

const NoContentPlaceholder = ({ type, actionText, onAction, isDarkMode }) => {
  let icon, title, description;
  
  switch (type) {
    case 'quests':
      icon = <Sword className="w-12 h-12" />;
      title = "No Active Quests";
      description = "Begin your heroic journey by proclaiming a new deed.";
      break;
    case 'completed':
      icon = <Trophy className="w-12 h-12" />;
      title = "No Conquests Yet";
      description = "Complete your first quest to build your legacy.";
      break;
    default:
      icon = <Compass className="w-12 h-12" />;
      title = "Your Journey Awaits";
      description = "Take the first step toward greatness.";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-16 border rounded-xl
                 ${isDarkMode 
                   ? 'border-gray-700 bg-gray-800/30' 
                   : 'border-gray-200 bg-white/50'}`}
    >
      <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
                     ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
          {icon}
        </div>
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        {title}
      </h3>
      <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className={`px-6 py-3 rounded-lg inline-flex items-center gap-2
                    ${isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <Plus className="w-5 h-5" />
          {actionText}
        </button>
      )}
    </motion.div>
  );
};

// ===========================================================================
// COMPONENT: DETAILED VIEW MODAL
// ===========================================================================

const DetailedQuestModal = ({ action, onClose, isDarkMode }) => {
  if (!action) return null;
  
  const discipline = action.discipline_details || action.discipline;
  const pathway = getDisciplinePathway(discipline);
  const domain = action.domain || 'wisdom';
  const patron = DOMAIN_PATRONS[domain] || DOMAIN_PATRONS.wisdom;
  
  // Format completion date
  const formattedDate = action.completed_at
    ? new Date(action.completed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown date';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`max-w-2xl w-full rounded-xl overflow-hidden shadow-2xl
                  ${isDarkMode 
                    ? 'bg-gray-900 text-gray-100 border border-gray-700' 
                    : 'bg-white text-gray-800 border border-gray-200'}`}
      >
        {/* Hero Banner Header */}
        <div className={`p-6 relative overflow-hidden ${isDarkMode 
          ? `bg-gradient-to-r ${patron.darkBgColor}` 
          : `bg-gradient-to-r ${patron.bgColor} bg-opacity-20`}`}
        >
          {/* Background Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4">
              <patron.icon className={`w-48 h-48 ${isDarkMode ? 'text-white' : 'text-black'}`} />
            </div>
          </div>
          
          <div className="relative z-10 flex justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${isDarkMode 
                ? 'bg-black/20 text-white' 
                : 'bg-white/20 text-black'}`}>
                <patron.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Quest Details
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Under the watchful eye of {patron.name}, {patron.title}
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className={`rounded-full p-2 ${isDarkMode 
                ? 'bg-black/20 text-white hover:bg-black/30' 
                : 'bg-white/20 text-black hover:bg-white/30'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {action.title}
              </h3>
              <div className="flex items-center mt-1">
                <pathway.icon className={`w-4 h-4 mr-2 ${isDarkMode ? pathway.darkColor : pathway.color}`} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {discipline && typeof discipline === 'object' ? discipline.name : 'Divine Challenge'}
                </p>
              </div>
            </div>
            
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Domain
                </h4>
                <p className={`flex items-center ${isDarkMode ? patron.darkColor : patron.color}`}>
                  <patron.icon className="w-4 h-4 mr-1.5" />
                  <span className="capitalize">{domain}</span>
                </p>
              </div>
              
              <div>
                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Difficulty
                </h4>
                <p className="capitalize">{action.difficulty || 'Mortal'}</p>
              </div>
              
              <div>
                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Completed At
                </h4>
                <p>{formattedDate}</p>
              </div>
              
              <div>
                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  XP Reward
                </h4>
                <p className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'} font-medium`}>
                  +{action.final_xp || 0} XP ({action.base_xp || 0} base)
                </p>
              </div>
            </div>
            
            {/* Reflection */}
            {action.reflection && (
              <div>
                <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Hero's Reflection
                </h4>
                <blockquote className={`italic p-4 rounded-lg whitespace-pre-wrap
                                       ${isDarkMode 
                                        ? 'bg-gray-800 border-l-4 border-gray-600' 
                                        : 'bg-gray-100 border-l-4 border-gray-300'}`}>
                  {action.reflection}
                </blockquote>
              </div>
            )}
            
            {/* Metrics Details */}
            {action.metrics && Object.keys(action.metrics).length > 0 && (
              <div>
                <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Battle Metrics
                </h4>
                <div className={`overflow-auto rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(action.metrics).map(([key, value]) => {
                        // Skip complex objects in this view
                        if (typeof value === 'object' && value !== null) return null;
                        
                        // Format key for display
                        const formattedKey = key
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, l => l.toUpperCase());
                        
                        return (
                          <tr key={key}>
                            <td className={`py-1 pr-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                              {formattedKey}
                            </td>
                            <td>{String(value)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg transition-colors ${isDarkMode 
                ? `bg-gradient-to-r ${pathway.darkColor} text-white hover:opacity-90` 
                : `bg-gradient-to-r ${pathway.color} text-white hover:opacity-90`}`}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===========================================================================
// COMPONENT: PROCLAIM DEED FLOATING BUTTON
// ===========================================================================

const FloatingActionButton = ({ onClick, isDarkMode }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg flex items-center justify-center
                ${isDarkMode 
                  ? 'bg-gradient-to-br from-purple-800 to-red-800 text-white' 
                  : 'bg-gradient-to-br from-amber-400 to-bronze-500 text-white'}`}
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
};

// ===========================================================================
// MAIN COMPONENT: AGORA
// ===========================================================================

const Agora = () => {
  const { user } = useAuth();
  const { isDarkMode } = React.useContext(ThemeContext);
  const navigate = useNavigate();
  const heroSectionRef = useRef(null);

  // State for data
  const [disciplines, setDisciplines] = useState([]);
  const [stats, setStats] = useState({ completed_today: 0, total_actions: 0 });
  const [pendingActions, setPendingActions] = useState([]);
  const [completedActions, setCompletedActions] = useState([]);
  
  // Modal and UI states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [pageScrolled, setPageScrolled] = useState(false);
  
  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const scrollPosition = window.scrollY;
        const heroHeight = heroSectionRef.current.offsetHeight;
        setPageScrolled(scrollPosition > heroHeight);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [disciplinesData, statsData, inProgressData, doneData] = await Promise.all([
          agoraService.disciplines.getAll(),
          agoraService.actions.getStats(),
          agoraService.actions.getAll({ is_completed: false }),
          agoraService.actions.getAll({ is_completed: true })
        ]);
        
        // Filter out data issues (the 249 problem)
        const filteredStats = {
          ...statsData,
          // Only count reasonable number of actions
          total_actions: statsData.total_actions > 100 ? inProgressData.length + doneData.length : statsData.total_actions
        };
        
        setDisciplines(disciplinesData);
        setStats(filteredStats);
        setPendingActions(inProgressData);
        setCompletedActions(doneData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handler for quest completion
  const handleCompleteQuest = (action) => {
    setSelectedAction(action);
    if (!action.is_completed) {
      setShowCompletionModal(true);
    } else {
      setShowDetailModal(true);
    }
  };

  // Function to complete a quest on the backend
  const completeQuest = async (actionId, completionData) => {
    try {
      await agoraService.actions.completeAction(actionId, completionData);
      
      // Refresh data
      const [updatedStats, newPending, newCompleted] = await Promise.all([
        agoraService.actions.getStats(),
        agoraService.actions.getAll({ is_completed: false }),
        agoraService.actions.getAll({ is_completed: true })
      ]);
      
      // Filter stats to avoid the 249 issue
      const filteredStats = {
        ...updatedStats,
        total_actions: updatedStats.total_actions > 100 ? newPending.length + newCompleted.length : updatedStats.total_actions
      };
      
      setStats(filteredStats);
      setPendingActions(newPending);
      setCompletedActions(newCompleted);
      
      // Close modals and reset selection
      setShowCompletionModal(false);
      setSelectedAction(null);
    } catch (error) {
      console.error('Error completing quest:', error);
      throw error;
    }
  };

  // Function to render the appropriate completion modal based on discipline
  const renderCompletionModal = () => {
    if (!selectedAction) return null;
    
    // Get discipline info
    const discipline = 
      typeof selectedAction.discipline === 'object'
        ? selectedAction.discipline
        : selectedAction.discipline_details;
    
    if (!discipline) return null;
    
    // Determine which modal to show based on discipline path
    switch (discipline.path) {
      case 'scripture':
        return (
          <ScriptureCompletionModal
            action={selectedAction}
            onClose={() => { setShowCompletionModal(false); setSelectedAction(null); }}
            onComplete={completeQuest}
          />
        );
      case 'training':
        if (discipline.name && discipline.name.toLowerCase().includes('cardio')) {
          return (
            <CardioCompletionModal
              action={selectedAction}
              onClose={() => { setShowCompletionModal(false); setSelectedAction(null); }}
              onComplete={completeQuest}
            />
          );
        } else {
          return (
            <StrengthTrainingCompletionModal
              action={selectedAction}
              onClose={() => { setShowCompletionModal(false); setSelectedAction(null); }}
              onComplete={completeQuest}
            />
          );
        }
      case 'exposure':
        return (
          <ExposureCompletionModal
            action={selectedAction}
            onClose={() => { setShowCompletionModal(false); setSelectedAction(null); }}
            onComplete={completeQuest}
          />
        );
      case 'prayer':
        return (
          <PrayerCompletionModal
            action={selectedAction}
            onClose={() => { setShowCompletionModal(false); setSelectedAction(null); }}
            onComplete={completeQuest}
          />
        );
      case 'reading':
        return (
          <ReadingCompletionModal
            action={selectedAction}
            onClose={() => { setShowCompletionModal(false); setSelectedAction(null); }}
            onComplete={completeQuest}
          />
        );
      case 'fasting':
        // For fasting, check if this is Nutrition Tracking
        if (discipline.name && discipline.name.toLowerCase().includes('nutrition')) {
          return (
            <NutritionCompletionModal
              action={selectedAction}
              onClose={() => { setShowCompletionModal(false); setSelectedAction(null); }}
              onComplete={completeQuest}
            />
          );
        } else {
          return (
            <FastingCompletionModal
              action={selectedAction}
              onClose={() => { setShowCompletionModal(false); setSelectedAction(null); }}
              onComplete={completeQuest}
            />
          );
        }
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
                          ${isDarkMode ? 'bg-gray-800' : 'bg-amber-100'}`}>
            <div className="relative">
              <Sun className={`w-16 h-16 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'} animate-spin-slow`} />
              <Star className={`w-6 h-6 absolute top-0 right-0 ${isDarkMode ? 'text-gold-DEFAULT' : 'text-gold-dark'}`} />
            </div>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
            The Oracle of Delphi
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Divining your destiny...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-amber-50 text-gray-800'}`}>
      {/* Decorative header pattern */}
      <div className={`w-full h-3 ${isDarkMode ? 'bg-purple-800' : 'bg-amber-300'}`}>
        <div className={`h-full bg-repeat-x bg-[length:auto_100%] 
                       ${isDarkMode 
                         ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDMwIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTAgMEgxMFY4SDBWMFoiIGZpbGw9IiM4QjVDRjYiLz4KICA8cGF0aCBkPSJNMTAgMEgyMFY4SDEwVjBaIiBmaWxsPSIjRDg4QkZGIi8+CiAgPHBhdGggZD0iTTIwIDBIMzBWOEgyMFYwWiIgZmlsbD0iIzhCNUNGNiIvPgo8L3N2Zz4=')]"
                         : "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDMwIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTAgMEgxMFY4SDBWMFoiIGZpbGw9IiNDRDdGMzIiLz4KICA8cGF0aCBkPSJNMTAgMEgyMFY4SDEwVjBaIiBmaWxsPSIjRkZENzAwIi8+CiAgPHBhdGggZD0iTTIwIDBIMzBWOEgyMFYwWiIgZmlsbD0iI0NEN0YzMiIvPgo8L3N2Zz4=')]"
                       }`}
        />
      </div>

      {/* Hero Header Section */}
      <header ref={heroSectionRef} className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 ${isDarkMode 
            ? 'bg-gradient-to-b from-purple-900/30 to-transparent' 
            : 'bg-gradient-to-b from-amber-200/30 to-transparent'}`} 
          />
          
          {/* Decorative elements */}
          {isDarkMode ? (
            <>
              <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-purple-500/5 backdrop-blur-3xl" />
              <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-red-500/5 backdrop-blur-3xl" />
              <Star className="absolute top-12 right-1/4 w-6 h-6 text-gold-DEFAULT/20" />
              <Star className="absolute bottom-8 left-1/3 w-4 h-4 text-gold-DEFAULT/20" />
            </>
          ) : (
            <>
              <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-amber-500/5 backdrop-blur-3xl" />
              <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-bronze-500/5 backdrop-blur-3xl" />
            </>
          )}
        </div>
      
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-8">
            {/* Decorative top border */}
            <div className="inline-block mb-4">
              <div className={`w-40 h-1 mx-auto ${isDarkMode 
                ? 'bg-gradient-to-r from-transparent via-gold-DEFAULT to-transparent' 
                : 'bg-gradient-to-r from-transparent via-bronze-500 to-transparent'}`} 
              />
            </div>
            
            <h1 className={`text-5xl font-bold mb-4 tracking-wider
                          ${isDarkMode ? 'text-gold-DEFAULT' : 'text-bronze-600'}`}>
              ΑΓΟΡΑ ΑΛΕΞΑΝΔΡΟΥ
            </h1>
            
            <div className={`flex items-center justify-center mb-3 text-xl
                          ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="h-px w-8 bg-gray-400 mx-3" />
              <p>{getTimeOfDayGreeting()}</p>
              <div className="h-px w-8 bg-gray-400 mx-3" />
            </div>
            
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Hail,{' '}
              <span className={`font-medium ${isDarkMode ? 'text-gold-light' : 'text-bronze-500'}`}>
                {user?.username || 'Hero'}
              </span>
              ! What greatness shall you achieve today?
            </p>
          </div>
        </div>
      </header>
      
      {/* Tab Navigation - Sticky on scroll */}
      <div className={`sticky top-0 z-30 transition-all duration-300 ${pageScrolled ? 'shadow-lg' : ''}`}>
        <div className={`${isDarkMode 
          ? pageScrolled 
            ? 'bg-gray-900 border-b border-gray-800' 
            : 'bg-gradient-to-b from-gray-900 to-transparent' 
          : pageScrolled 
            ? 'bg-amber-50 border-b border-amber-100' 
            : 'bg-gradient-to-b from-amber-50 to-transparent'}`}>
          <div className="container mx-auto px-4">
            <nav className="flex overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors
                          ${activeTab === "overview"
                            ? isDarkMode
                              ? 'border-b-2 border-gold-DEFAULT text-gold-DEFAULT'
                              : 'border-b-2 border-bronze-500 text-bronze-600'
                            : isDarkMode
                              ? 'text-gray-400 hover:text-gray-300'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Overview</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("pathways")}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors
                          ${activeTab === "pathways"
                            ? isDarkMode
                              ? 'border-b-2 border-gold-DEFAULT text-gold-DEFAULT'
                              : 'border-b-2 border-bronze-500 text-bronze-600'
                            : isDarkMode
                              ? 'text-gray-400 hover:text-gray-300'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
              >
                <div className="flex items-center space-x-2">
                  <Compass className="w-5 h-5" />
                  <span>Divine Pathways</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("quests")}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors
                          ${activeTab === "quests"
                            ? isDarkMode
                              ? 'border-b-2 border-gold-DEFAULT text-gold-DEFAULT'
                              : 'border-b-2 border-bronze-500 text-bronze-600'
                            : isDarkMode
                              ? 'text-gray-400 hover:text-gray-300'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
              >
                <div className="flex items-center space-x-2">
                  <Sword className="w-5 h-5" />
                  <span>Active Quests</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors
                          ${activeTab === "completed"
                            ? isDarkMode
                              ? 'border-b-2 border-gold-DEFAULT text-gold-DEFAULT'
                              : 'border-b-2 border-bronze-500 text-bronze-600'
                            : isDarkMode
                              ? 'text-gray-400 hover:text-gray-300'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
              >
                <div className="flex items-center space-x-2">
                  <Map className="w-5 h-5" />
                  <span>Completed</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-16">
        {/* Overview Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <OracleWisdom 
                    completedActions={completedActions}
                    totalActions={pendingActions.length + completedActions.length}
                    isDarkMode={isDarkMode} 
                  />
                  <StatsDashboard 
                    completedActions={completedActions}
                    pendingActions={pendingActions}
                    isDarkMode={isDarkMode}
                  />
                </div>
                
                {/* Right Column */}
                <div>
                  <QuickStats 
                    completedActions={completedActions}
                    isDarkMode={isDarkMode}
                  />
                  
                  {/* Recent Actions */}
                  <div className="mb-8">
                    <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      Recent Glory
                    </h2>
                    
                    {completedActions.length === 0 ? (
                      <div className={`p-6 rounded-lg text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Complete your first quest to see your achievements here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {completedActions.slice(0, 3).map((action) => (
                          <div 
                            key={action.id}
                            onClick={() => handleCompleteQuest(action)}
                            className={`p-4 rounded-lg cursor-pointer border transition-colors
                                      ${isDarkMode 
                                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                                        : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                          >
                            <div className="flex justify-between">
                              <div>
                                <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {action.title}
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {new Date(action.completed_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                +{action.final_xp || 0} XP
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {completedActions.length > 3 && (
                          <button
                            onClick={() => setActiveTab("completed")}
                            className={`w-full py-2 text-center rounded-lg
                                      ${isDarkMode 
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                                        : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                          >
                            View all {completedActions.length} completed quests
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Pathways Tab Content */}
          {activeTab === "pathways" && (
            <motion.div
              key="pathways"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6">
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Choose Your Divine Pathway
                </h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                  Each pathway offers unique challenges and rewards. Select a discipline to begin your journey or view your progress.
                </p>
                
                {disciplines.length === 0 ? (
                  <NoContentPlaceholder 
                    type="disciplines" 
                    isDarkMode={isDarkMode} 
                    actionText="Proclaim New Deed"
                    onAction={() => setShowCreateModal(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {disciplines.map((discipline) => (
                      <PathwayCard
                        key={discipline.id}
                        discipline={discipline}
                        isDarkMode={isDarkMode}
                        onClick={() => {
                          // Navigate to metrics page or create new action
                          if (discipline.name === 'Cold Forge Training') {
                            navigate('/metrics/cold-forge');
                          } 
                          else if (discipline.name === 'Nutrition Tracking') {
                            navigate('/metrics/warriors-nutrition');
                          }      
                          else if (discipline.name === 'Scripture Study') {
                            navigate('/metrics/virtuous-reading');
                          }   
                          else if (discipline.name === 'Strength Training') {
                            navigate('/metrics/metrics-of-strength');
                          } 
                          else if (discipline.name === 'Cardio Mastery') {
                            navigate('/metrics/heart-of-cardio');
                          } 
                          else if (discipline.name === 'Prayer & Meditation') {
                            navigate('/metrics/prayer-wisdom');
                          }
                          else if (discipline.name === 'Fasting Protocol') {
                            navigate('/metrics/fasting-protocol-metrics');
                          }
                          else {
                            setShowCreateModal(true);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Quests Tab Content */}
          {activeTab === "quests" && (
            <motion.div
              key="quests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6">
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Active Heroic Quests
                </h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                  These are your current challenges awaiting completion. Conquer them to build your legend.
                </p>
                
                {pendingActions.length === 0 ? (
                  <NoContentPlaceholder 
                    type="quests" 
                    isDarkMode={isDarkMode} 
                    actionText="Proclaim New Deed"
                    onAction={() => setShowCreateModal(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingActions.map((action) => (
                      <QuestCard
                        key={action.id}
                        action={action}
                        onComplete={handleCompleteQuest}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Completed Tab Content */}
          {activeTab === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6">
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Your Legendary Accomplishments
                </h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                  These are the tales of your triumph, the foundation of your growing legend.
                </p>
                
                {completedActions.length === 0 ? (
                  <NoContentPlaceholder 
                    type="completed" 
                    isDarkMode={isDarkMode} 
                    actionText="Proclaim New Deed"
                    onAction={() => setShowCreateModal(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedActions.map((action) => (
                      <QuestCard
                        key={action.id}
                        action={action}
                        completed={true}
                        onComplete={handleCompleteQuest}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={() => setShowCreateModal(true)} 
        isDarkMode={isDarkMode} 
      />
      
      {/* Modals */}
      {showCreateModal && (
        <CreateActionModal
          onClose={() => setShowCreateModal(false)}
          onSave={async () => {
            setShowCreateModal(false);
            try {
              // Refresh data
              const [newStats, newPending, newCompleted] = await Promise.all([
                agoraService.actions.getStats(),
                agoraService.actions.getAll({ is_completed: false }),
                agoraService.actions.getAll({ is_completed: true })
              ]);
              
              // Filter stats to avoid the 249 issue
              const filteredStats = {
                ...newStats,
                total_actions: newStats.total_actions > 100 ? newPending.length + newCompleted.length : newStats.total_actions
              };
              
              setStats(filteredStats);
              setPendingActions(newPending);
              setCompletedActions(newCompleted);
            } catch (error) {
              console.error('Error updating after creation:', error);
            }
          }}
        />
      )}
      
      {/* Completion Modal */}
      {showCompletionModal && selectedAction && renderCompletionModal()}
      
      {/* Details Modal */}
      {showDetailModal && selectedAction && (
        <DetailedQuestModal
          action={selectedAction}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAction(null);
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default Agora;