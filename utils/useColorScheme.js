// utils/useColorScheme.js
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export const useColorScheme = () => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  return colorScheme; // 'light' o 'dark'
};