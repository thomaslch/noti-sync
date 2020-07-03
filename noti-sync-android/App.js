import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/HomeScreen';

const Stack = createStackNavigator();

// nothing to see there, go check HomeScreen for code
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="noti sync" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}