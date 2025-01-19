import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { campaignService } from '../../services/campaignService';
import { 
  Clock, Award, CheckCircle, AlertCircle, 
  Filter, Archive, List, XCircle, Trophy,
  Calendar, Flag 
} from 'lucide-react';
import TaskCompletionModal from '../campaigns/TaskCompletionModal';

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Filtering states
  const [filter, setFilter] = useState('active');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [sortBy, setSortBy] = useState('date');

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

  const calculateProgress = (task) => {
    if (task.status === 'completed') return 100;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const progress = ((currentMinutes - task.start_time) / (task.end_time - task.start_time)) * 100;
    
    if (progress < 0) return 0;
    if (progress > 100) return 100;
    return progress;
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
        case 'quality':
          const qualityOrder = {
            'perfect': 0,
            'great': 1,
            'good': 2,
            'poor': 3,
            'failed': 4
          };
          return (qualityOrder[a.quality_rating] || 999) - (qualityOrder[b.quality_rating] || 999);
        default:
          return 0;
      }
    });
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
      if (!taskToArchive) {
        throw new Error('Task not found');
      }

      await taskService.update(taskId, {
        ...taskToArchive,
        status: 'archived',
      });
      
      await fetchTasks();
    } catch (error) {
      console.error('Error archiving task:', error);
      alert('Failed to archive task. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Clock className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 flex items-center justify-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  const filteredAndSortedTasks = getFilteredAndSortedTasks();

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <List className="w-6 h-6 text-blue-500" />
              Battle Tasks
            </h2>
            <span className="text-sm text-gray-500">
              {filteredAndSortedTasks.length} tasks
            </span>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  filter === 'active'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  filter === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Completed
              </button>
              <button
                onClick={() => setFilter('failed')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  filter === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <XCircle className="w-4 h-4" />
                Failed
              </button>
              <button
                onClick={() => setFilter('archived')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  filter === 'archived'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Archive className="w-4 h-4" />
                Archived
              </button>
            </div>

            {/* Campaign Filter */}
            {campaigns.length > 0 && (
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Campaigns</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="campaign">Sort by Campaign</option>
              <option value="quality">Sort by Quality</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No tasks found for the selected filters
          </div>
        ) : (
          filteredAndSortedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                {/* Task Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  </div>
                  
                  {task.status !== 'completed' && calculateProgress(task) >= 100 && (
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowCompletionModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Trophy className="w-5 h-5" />
                      Complete Task
                    </button>
                  )}
                </div>

                {/* Task Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {task.start_day} ({task.start_time}:00 - {task.end_time}:00)
                    </span>
                  </div>

                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full transition-all ${
                        task.status === 'completed'
                          ? task.quality_rating === 'Did not complete'
                            ? 'bg-red-500'
                            : 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${calculateProgress(task)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {task.status === 'completed' ? (
                        <>
                          <CheckCircle className={`w-4 h-4 ${getQualityColor(task.quality_rating)}`} />
                          <span className={`text-sm ${getQualityColor(task.quality_rating)}`}>
                            {task.quality_rating} 
                            {task.actual_duration && ` (${task.actual_duration} minutes)`}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">
                          {calculateProgress(task).toFixed(0)}% Complete
                        </span>
                      )}
                    </div>

                    {task.campaign && (
                      <div className="flex items-center gap-2">
                        <Flag className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-purple-600">
                          {campaigns.find(c => c.id === task.campaign)?.title || 'Campaign'}
                        </span>
                      </div>
                    )}
                  </div>

                  {task.completion_notes && (
                    <div className="mt-2 text-sm text-gray-600 italic">
                      "{task.completion_notes}"
                    </div>
                  )}

                  {task.status !== 'archived' && (
                    <button
                      onClick={() => handleArchiveTask(task.id)}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <Archive className="w-4 h-4" />
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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