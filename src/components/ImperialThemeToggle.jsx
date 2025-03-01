// src/components/common/ImperialThemeToggle.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ImperialThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleDarkMode}
      className="relative group flex items-center justify-center w-12 h-12 rounded-full 
               bg-gradient-to-r from-gray-200 to-gray-300 dark:from-blue-900 dark:to-blue-800
               transition-all duration-300 ease-in-out
               border border-gray-300 dark:border-blue-700
               hover:shadow-lg hover:scale-105"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Moon className="w-6 h-6 text-blue-200 transform transition-transform group-hover:scale-110" />
      ) : (
        <Sun className="w-6 h-6 text-gray-700 transform transition-transform group-hover:scale-110" />
      )}
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400/0 to-gray-400/10 
                    dark:from-blue-400/0 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 
                    transition-opacity" />
    </button>
  );
};

export default ImperialThemeToggle;