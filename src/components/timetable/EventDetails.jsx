import React, { useState } from 'react';
import { 
  Crown, Sword, Shield, Scroll, Star, Clock, 
  Calendar, Edit2, Save, X, AlertCircle 
} from 'lucide-react';

const EventDetailsModal = ({ event, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  const getDomainIcon = () => {
    const icons = {
      conquest: <Sword className="w-6 h-6" />,
      cultural: <Scroll className="w-6 h-6" />,
      wisdom: <Shield className="w-6 h-6" />,
      legacy: <Star className="w-6 h-6" />
    };
    return icons[event.domain] || <Crown className="w-6 h-6" />;
  };

  const handleSave = () => {
    onSave(editedEvent);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg max-w-2xl w-full mx-4 shadow-2xl overflow-hidden border border-gray-700">
        {/* Greek Pattern Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-4 relative overflow-hidden">
          {/* Meander Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.2)_20px)]" />
          </div>
          
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              {getDomainIcon()}
              {isEditing ? (
                <input
                  type="text"
                  value={editedEvent.title}
                  onChange={(e) => setEditedEvent({...editedEvent, title: e.target.value})}
                  className="text-xl font-bold bg-transparent border-b border-blue-500 text-white focus:outline-none"
                />
              ) : (
                <h2 className="text-xl font-bold text-white">{event.title}</h2>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-300 hover:text-blue-200 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="p-2 text-green-300 hover:text-green-200 transition-colors"
                >
                  <Save className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-300 hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Time and Date */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-blue-300">
              <Clock className="w-5 h-5" />
              <span className="text-sm">
                {event.startTime} - {event.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">{event.date}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300">Strategic Details</h3>
            {isEditing ? (
              <textarea
                value={editedEvent.description}
                onChange={(e) => setEditedEvent({...editedEvent, description: e.target.value})}
                className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              />
            ) : (
              <p className="text-gray-400">{event.description}</p>
            )}
          </div>

          {/* Resources and Outcomes */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300">Required Resources</h3>
              {isEditing ? (
                <textarea
                  value={editedEvent.resources_needed}
                  onChange={(e) => setEditedEvent({...editedEvent, resources_needed: e.target.value})}
                  className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                />
              ) : (
                <p className="text-gray-400">{event.resources_needed}</p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300">Expected Outcome</h3>
              {isEditing ? (
                <textarea
                  value={editedEvent.expected_outcome}
                  onChange={(e) => setEditedEvent({...editedEvent, expected_outcome: e.target.value})}
                  className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                />
              ) : (
                <p className="text-gray-400">{event.expected_outcome}</p>
              )}
            </div>
          </div>

          {/* Campaign Information */}
          {event.campaign && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Campaign</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">{event.campaign.title}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="border-t border-gray-700 p-4 bg-gray-900/50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              Close
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;