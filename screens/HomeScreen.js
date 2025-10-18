// screens/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import MoodSelector from '../components/MoodSelector';
import { saveEntry } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [emocion, setEmocion] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [intensidad, setIntensidad] = useState('5');
  const [sueno, setSueno] = useState('');
  const [nota, setNota] = useState('');

  const handleSave = async () => {
    if (!emocion) {
      alert('Por favor, selecciona cómo te sientes.');
      return;
    }

    const entry = {
      fecha: new Date(fecha).toISOString(), // Guardamos como ISO para consistencia
      emocion,
      intensidad: parseInt(intensidad, 10) || 5,
      sueno: sueno ? parseInt(sueno, 10) : undefined,
      nota,
    };

    await saveEntry(entry);
    alert('¡Registrado! 🌱');

    // Reset
    setEmocion(null);
    setFecha(new Date().toISOString().split('T')[0]);
    setIntensidad('5');
    setSueno('');
    setNota('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>¿Cómo te sientes hoy?</Text>
      
      <MoodSelector selected={emocion} onSelect={setEmocion} />
      
      {emocion && (
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>📅 Fecha</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            value={fecha}
            onChangeText={setFecha}
            placeholder="AAAA-MM-DD"
          />
          
          <Text style={[styles.label, { color: colors.text }]}>Intensidad (1-10):</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            value={intensidad}
            onChangeText={setIntensidad}
            keyboardType="numeric"
            maxLength={2}
          />
          
          <Text style={[styles.label, { color: colors.text }]}>Horas de sueño (opcional):</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            value={sueno}
            onChangeText={setSueno}
            keyboardType="numeric"
            maxLength={2}
          />
          
          <Text style={[styles.label, { color: colors.text }]}>¿Qué pasó hoy? (opcional)</Text>
          <TextInput
            style={[styles.input, { height: 80, backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="Escribe algo breve..."
            value={nota}
            onChangeText={setNota}
            multiline
            textAlignVertical="top"
          />
          
          <Button 
            mode="contained" 
            onPress={handleSave} 
            disabled={!emocion}
            title="💾 Guardar entrada"
            style={[styles.saveButton, { backgroundColor: '#4CAF50' }]}
            labelStyle={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 30 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 25, fontWeight: 'bold' },
  form: { marginTop: 20 },
  label: { fontSize: 16, marginVertical: 8, fontWeight: '600' },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, fontSize: 16 },
  saveButton: { marginTop: 20, paddingVertical: 10, borderRadius: 8, elevation: 2 },
});