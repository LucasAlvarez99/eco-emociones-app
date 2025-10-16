// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider } from './context/ThemeContext';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import InsightsScreen from './screens/InsightsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Registrar') iconName = 'emoticon-outline';
              else if (route.name === 'Historial') iconName = 'history';
              else if (route.name === 'Insights') iconName = 'chart-line';
              else if (route.name === 'Configuración') iconName = 'cog';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          })}
        >
          <Tab.Screen 
            name="Registrar" 
            component={HomeScreen} 
            options={{ headerTitle: 'Registrar Hoy' }} 
          />
          <Tab.Screen 
            name="Historial" 
            component={HistoryScreen} 
            options={{ headerTitle: 'Tus Registros' }} 
          />
          <Tab.Screen 
            name="Insights" 
            component={InsightsScreen} 
            options={{ headerTitle: 'Tus Insights' }} 
          />
          <Tab.Screen 
            name="Configuración" 
            component={SettingsScreen} 
            options={{ headerTitle: 'Configuración' }} 
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}