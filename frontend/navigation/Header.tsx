import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onNotificationPress: () => void;
}

interface HeaderProps {
    title: string;
    onNotificationPress: () => void;
    iconName?: string;
  }
  
  const Header: React.FC<HeaderProps> = ({ title, onNotificationPress, iconName = "notifications-outline" }) => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
        <Ionicons name={iconName as any} size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: 'transparent', // 배경 투명
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    left: 10,
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    elevation: 4, // Android
  },
  notificationButton: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  leftSpace: {
    width: 24,
  },
});

export default Header;
