import { useContext } from 'react';
import { DarkModeContext } from '../context/darkModeContext'; // Updated import

// Custom hook to use dark mode
export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}