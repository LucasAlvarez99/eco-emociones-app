// utils/subscriptionManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simulación de suscripción (funciona en Expo Go)
export const hasActivePremium = async () => {
  const trialStart = await AsyncStorage.getItem('premiumTrialStart');
  if (trialStart) {
    const start = new Date(trialStart);
    const now = new Date();
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return diffDays < 30; // Prueba gratuita de 30 días
  }
  return false;
};

export const startFreeTrial = async () => {
  await AsyncStorage.setItem('premiumTrialStart', new Date().toISOString());
};

export const purchasePremium = async () => {
  // En Expo Go, solo simulamos
  await AsyncStorage.setItem('premiumTrialStart', new Date().toISOString());
  return true;
};