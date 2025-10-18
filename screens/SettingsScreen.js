// screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TextInput, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { setReminderSettings, getReminderSettings } from '../utils/notifications';
import { hasActivePremium } from '../utils/subscriptionManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [hour, setHour] = useState('20');
  const [minute, setMinute] = useState('0');
  const [premiumDaysLeft, setPremiumDaysLeft] = useState(null);

  useEffect(() => {
    loadSettings();
    checkPremiumStatus();
  }, []);

  const loadSettings = async () => {
    const settings = await getReminderSettings();
    setReminderEnabled(settings.enabled);
    setHour(settings.hour);
    setMinute(settings.minute);
  };

  const checkPremiumStatus = async () => {
    const trialStart = await AsyncStorage.getItem('premiumTrialStart');
    if (trialStart) {
      const start = new Date(trialStart);
      const now = new Date();
      const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      const daysLeft = 30 - diffDays;
      setPremiumDaysLeft(daysLeft > 0 ? daysLeft : 0);
    }
  };

  const handleSaveReminder = async () => {
    await setReminderSettings({ enabled: reminderEnabled, hour, minute });
  };

  const toggleReminder = async (value) => {
    setReminderEnabled(value);
    await setReminderSettings({ enabled: value, hour, minute });
  };

  const resetData = async () => {
    await AsyncStorage.clear();
    Alert.alert('Datos borrados', 'Reinicia la app.');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>⚙️ Configuración</Text>

      {/* Estado premium */}
      {premiumDaysLeft !== null && (
        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>💎 Estado Premium</Text>
          <Text style={[styles.premiumStatus, { color: premiumDaysLeft > 0 ? '#4CAF50' : '#F44336' }]}>
            {premiumDaysLeft > 0 ? `${premiumDaysLeft} días restantes` : 'Expirado'}
          </Text>
        </View>
      )}

      {/* Modo oscuro */}
      <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>🌙 Modo oscuro</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={isDark ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>

      {/* Recordatorio */}
      <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>🔔 Recordatorio diario</Text>
        <Switch
          value={reminderEnabled}
          onValueChange={toggleReminder}
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={reminderEnabled ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>

      {/* Ajuste de hora */}
      {reminderEnabled && (
        <View style={[styles.timePicker, { backgroundColor: colors.card }]}>
          <Text style={[styles.timeLabel, { color: colors.text }]}>Hora:</Text>
          <TextInput
            style={[styles.timeInput, { color: colors.text, borderColor: colors.border }]}
            value={hour}
            onChangeText={setHour}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={[styles.timeLabel, { color: colors.text }]}>:</Text>
          <TextInput
            style={[styles.timeInput, { color: colors.text, borderColor: colors.border }]}
            value={minute}
            onChangeText={setMinute}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={[styles.saveButton, { color: colors.primary }]} onPress={handleSaveReminder}>
            Guardar
          </Text>
        </View>
      )}

      {/* Borrar datos */}
      <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>🗑️ Borrar todos los datos</Text>
        <Text style={[styles.resetButton, { color: '#F44336' }]} onPress={resetData}>
          Restablecer
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, marginVertical: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  settingLabel: { fontSize: 16, fontWeight: '600' },
  premiumStatus: { fontSize: 14, fontWeight: 'bold' },
  timePicker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 12, marginVertical: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  timeLabel: { fontSize: 16 },
  timeInput: { borderWidth: 1, padding: 8, borderRadius: 8, width: 50, textAlign: 'center' },
  saveButton: { fontSize: 14, fontWeight: 'bold' },
  resetButton: { fontSize: 14, fontWeight: 'bold' },
}); 