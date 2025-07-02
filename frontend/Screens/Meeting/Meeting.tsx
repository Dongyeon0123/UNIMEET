import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../../navigation/Header';
import GradientScreen from '../../component/GradientScreen';

const Meeting :React.FC = () => {
  const handleNotificationPress = () => {
    alert('내 미팅 화면에서 알림을 눌렀습니다!');
  };

  return (

    <GradientScreen>
        
        <View style={styles.container}>
            {/* 헤더 */}
            <Header title="내 미팅" onNotificationPress={handleNotificationPress} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.text}>내 미팅 화면</Text>
            </ScrollView>
        </View>

    </GradientScreen>
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default Meeting;
