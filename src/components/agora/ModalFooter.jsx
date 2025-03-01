// src/components/CreateActionModal/ModalFooter.jsx
import React from 'react';

const ModalFooter = ({ onClose }) => {
  const handleClose = () => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="pt-6 border-t-2 border-gold-500/10">
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleClose}
          className="px-5 py-2 text-gold-600 hover:bg-gold-500/10 rounded-lg"
        >
          Retreat
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gold-500 text-black rounded-lg font-medium
                   hover:bg-gold-600 transition-colors shadow-lg"
        >
          Seal Your Fate
        </button>
      </div>
    </div>
  );
};

export default ModalFooter;