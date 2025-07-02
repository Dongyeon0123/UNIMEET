import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const GradientScreen: React.FC<GradientScreenProps> = ({ children, style }) => (
  <LinearGradient
    colors={['#FF87DD', '#B092FF', '#DBD6EC', '#F0F0E9']}
    locations={[0, 0.43, 0.71, 0.93]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 0.25 }}
    style={[styles.container, style]}
  >
    {children}
  </LinearGradient>
);

const styles = {
  container: {
    flex: 1,
  } as ViewStyle,
};

export default GradientScreen;
