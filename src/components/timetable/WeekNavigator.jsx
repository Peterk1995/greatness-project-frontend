import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Crown,
  Shield
} from 'lucide-react';
import { format, addWeeks, startOfWeek, endOfWeek } from 'date-fns';

const WeekNavigator = ({ currentDate, onWeekChange }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const handlePreviousWeek = () => onWeekChange(addWeeks(currentDate, -1));
  const handleNextWeek = () => onWeekChange(addWeeks(currentDate, 1));
  const handleCurrentWeek = () => onWeekChange(new Date());

 // WeekNavigator.jsx - Dark theme update
return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        {/* Previous Week */}
        <button
          onClick={handlePreviousWeek}
          className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
  
        {/* Current Week Display */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-100">
              Imperial Calendar
            </h2>
          </div>
          <p className="text-gray-400">
            {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
          </p>
        </div>
  
        {/* Next Week */}
        <button
          onClick={handleNextWeek}
          className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
  
      {/* Return to Current Week */}
      <div className="mt-2 flex justify-center">
        <button
          onClick={handleCurrentWeek}
          className="flex items-center gap-2 px-3 py-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Shield className="w-4 h-4" />
          <span>Return to Current Battle</span>
        </button>
      </div>
    </div>
  );
};

export default WeekNavigator;