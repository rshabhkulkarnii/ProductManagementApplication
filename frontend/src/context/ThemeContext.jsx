import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Theme Context
 * Manages dark/light mode across the entire application
 */
const ThemeContext = createContext();

/**
 * Theme Provider Component
 * Wraps the entire app to provide theme functionality
 */
export function ThemeProvider({ children }) {
  // Get initial theme from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme to HTML
    if (isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#fff';
    } else {
      document.documentElement.removeAttribute('data-bs-theme');
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#000';
    }
  }, [isDarkMode]);

  /**
   * Toggle between dark and light mode
   */
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}