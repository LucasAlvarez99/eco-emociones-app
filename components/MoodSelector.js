// components/MoodSelector.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const emociones = [
  { key: 'alegria', label: 'Alegría', color: '#FFD700' },
  { key: 'calma', label: 'Calma', color: '#4CAF50' },
  { key: 'tristeza', label: 'Tristeza', color: '#2196F3' },
  { key: 'ansiedad', label: 'Ansiedad', color: '#FF9800' },
  { key: 'frustracion', label: 'Frustración', color: '#F44336' },
  { key: 'enojo', label: 'Enojo', color: '#9C27B0' },
];

export default function MoodSelector({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      {emociones.map(emo => (
        <TouchableOpacity
          key={emo.key}
          onPress={() => onSelect(emo.key)}
          style={[
            styles.button,
            {
              backgroundColor: selected === emo.key ? emo.color : '#f0f0f0',
              borderColor: emo.color,
              borderWidth: 2,
            }
          ]}
        >
          <Text
            style={[
              styles.text,
              {
                color: selected === emo.key ? 'white' : emo.color,
                fontWeight: 'bold',
              }
            ]}
          >
            {emo.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    minHeight: 100,
  },
  button: {
    margin: 6,
    minWidth: 100,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  text: {
    fontSize: 14,
  },
});