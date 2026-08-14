import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import InputScreen from './screens/InputScreen';
import GraphsScreen from './screens/GraphsScreen';
import ScreenshotScreen from './screens/ScreenshotScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{ title: 'Blood Pressure Tracker' }}
      />
    </Stack.Navigator>
  );
}

function GraphsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="GraphsScreen" 
        component={GraphsScreen}
        options={{ title: 'Blood Pressure Analytics' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Input') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Graphs') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Screenshot') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#E74C3C',
          tabBarInactiveTintColor: '#BDC3C7',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{ title: 'Dashboard' }}
        />
        <Tab.Screen 
          name="Input" 
          component={InputScreen}
          options={{ title: 'Add Reading' }}
        />
        <Tab.Screen 
          name="Graphs" 
          component={GraphsStack}
          options={{ title: 'Analytics' }}
        />
        <Tab.Screen 
          name="Screenshot" 
          component={ScreenshotScreen}
          options={{ title: 'Upload' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
