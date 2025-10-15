import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import GradientScreen from '../../component/GradientScreen';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Header from '../../navigation/Header';
import { API_BASE_URL } from '../../utils/env';

const handleNotificationPress = () => {
  alert('채팅에서 알림을 눌렀습니다!');
};

const Chat: React.FC = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [rooms, setRooms] = useState(useSelector((state: RootState) => state.chats));

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
        }
      } catch (e) {
        // 무시: 네트워크 실패 시 기존 더미 유지
      }
    };
    loadRooms();
  }, [token]);

  const handleRoomPress = (roomId: number) => {
    navigation.navigate('ChatRoom', { roomId });
  };

  return (
    <GradientScreen>
      <Header
          title="채팅"
          onNotificationPress={handleNotificationPress}
          iconName="notifications-outline"
        />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.comment}>
          <Ionicons name="rocket-outline" size={12} color="#3D3D3D" style={styles.icon} />
          <Text style={styles.commentText}>채팅중에 욕설이나 비하발언은 처벌 대상입니다 !</Text>
        </View>
        {rooms.map(room => (
          <TouchableOpacity
            key={room.id}
            style={styles.roomCard}
            activeOpacity={0.85}
            onPress={() => handleRoomPress(room.id)}
          >
            <View style={[styles.profileCircle, { backgroundColor: room.profileColor }]}>
              <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
            </View>
            <View style={styles.roomInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.memberCountText}>
                  {room.memberCount}
                </Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {room.lastMessage}
              </Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.lastTime}>{room.lastTime}</Text>
              {room.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{room.unread}</Text>
                </View>
              )}
            </View>
        </TouchableOpacity>
      ))}
      </ScrollView>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  comment: {
    width: '100%',
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    flexDirection: 'row',
  },
  commentText: {
    fontSize:11,
    color: '#3D3D3D'
  },
  icon: {
    marginRight: 5,
    marginBottom: 2,
    color: '#3D3D3D'
  },
  sideButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  titleBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    elevation: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#B092FF',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  roomInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  roomName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 13,
    color: '#888',
    maxWidth: 180,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 48,
  },
  lastTime: {
    fontSize: 11,
    color: '#AAA',
    marginBottom: 6,
  },
  unreadBadge: {
    backgroundColor: '#FF6B81',
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  memberCountText: {
    fontSize: 13,
    color: '#888',
    marginLeft: 5,
    marginBottom: 4,
    fontWeight: '500',
  }  
});

export default Chat;