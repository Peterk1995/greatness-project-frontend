import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, Sword, Scroll, Crown, Star, Clock,
  Calendar, Flag, CheckCircle, Trophy, Sun, Archive, List, XCircle
} from 'lucide-react';
import { taskService } from '../../services/taskService';
import { campaignService } from '../../services/campaignService';
import TaskCompletionModal from '../campaigns/TaskCompletionModal';
import { format } from 'date-fns';

export function TaskList() {
  // State management
  const [tasks, setTasks] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Filtering states
  const [filter, setFilter] = useState('active');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  // Retaining sort state in case needed later, though not rendered now.
  const [sortBy, setSortBy] = useState('date');

  // Fetch tasks and campaigns on mount
  useEffect(() => {
    fetchTasks();
    fetchCampaigns();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await taskService.getAll();
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await campaignService.getAll();
      setCampaigns(response.data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  // Helper: convert minutes since midnight into a formatted time string (e.g., "1:00 PM")
  const formatMinutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // --- Updated calculateTaskProgress ---
  const calculateTaskProgress = useCallback((task) => {
    const now = new Date();
    // Ensure task.date is parsed as a Date object (local midnight)
    const taskDate = task.date instanceof Date ? task.date : new Date(task.date + 'T00:00:00');
  
    // Create date-only objects for comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
  
  
    // Calculate current minutes for today's comparison
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
    // If task is completed, return 100%
    if (task.status === 'completed') {
      return 100;
    }
  
    // For future dates, return 'awaiting'
    if (taskDateOnly.getTime() > nowDate.getTime()) {
      return 'awaiting';
    }
  
    // For past dates that weren't completed, mark as awaiting completion
    if (taskDateOnly.getTime() < nowDate.getTime()) {
      console.log('Task is in past, returning awaiting_completion');
      return 'awaiting_completion';
    }
  
    // For today's tasks
    console.log('Task is today, checking times');
  
    // If task hasn't started yet (no 5-minute buffer now)
    if (currentMinutes < task.start_time) {
      console.log("Task hasn't started yet, returning upcoming");
      return 'upcoming';
    }
  
    // If task is finished but not marked complete (with a 5-minute buffer)
    if (currentMinutes > task.end_time + 5) {
      console.log('Task has ended, returning awaiting_completion');
      return 'awaiting_completion';
    }
  
    // Calculate real-time progress
    const totalDuration = task.end_time - task.start_time;
    const elapsed = currentMinutes - task.start_time;
    const progress = (elapsed / totalDuration) * 100;
  
    console.log('Task in progress:', {
      totalDuration,
      elapsed,
      progress: Math.min(Math.max(progress, 0), 100)
    });
  
    return Math.min(Math.max(progress, 0), 100);
  }, []);
  
  const getTimeUntilTask = (task) => {
    const now = new Date();
    const taskDate = new Date(task.date);
    const taskStart = new Date(taskDate);
    taskStart.setHours(Math.floor(task.start_time / 60), task.start_time % 60, 0, 0);
    
    const diffMs = taskStart - now;
    if (diffMs <= 0) return "Due";
    
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) {
      return `in ${Math.ceil(diffHours)} hour${Math.ceil(diffHours) > 1 ? 's' : ''}`;
    }
    
    const diffDays = diffHours / 24;
    if (diffDays < 7) {
      return `in ${Math.ceil(diffDays)} day${Math.ceil(diffDays) > 1 ? 's' : ''}`;
    }
    
    const diffWeeks = diffDays / 7;
    if (diffWeeks < 4) {
      return `in ${Math.ceil(diffWeeks)} week${Math.ceil(diffWeeks) > 1 ? 's' : ''}`;
    }
    
    const diffMonths = diffDays / 30;
    return `in ${Math.ceil(diffMonths)} month${Math.ceil(diffMonths) > 1 ? 's' : ''}`;
  };

  const getTaskStatusDisplay = (progress) => {
    if (progress === 'awaiting') {
      return {
        text: 'Awaiting Divine Time',
        color: 'text-blue-400',
        icon: <Sun className="w-4 h-4 text-blue-400" />
      };
    }
    if (progress === 'upcoming') {
      return {
        text: 'Preparing for Battle',
        color: 'text-blue-400',
        icon: <Shield className="w-4 h-4 text-blue-400" />
      };
    }
    if (progress === 'awaiting_completion') {
      return {
        text: 'Awaiting Completion',
        color: 'text-blue-400',
        icon: <Clock className="w-4 h-4 text-blue-400" />
      };
    }
    if (progress === 'failed') {
      return {
        text: 'Failed',
        color: 'text-red-500',
        icon: <XCircle className="w-4 h-4 text-red-500" />
      };
    }
    // When the task is in progress, show the real-time progress (and a mid-battle inspirational message)
    return {
      text: `${Math.round(progress)}% Complete`,
      color: 'text-blue-500',
      icon: <Clock className="w-4 h-4 text-blue-500" />
    };
  };

  const getImportanceStyling = (importance) => {
    switch (importance) {
      case 'critical':
        return {
          containerClass: 'bg-gradient-to-r from-blue-900 to-blue-800 border-red-300',
          headerClass: 'text-red-500',
          progressClass: 'from-red-500 to-red-400',
          icon: <Shield className="w-5 h-5 text-red-500" />
        };
      case 'strategic':
        return {
          containerClass: 'bg-gradient-to-r from-blue-900 to-blue-800 border-yellow-300',
          headerClass: 'text-yellow-500',
          progressClass: 'from-yellow-500 to-yellow-400',
          icon: <Sword className="w-5 h-5 text-yellow-500" />
        };
      default:
        return {
          containerClass: 'bg-gradient-to-r from-blue-900 to-blue-800 border-blue-300',
          headerClass: 'text-blue-500',
          progressClass: 'from-blue-500 to-blue-400',
          icon: <Scroll className="w-5 h-5 text-blue-500" />
        };
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'perfect':
        return 'text-yellow-500';
      case 'great':
        return 'text-blue-500';
      case 'good':
        return 'text-green-500';
      case 'poor':
        return 'text-red-500';
      case 'failed':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const calculateTaskPriority = (task) => {
    const now = new Date();
    const taskDate = new Date(task.date);
    const taskStart = new Date(taskDate);
    taskStart.setHours(Math.floor(task.start_time / 60), task.start_time % 60, 0, 0);
  
    const importanceWeight = 0.6;
    const timeWeight = 0.4;
  
    let importanceScore;
    switch (task.importance) {
      case 'critical':
        importanceScore = 3;
        break;
      case 'strategic':
        importanceScore = 2;
        break;
      case 'routine':
        importanceScore = 1;
        break;
      default:
        importanceScore = 0;
    }
  
    const timeUntilStart = taskStart.getTime() - now.getTime();
    const timeScore = timeUntilStart > 0 ? 1 / (timeUntilStart / (1000 * 60 * 60)) : 0;
  
    return importanceWeight * importanceScore + timeWeight * timeScore;
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = tasks.filter(task => {
      if (selectedCampaign !== 'all' && task.campaign?.toString() !== selectedCampaign) {
        return false;
      }
      switch (filter) {
        case 'active':
          return !task.status || task.status === 'active';
        case 'completed':
          return task.status === 'completed' && task.quality_rating !== 'Did not complete';
        case 'failed':
          return task.status === 'completed' && task.quality_rating === 'Did not complete';
        case 'archived':
          return task.status === 'archived';
        default:
          return true;
      }
    });
  
    return filteredTasks.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.start_time - b.start_time;
        case 'campaign':
          return (a.campaign_title || '').localeCompare(b.campaign_title || '');
        case 'quality': {
          const qualityOrder = { 'perfect': 0, 'great': 1, 'good': 2, 'poor': 3, 'failed': 4 };
          return (qualityOrder[a.quality_rating] || 999) - (qualityOrder[b.quality_rating] || 999);
        }
        case 'priority':
          return calculateTaskPriority(a) - calculateTaskPriority(b);
        default:
          return 0;
      }
    });
  };

  // --- NEW: Delete Archived Task ---
  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const getOracleInsight = () => {
    const activeTasks = tasks.filter(task => !task.status || task.status === 'active');
    const upcomingTasks = activeTasks.filter(task => calculateTaskProgress(task) === 'upcoming');
    const awaitingCompletionTasks = activeTasks.filter(task => calculateTaskProgress(task) === 'awaiting_completion');
    const failedTasks = tasks.filter(task => task.status === 'failed');
  
    if (failedTasks.length > 0) {
      return "Reflect on past failures to avoid repeating them. A setback is but a lesson in disguise.";
    }
    if (awaitingCompletionTasks.length > 0) {
      return "Victory is within reach! Ensure these tasks are marked as completed to solidify your gains.";
    }
    if (upcomingTasks.length > 0) {
      return "The future favors the prepared. Focus on your upcoming tasks to secure your position.";
    }
    return "The field is clear for now. Use this time to strategize and plan your next move.";
  };

  const handleTaskCompletion = async (result) => {
    try {
      setShowCompletionModal(false);
      await fetchTasks();
      await fetchCampaigns();
    } catch (error) {
      console.error('Error handling task completion:', error);
      alert('Error updating task status. Please try again.');
    }
  };

  const handleArchiveTask = async (taskId) => {
    try {
      const taskToArchive = tasks.find(task => task.id === taskId);
      if (!taskToArchive) throw new Error('Task not found');
      await taskService.update(taskId, { ...taskToArchive, status: 'archived' });
      await fetchTasks();
    } catch (error) {
      console.error('Error archiving task:', error);
      alert('Failed to archive task. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Clock className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-500 flex items-center justify-center gap-2">
        <XCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }
  
  const filteredAndSortedTasks = getFilteredAndSortedTasks();
  
  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-xl font-bold text-yellow-400">Imperial Phalanx</h1>
            <p className="text-sm text-yellow-200">Command your tasks like a true conqueror</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-yellow-400 font-semibold">Battle Readiness</span>
          <span className="text-xs text-yellow-300">
            {tasks.filter(t => !t.status || t.status === 'active').length} Units Ready
          </span>
        </div>
      </div>
  
      {/* Filters */}
      <div className="bg-white rounded-md shadow p-3 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded ${filter === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600'}`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-3 py-1 rounded ${filter === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-50 text-gray-600'}`}
            >
              Failed
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`px-3 py-1 rounded ${filter === 'archived' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-600'}`}
            >
              Archived
            </button>
          </div>
          {campaigns.length > 0 && (
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Campaigns</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
  
      {/* Task List */}
      <div className="space-y-3">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center text-gray-200 py-6">
            No tasks found.
          </div>
        ) : (
          filteredAndSortedTasks.map(task => {
            const progress = calculateTaskProgress(task);
            const statusDisplay = getTaskStatusDisplay(progress);
            const style = getImportanceStyling(task.importance);
            return (
              <div
                key={task.id}
                className={`p-3 rounded-md border ${style.containerClass} transition hover:shadow-md`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {style.icon}
                    <div>
                      <h3 className={`font-semibold ${style.headerClass} text-sm`}>
                        {task.title}
                      </h3>
                      <p className="text-xs text-gray-200">{task.description}</p>
                    </div>
                  </div>
                  {task.status !== 'completed' && progress === 'awaiting_completion' && (
  <button
    onClick={() => { setSelectedTask(task); setShowCompletionModal(true); }}
    className="text-xs bg-blue-600 text-white px-3 py-1 rounded shadow"
  >
    Complete
  </button>
)}
                  {task.status !== 'completed' && typeof progress === 'number' && progress > 0 && progress < 100 && (
                    <div className="text-xs text-green-600 italic">
                      "Alexander: 'Advance boldly, for victory awaits!'"
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {task.start_day} (
                    {formatMinutesToTime(task.start_time)} - {formatMinutesToTime(task.end_time)}
                    )
                  </span>
                </div>
                {/* Time Until Section */}
                <div className="flex items-center gap-1 text-xs text-gray-300 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>{getTimeUntilTask(task)}</span>
                </div>
                {/* Progress Bar */}
                {typeof progress === 'number' ? (
                  <div className="relative h-2 bg-blue-900 rounded overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${style.progressClass} transition-all duration-700`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                ) : (
                  <div className="h-2 bg-blue-900 rounded overflow-hidden">
                    <div className="h-full bg-blue-800 animate-pulse"></div>
                  </div>
                )}
                <div className="flex justify-between items-center mt-1 text-xs">
                  <div className="flex items-center gap-1">
                    {statusDisplay.icon}
                    <span className={statusDisplay.color}>{statusDisplay.text}</span>
                  </div>
                  {task.campaign && (
                    <div className="flex items-center gap-1">
                      <Flag className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">
                        {campaigns.find(c => c.id === task.campaign)?.title || 'Campaign'}
                      </span>
                    </div>
                  )}
                </div>
                {task.status === 'completed' && (
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <CheckCircle className={`w-4 h-4 ${getQualityColor(task.quality_rating)}`} />
                    <span className={`${getQualityColor(task.quality_rating)}`}>
                      {task.quality_rating}
                      {task.actual_duration && ` (${task.actual_duration} min)`}
                    </span>
                  </div>
                )}
                {task.status !== 'archived' && (
                  <button
                    onClick={() => handleArchiveTask(task.id)}
                    className="text-xs text-gray-400 hover:text-gray-600 mt-1 flex items-center gap-1"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                )}
                {/* Delete button for archived tasks */}
                {task.status === 'archived' && (
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1"
                    title="Delete Task"
                  >
                    <XCircle className="w-4 h-4" />
                    Delete
                  </button>
                )}
                {task.completion_notes && (
                  <div className="text-xs italic text-gray-400 mt-1">
                    "{task.completion_notes}"
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
  
      {/* Oracle's Insight */}
      <div className="mt-4 bg-blue-700/40 p-3 rounded-md border border-blue-500">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 text-blue-300" />
          <h3 className="text-sm font-semibold text-blue-300">Oracle's Insight</h3>
        </div>
        <p className="text-xs text-blue-200 italic">
          {getOracleInsight()}
        </p>
      </div>
  
      {/* Task Completion Modal */}
      {showCompletionModal && (
        <TaskCompletionModal
          task={selectedTask}
          campaigns={campaigns}
          onSubmit={handleTaskCompletion}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </div>
  );
}

export default TaskList;
