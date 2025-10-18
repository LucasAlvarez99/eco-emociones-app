// screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { getEntries } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';
import { hasActivePremium } from '../utils/subscriptionManager';

const EMOCIONES = {
  alegria: { label: 'Alegría', color: '#FFD700' },
  calma: { label: 'Calma', color: '#4CAF50' },
  tristeza: { label: 'Tristeza', color: '#2196F3' },
  ansiedad: { label: 'Ansiedad', color: '#FF9800' },
  frustracion: { label: 'Frustración', color: '#F44336' },
  enojo: { label: 'Enojo', color: '#9C27B0' },
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const getLast7DaysData = (entries) => {
  return entries.slice(0, 7);
};

const generateWeeklyEvaluation = (entries) => {
  if (entries.length === 0) return "No hay datos esta semana.";
  
  const emocionesNegativas = ['tristeza', 'ansiedad', 'frustracion', 'enojo'];
  const diasNegativos = entries.filter(e => emocionesNegativas.includes(e.emocion));
  
  if (diasNegativos.length >= 5) {
    return "Esta semana has tenido muchos días difíciles. Considera hablar con alguien de confianza o probar ejercicios de respiración.";
  } else if (diasNegativos.length >= 3) {
    return "Has tenido algunos días desafiantes. Recuerda que es normal y válido sentirse así.";
  } else {
    return "¡Tu semana ha sido bastante equilibrada! Sigue cuidando de tu bienestar.";
  }
};

const generatePDF = async (entries, evaluation, colors) => {
  const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: ${colors.background}; color: ${colors.text}; }
          h1 { color: #4CAF50; text-align: center; }
          .evaluation { background: ${colors.card}; padding: 15px; border-radius: 10px; margin: 20px 0; }
          .entry { border-bottom: 1px solid ${colors.border}; padding: 10px 0; }
        </style>
      </head>
      <body>
        <h1>Resumen Semanal - Eco Emocional</h1>
        <div class="evaluation">
          <h3>Evaluación:</h3>
          <p>${evaluation}</p>
        </div>
        <h3>Registros:</h3>
        ${entries.map(e => {
          const emo = EMOCIONES[e.emocion] || { label: e.emocion };
          return `<div class="entry">${formatDate(e.fecha)} - ${emo.label} (${e.intensidad}/10)</div>`;
        }).join('')}
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
};

export default function HistoryScreen() {
  const { colors } = useTheme();
  const [entries, setEntries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadEntries();
    checkPremium();
  }, []);

  const loadEntries = async () => {
    const data = await getEntries();
    setEntries(data);
  };

  const checkPremium = async () => {
    const premium = await hasActivePremium();
    setIsPremium(premium);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  const weeklyEntries = getLast7DaysData(entries);
  const evaluation = generateWeeklyEvaluation(weeklyEntries);

  const handleDownloadPDF = async () => {
    if (!isPremium) {
      Alert.alert('Versión Premium', 'Desbloquea esta función con 30 días gratis.');
      return;
    }
    await generatePDF(weeklyEntries, evaluation, colors);
  };

  const renderEntry = ({ item }) => {
    const emocion = EMOCIONES[item.emocion] || { label: item.emocion, color: '#9E9E9E' };
    const formattedDate = formatDate(item.fecha);
    
    return (
      <View style={[styles.entry, { backgroundColor: colors.card }]}>
        <View style={[styles.emotionBadge, { backgroundColor: emocion.color }]}>
          <Text style={styles.emotionLabel}>{emocion.label}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.date, { color: colors.text }]}>{formattedDate}</Text>
          <Text style={[styles.intensidad, { color: colors.textSecondary }]}>Intensidad: {item.intensidad}/10</Text>
          {item.nota ? <Text style={[styles.nota, { color: colors.text }]}>"{item.nota}"</Text> : null}
          {item.sueno !== undefined && (
            <Text style={[styles.sueno, { color: colors.textSecondary }]}>😴 Dormiste {item.sueno}h</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Evaluación semanal */}
      <View style={[styles.evaluationCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.evaluationTitle, { color: colors.text }]}>Evaluación de la semana</Text>
        <Text style={[styles.evaluationText, { color: colors.textSecondary }]}>{evaluation}</Text>
        
        {/* Botón PDF (solo premium) */}
        <Text 
          style={[styles.pdfButton, { color: isPremium ? colors.primary : '#aaa' }]} 
          onPress={handleDownloadPDF}
        >
          📄 {isPremium ? 'Descargar PDF' : 'PDF (Premium)'}
        </Text>
      </View>

      {/* Historial */}
      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.text }]}>Aún no has registrado ningún día.</Text>
          <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>Ve a "Registrar" para empezar.</Text>
        </View>
      ) : (
        <FlatList
          data={weeklyEntries}
          renderItem={renderEntry}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  evaluationCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  evaluationTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  evaluationText: { fontSize: 14, lineHeight: 20 },
  pdfButton: { marginTop: 15, fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  list: { paddingBottom: 20 },
  entry: { flexDirection: 'row', padding: 16, marginVertical: 8, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  emotionBadge: { minWidth: 90, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  emotionLabel: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  date: { fontSize: 16, fontWeight: '600' },
  intensidad: { fontSize: 14, marginTop: 4 },
  nota: { fontSize: 14, fontStyle: 'italic', marginTop: 6 },
  sueno: { fontSize: 13, marginTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, textAlign: 'center' },
  emptyHint: { fontSize: 14, textAlign: 'center', marginTop: 10 },
});