// EventDetails.jsx
import React from 'react';
import { X, Shield, Sword, Scroll, Clock, Calendar, RotateCcw } from 'lucide-react';

export const EventDetails = ({ event, onClose, onEdit, onDelete }) => {
  const importanceIcons = {
    critical: Shield,
    strategic: Sword,
    routine: Scroll
  };

  const ImportanceIcon = importanceIcons[event.importance] || Scroll;

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <ImportanceIcon size={16} className="text-gray-600" />
              <span className="text-sm text-gray-600 capitalize">
                {event.importance} Priority
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Time and Frequency */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-600" />
                <span className="text-sm">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </span>
              </div>
              {event.is_overnight && (
                <span className="text-sm text-amber-600">Overnight Event</span>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-600" />
                <span className="text-sm capitalize">{event.frequency}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Strategic Details</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Resources and Outcomes */}
          <div className="grid grid-cols-2 gap-4">
            {event.resources_needed && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Resources</h4>
                <p className="text-gray-700">{event.resources_needed}</p>
              </div>
            )}
            {event.expected_outcome && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Expected Outcome</h4>
                <p className="text-gray-700">{event.expected_outcome}</p>
              </div>
            )}
          </div>

          {/* Strategic Value */}
          {event.strategic_value && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Strategic Value</h4>
              <p className="text-gray-700">{event.strategic_value}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <button
            onClick={() => onDelete(event)}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => onEdit(event)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};