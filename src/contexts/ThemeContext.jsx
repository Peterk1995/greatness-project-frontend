import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    console.log('Initializing theme state'); // Debug log
    const savedTheme = localStorage.getItem('alexandrian-theme');
    console.log('Saved theme:', savedTheme); // Debug log
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    console.log('Theme effect running, isDarkMode:', isDarkMode); // Debug log
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('alexandrian-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('alexandrian-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    console.log('Toggle dark mode called'); // Debug log
    setIsDarkMode(prev => {
      console.log('Switching from', prev, 'to', !prev); // Debug log
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};