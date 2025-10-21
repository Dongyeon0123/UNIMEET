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
  const me = useSelector((state: RootState) => state.auth.user);
  const [rooms, setRooms] = useState(useSelector((state: RootState) => state.chats));

  useEffect(() => {
    const loadRooms = async () => {
      console.log('[CHAT] 채팅방 목록 로드 시작');
      try {
        console.log('[CHAT] API 요청:', `${API_BASE_URL}/api/chat/rooms`);
        console.log('[CHAT] 토큰:', token ? '있음' : '없음');
        
        const res = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        
        console.log('[CHAT] 응답 상태:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('[CHAT] 받은 데이터:', data);
          
          const list = Array.isArray(data) ? data : (data.chatRooms || []);
          console.log('[CHAT] 채팅방 리스트:', list);
          
          // 채팅방 데이터 가공 및 안읽음 카운트, 마지막 메시지 로드
          const withUnread = await Promise.all(list.map(async (r: any) => {
            console.log('[CHAT] 채팅방 데이터:', r);
            
            // 마지막 메시지 가져오기
            let lastMessage = '새로운 채팅방입니다';
            let lastTime = new Date(r.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            
            try {
              const messagesRes = await fetch(`${API_BASE_URL}/api/chat/rooms/${r.id}/messages`, {
                headers: { 'Authorization': token ? `Bearer ${token}` : '' },
              });
              if (messagesRes.ok) {
                const messages = await messagesRes.json();
                const messageList = Array.isArray(messages) ? messages : [];
                if (messageList.length > 0) {
                  const lastMsg = messageList[messageList.length - 1];
                  lastMessage = lastMsg.content || lastMsg.text || '메시지';
                  if (lastMsg.createdAt) {
                    lastTime = new Date(lastMsg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
                  }
                }
              }
            } catch (e) {
              console.error('[CHAT] 마지막 메시지 로드 실패:', e);
            }
            
            // 기본 채팅방 데이터 구조 생성
            const room: any = {
              id: r.id,
              name: r.name || r.title || `채팅방 ${r.id.slice(-4)}`, // name, title 모두 확인
              lastMessage: lastMessage,
              lastTime: lastTime,
              memberCount: r.participantIds?.length || r.memberCount || 2,
              profileColor: r.profileColor || ['#6846FF', '#FF6B81', '#4CAF50', '#FF9800'][Math.floor(Math.random() * 4)],
              active: r.active,
              createdAt: r.createdAt,
              participantIds: r.participantIds,
              unread: 0
            };
            
            try {
              if (!me?.id) return room;
              const u = await fetch(`${API_BASE_URL}/api/chat/rooms/${r.id}/unread-count?userId=${me.id}`, {
                headers: { 'Authorization': token ? `Bearer ${token}` : '' },
              });
              if (u.ok) {
                const { count } = await u.json();
                room.unread = count;
              }
            } catch (e) {
              console.error('[CHAT] 안읽음 카운트 로드 실패:', e);
            }
            
            return room;
          }));
          
          console.log('[CHAT] 최종 채팅방 데이터:', withUnread);
          setRooms(withUnread);
        } else {
          const errorText = await res.text();
          console.error('[CHAT] API 에러:', errorText);
        }
      } catch (e) {
        console.error('[CHAT] 네트워크 에러:', e);
      }
    };
    loadRooms();
  }, [token, me?.id]);

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