// context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    toggleTheme, // 👈 Añadido
    colors: {
      background: isDark ? '#121212' : '#f9f9f9',
      card: isDark ? '#1e1e1e' : 'white',
      text: isDark ? '#f0f0f0' : '#333',
      textSecondary: isDark ? '#aaa' : '#666',
      border: isDark ? '#333' : '#ddd',
      primary: '#4CAF50',
      grid: isDark ? '#3a3a3a' : '#eee',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};