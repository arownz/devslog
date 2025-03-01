import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DarkModeContext } from './darkModeContext';

// Provider component
export function DarkModeProvider({ children }) {
  // Check for saved preference or use system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Update localStorage and apply class when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply or remove dark mode class from document
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  // Toggle function
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// Add prop validation
DarkModeProvider.propTypes = {
  children: PropTypes.node.isRequired
};