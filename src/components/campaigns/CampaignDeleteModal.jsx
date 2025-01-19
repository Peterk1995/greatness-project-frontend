// src/components/campaigns/CampaignDeleteModal.jsx

import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CampaignDeleteModal({ campaignId, onConfirm, onCancel }) {
  const [confirmText, setConfirmText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmText.trim().toLowerCase() === 'delete') {
      onConfirm();
    } else {
      alert('You must type "delete" to confirm.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-lg relative shadow">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Campaign Deletion</h2>
        <p className="text-gray-700 mb-2">
          Are you sure you want to delete this campaign? This action cannot be undone.
        </p>
        <p className="text-gray-500 mb-4">Type <strong>delete</strong> to confirm.</p>

        {/* Confirmation Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Type 'delete' to confirm"
            required
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
