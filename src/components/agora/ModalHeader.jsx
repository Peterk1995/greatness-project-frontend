// src/components/CreateActionModal/ModalHeader.jsx
import React from 'react';
import { X } from 'lucide-react';

const ModalHeader = ({ onClose }) => {
  const handleClose = () => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="bg-gold-500/10 p-6 border-b-2 border-gold-500/20 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-gold-600 dark:text-gold-300">⚔</span>
          <h2 className="text-xl font-bold text-gold-600 dark:text-gold-300">
            Declare Your Triumph
          </h2>
        </div>
        <button
          onClick={handleClose}
          className="text-gold-600/70 hover:text-gold-600 dark:text-gold-300"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" strokeWidth="2" />
        </button>
      </div>
    </div>
  );
};

export default ModalHeader;