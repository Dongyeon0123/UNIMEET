import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GradientScreen from '../../component/GradientScreen';

const settingsList = [
  {
    label: '알림 설정',
    icon: 'notifications-outline',
    type: 'switch',
    key: 'notification',
  },
  {
    label: '계정 관리',
    icon: 'person-outline',
    onPress: () => Alert.alert('계정 관리로 이동'),
  },
  {
    label: '앱 정보',
    icon: 'information-circle-outline',
    onPress: () => Alert.alert('앱 정보로 이동'),
  },
  {
    label: '문의하기',
    icon: 'chatbubble-outline',
    onPress: () => Alert.alert('문의하기로 이동'),
  },
  {
    label: '신고하기',
    icon: 'flag-outline',
    onPress: () => Alert.alert('신고하기로 이동'),
  },
  {
    label: '로그아웃',
    icon: 'log-out-outline',
    onPress: () => Alert.alert('로그아웃 되었습니다.'),
  },
  {
    label: '회원탈퇴',
    icon: 'close-circle-outline',
    onPress: () => Alert.alert('회원탈퇴 안내 페이지로 이동'),
  },
];

const Settings: React.FC = () => {
  const navigation = useNavigation();
  const [isNotificationOn, setIsNotificationOn] = useState(true);

  return (
    <GradientScreen>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>환경설정</Text>
        </View>
        <View style={{ width: 46 }} />
      </View>

      <View style={styles.settingBox}>
        {settingsList.map((item, index) => (
          <View key={item.label}>
            {item.type === 'switch' ? (
              <View style={[
                styles.settingRow,
                index === settingsList.length - 1 && styles.lastRow
              ]}>
                <View style={styles.settingLeft}>
                  <Ionicons name={item.icon as any} size={22} color="#6846FF" style={{ marginRight: 12 }} />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                <Switch
                  value={isNotificationOn}
                  onValueChange={setIsNotificationOn}
                  thumbColor={isNotificationOn ? '#6846FF' : '#ccc'}
                  trackColor={{ true: '#CF59DF', false: '#ccc' }}
                />
              </View>
            ) : (
              <TouchableOpacity 
                style={[
                  styles.settingRow, 
                  index === settingsList.length - 1 && styles.lastRow
                ]} 
                onPress={item.onPress}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name={item.icon as any} size={22} color="#6846FF" style={{ marginRight: 12 }} />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#bbb" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 48,
    position: 'relative',
    marginTop: 60,
  },
  backButton: {
    padding: 8,
    zIndex: 1,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    elevation: 4,
  },
  settingBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 18,
    paddingVertical: 10,
    paddingHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default Settings;
