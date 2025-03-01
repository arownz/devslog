import { createContext, useState, useContext, useEffect } from 'react';

// Create context
const DarkModeContext = createContext();

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
      // Add any global style changes needed
    } else {
      document.documentElement.classList.remove('dark-mode');
      // Remove any global style changes
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

// Custom hook to use dark mode
export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}