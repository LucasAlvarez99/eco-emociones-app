// utils/notifications.js
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Programar notificación con hora personalizada
export const scheduleDailyReminder = async (hour = 20, minute = 0) => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌱 ¿Cómo te sientes hoy?",
      body: "Tómate un minuto para registrar tu ánimo.",
      sound: true,
    },
    trigger: {
      hour: parseInt(hour, 10),
      minute: parseInt(minute, 10),
      repeats: true,
    },
  });
};

// Guardar estado y hora
export const setReminderSettings = async ({ enabled, hour, minute }) => {
  await AsyncStorage.setItem('reminderEnabled', JSON.stringify(enabled));
  if (enabled) {
    await AsyncStorage.setItem('reminderTime', `${hour}:${minute}`);
    await scheduleDailyReminder(hour, minute);
  } else {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
};

// Obtener configuración
export const getReminderSettings = async () => {
  const enabled = await AsyncStorage.getItem('reminderEnabled');
  const time = await AsyncStorage.getItem('reminderTime');
  const [hour, minute] = time ? time.split(':') : ['20', '0'];
  return {
    enabled: enabled ? JSON.parse(enabled) : false,
    hour: hour || '20',
    minute: minute || '0',
  };
};