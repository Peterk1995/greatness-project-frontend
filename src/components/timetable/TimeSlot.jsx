import React from 'react';

export const TimeSlot = ({ slot, onDelete, onClick }) => {
  return (
    <div 
      className={`p-2 border rounded min-h-16 relative ${slot?.color || 'hover:bg-gray-50'}`}
      onClick={onClick}
    >
      {slot ? (
        <>
          <div className="text-xs">
            <div className="font-semibold">{slot.name}</div>
            <div>{slot.room}</div>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="absolute top-1 right-1 p-1 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          )}
        </>
      ) : null}
    </div>
  );
};