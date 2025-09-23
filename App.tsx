/**
 * UVC Camera React Native App
 * 
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, ScrollView } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import CameraScreen from './src/components/CameraScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <ScrollView>
      <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
        <CameraScreen />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
