import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import GradientScreen from '../../component/GradientScreen';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const dummyRooms = [
  {
    id: 1,
    name: 'React 스터디',
    lastMessage: '내일 7시에 만나요!',
    lastTime: '1분 전',
    unread: 2,
    profileColor: '#6846FF',
  },
  {
    id: 2,
    name: '에브리타임 채팅',
    lastMessage: 'ㅋㅋㅋㅋㅋㅋㅋㅋㅋ',
    lastTime: '5분 전',
    unread: 0,
    profileColor: '#FF62D5',
  },
  {
    id: 3,
    name: '수업팀플',
    lastMessage: '자료 올렸어요!',
    lastTime: '어제',
    unread: 1,
    profileColor: '#FF9800',
  },
];

const ChatList: React.FC = () => {
  const navigation = useNavigation();

  const handleRoomPress = (roomId: number) => {
    navigation.navigate('ChatRoom', { roomId }); // 상세 채팅방 이동 (예시)
  };

  return (
    <GradientScreen>
      <View style={styles.header}>
        <TouchableOpacity style={styles.sideButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleBox}>
          <Text style={styles.title}>채팅</Text>
        </View>
        <TouchableOpacity style={styles.sideButton} onPress={() => alert('더보기')}>
          <Entypo name="dots-three-horizontal" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {dummyRooms.map(room => (
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
              <Text style={styles.roomName}>{room.name}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 11,
    height: 48,
    position: 'relative',
    marginTop: 60,
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
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    elevation: 4,
  },
  content: {
    paddingHorizontal: 16,
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
});

export default ChatList;
