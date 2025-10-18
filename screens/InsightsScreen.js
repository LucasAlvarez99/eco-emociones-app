// screens/InsightsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { getEntries } from '../utils/storage';
import { hasActivePremium, startFreeTrial } from '../utils/subscriptionManager';
import { useTheme } from '../context/ThemeContext';

const EMOCIONES_NEGATIVAS = ['tristeza', 'ansiedad', 'frustracion', 'enojo'];

const generarConsejos = (entries) => {
  const consejos = [];
  
  // Consejo por días seguidos negativos
  const ultimos3 = entries.slice(0, 3);
  if (ultimos3.length === 3 && ultimos3.every(e => EMOCIONES_NEGATIVAS.includes(e.emocion))) {
    consejos.push({
      tipo: 'respiracion',
      titulo: 'Respiración 4-7-8',
      descripcion: 'Inhala 4 segundos, mantén 7, exhala 8. Repite 4 veces.'
    });
  }

  // Consejo por poco sueño
  const diasConSueno = entries.filter(e => e.sueno !== undefined);
  const diasPocoSueno = diasConSueno.filter(e => e.sueno < 6);
  if (diasPocoSueno.length >= 3) {
    consejos.push({
      tipo: 'sueno',
      titulo: 'Rutina de sueño',
      descripcion: 'Evita pantallas 1h antes de dormir. Intenta acostarte a la misma hora.'
    });
  }

  // Consejo general
  if (consejos.length === 0) {
    consejos.push({
      tipo: 'general',
      titulo: 'Autoconciencia',
      descripcion: 'Estás haciendo un gran trabajo al registrar tus emociones. ¡Sigue así!'
    });
  }

  return consejos;
};

export default function InsightsScreen() {
  const { colors } = useTheme();
  const [consejos, setConsejos] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    const premium = await hasActivePremium();
    setIsPremium(premium);
    
    if (premium) {
      const entries = await getEntries();
      setConsejos(generarConsejos(entries));
    }
    setLoading(false);
  };

  const handleStartTrial = async () => {
    await startFreeTrial();
    Alert.alert('✅ Prueba activada', '¡Disfruta 30 días gratis de Insights Premium!');
    setIsPremium(true);
    const entries = await getEntries();
    setConsejos(generarConsejos(entries));
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text }}>Cargando...</Text>
      </View>
    );
  }

  if (!isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>🔓 Versión Premium</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Desbloquea insights emocionales avanzados con 30 días gratis.
        </Text>
        <Button 
          title="✨ Empezar prueba gratis (30 días)" 
          onPress={handleStartTrial} 
        />
        <Text style={[styles.footer, { color: colors.textSecondary }]}>Luego: $2.99/mes. Cancela cuando quieras.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Tus Insights</Text>
      
      <FlatList
        data={consejos}
        renderItem={({ item }) => (
          <View style={[styles.consejoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.consejoTitulo, { color: colors.text }]}>{item.titulo}</Text>
            <Text style={[styles.consejoDescripcion, { color: colors.textSecondary }]}>{item.descripcion}</Text>
          </View>
        )}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#555' },
  footer: { marginTop: 20, textAlign: 'center', color: '#888', fontSize: 14 },
  list: { paddingBottom: 20 },
  consejoCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  consejoTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  consejoDescripcion: { fontSize: 14, lineHeight: 20 },
});