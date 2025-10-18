// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'moodEntries';

export const saveEntry = async (entry) => {
  try {
    const entries = await getEntries();
    const newEntries = [entry, ...entries];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  } catch (error) {
    console.error('Error al guardar:', error);
  }
};

export const getEntries = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al leer:', error);
    return [];
  }
};