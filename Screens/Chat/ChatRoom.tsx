import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import GradientScreen from '../../component/GradientScreen';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../utils/env';
import { createStompConnection, StompConn } from '../../utils/stomp';
import type { RootStackParamList } from '../../navigation/types';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// 오전/오후 시간 포맷 함수
function getKoreanAmPmTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  let period = '오전';
  if (hours >= 12) {
    period = '오후';
    if (hours > 12) hours -= 12;
  }
  if (hours === 0) hours = 12;
  return `${period} ${hours}:${minutes}`;
}

const dummyMessages: {
    id: number;
    text: string;
    mine: boolean;
    time: string;
    nickname: string;
    avatar: IoniconName;
    readCount?: number;
  }[] = [];

const ChatRoom: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ChatRoom'>>();
  const { roomId } = route.params;

  const room = useSelector((state: RootState) =>
    state.chats.find(r => r.id === roomId)
  );

  const token = useSelector((state: RootState) => state.auth.token);
  const me = useSelector((state: RootState) => state.auth.user);
  const [messages, setMessages] = useState(dummyMessages);
  const stompRef = useRef<StompConn | null>(null);
  const [input, setInput] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // 히스토리 로드
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}/messages`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = (Array.isArray(data) ? data : []).map((m: any, idx: number) => ({
            id: m.id || idx + 1,
            text: m.content || '',
            mine: m.senderId === me?.id,
            time: getKoreanAmPmTime(),
            nickname: m.sender || (m.senderId === me?.id ? '나' : '상대'),
            avatar: (m.senderId === me?.id ? 'person-circle' : 'person-circle-outline') as IoniconName,
            readCount: m.read ? 1 : 0,
          }));
          setMessages(mapped);
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }
      } catch {}
      // 읽음 처리
      try {
        if (me?.id) {
          await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}/read`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({ userId: me.id }),
          });
        }
      } catch {}
    })();

    // STOMP 연결 및 구독
    const conn = createStompConnection(token || undefined);
    stompRef.current = conn;

    const trySubscribe = () => {
      // 연결 후 구독 시도 (지연 연결 고려)
      const interval = setInterval(() => {
        if (conn.client.connected) {
          clearInterval(interval);
          conn.subscribe(`/topic/chat/${roomId}`, (msg) => {
            try {
              const payload = JSON.parse(msg.body);
              // 백엔드 메시지 스키마에 맞춰 매핑 필요
              const incoming = {
                id: Date.now(),
                text: payload?.content ?? '',
                mine: false,
                time: getKoreanAmPmTime(),
                nickname: payload?.sender?.nickname ?? '상대',
                avatar: 'person-circle-outline' as IoniconName,
                readCount: 1,
              };
              setMessages((prev) => [...prev, incoming]);
              setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
            } catch {}
          });
        }
      }, 200);
    };
    trySubscribe();

    return () => {
      conn.disconnect();
    };
  }, [roomId, token]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const optimistic = {
      id: messages.length + 1,
      text: input,
      mine: true,
      time: getKoreanAmPmTime(),
      nickname: '나',
      avatar: 'person-circle' as IoniconName,
      readCount: 1,
    };
    setMessages([...messages, optimistic]);
    const text = input;
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    try {
      // REST 전송
      await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ content: text }),
      });

      // STOMP 전송 (백엔드가 /app/chat/{roomId} 매핑 시)
      stompRef.current?.send(`/app/chat/${roomId}`, { content: text });
    } catch (e) {
      // 실패 시 간단 안내 (UI 토스트 등으로 대체 가능)
    }
  };

  return (
    <GradientScreen>
      <View style={styles.header}>
        <View style={styles.leftBox}>
          <TouchableOpacity style={styles.sideButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.title} numberOfLines={1}>
              {room?.name || '채팅방'}
            </Text>
            <Text style={styles.memberCount}>
              {room ? `${room.memberCount}` : ''}
            </Text>
          </View>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => alert('검색')}>
            <Ionicons name="search" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => alert('메뉴')}>
            <Entypo name="menu" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.mine ? styles.myRow : styles.otherRow,
              ]}
            >
              {/* 상대 메시지: 아이콘, 닉네임 왼쪽 */}
              {!msg.mine && (
                <Ionicons
                  name={msg.avatar}
                  size={38}
                  color="#B092FF"
                  style={styles.avatarIcon}
                />
              )}
              <View style={{ flex: 1, maxWidth: '80%' }}>
                {/* 상대 메시지: 닉네임 */}
                {!msg.mine && (
                  <Text style={[styles.nickname, styles.otherNickname]}>
                    {msg.nickname}
                  </Text>
                )}
               <View style={[styles.bubbleRow, msg.mine ? { flexDirection: 'row-reverse' } : {}]}>
                <View style={[styles.bubble, msg.mine ? styles.myBubble : styles.otherBubble]}>
                    <Text style={styles.bubbleText}>{msg.text}</Text>
                </View>
                <View
                    style={[
                    styles.timeReadCol,
                    msg.mine
                        ? { marginLeft: 8, marginRight: 0 }
                        : { marginRight: 8, marginLeft: 0 }
                    ]}
                >
                    <Text style={msg.mine ? styles.myReadCount : styles.readCount}>
                      {msg.readCount ?? 1}
                    </Text>
                    <Text style={styles.bubbleTime}>{msg.time}</Text>
                </View>
                </View>

              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.plusBtn} onPress={() => setShowPanel(true)}>
            <Ionicons name="add" size={24} color="#6846FF" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="메시지를 입력하세요"
            placeholderTextColor="#AAA"
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 아래에서 올라오는 패널 */}
        <Modal
          visible={showPanel}
          animationType="slide"
          transparent
          onRequestClose={() => setShowPanel(false)}
        >
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowPanel(false)} />
          <View style={styles.bottomPanel}>
            <TouchableOpacity style={styles.panelBtn} onPress={() => { setShowPanel(false); alert('사진 선택'); }}>
              <Ionicons name="image-outline" size={28} color="#6846FF" />
              <Text style={styles.panelBtnText}>사진</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelBtn} onPress={() => { setShowPanel(false); alert('통화 시작'); }}>
              <Ionicons name="call-outline" size={28} color="#6846FF" />
              <Text style={styles.panelBtnText}>통화</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginTop: 60,
    marginBottom: 11,
    paddingHorizontal: 8,
    position: 'relative',
  },
  leftBox: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sideButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  titleBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    elevation: 4,
    maxWidth: '100%',
  },
  rightIcons: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconBtn: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  messages: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 12,
    paddingBottom: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 15,
  },
  myRow: {
    justifyContent: 'flex-end',
  },
  otherRow: {
    justifyContent: 'flex-start',
  },
  avatarIcon: {
    marginHorizontal: 2,
    marginBottom: 8,
  },
  nickname: {
    fontSize: 11,
    marginBottom: 4,
    marginLeft: 2,
    marginRight: 2,
    fontWeight: '600',
  },
  otherNickname: {
    color: '#666666',
    textAlign: 'left',
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '100%',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 0,
    shadowColor: '#B092FF',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  myBubble: {
    backgroundColor: '#B092FF',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: '#D9D7D7',
    alignSelf: 'flex-start',
  },
  bubbleText: {
    fontSize: 14,
    color: '#222',
  },
  timeReadCol: {
    minWidth: 32,
    marginHorizontal: 4,
  },
  readCount: {
    fontSize: 10,
    color: '#FF6B81',
    fontWeight: 'bold',
    marginBottom: 1,
    marginLeft: 4,
  },
  myReadCount: {
    fontSize: 10,
    color: '#FF6B81',
    fontWeight: 'bold',
    marginBottom: 1,
    marginLeft: 34,
  },
  bubbleTime: {
    fontSize: 10,
    color: '#AAA',
    marginHorizontal: 2,
    marginBottom: 2,
    alignSelf: 'flex-end',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 220, 220, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    paddingBottom: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  plusBtn: {
    marginRight: 8,
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 18,
    marginRight: 10,
    color: '#222',
  },
  sendBtn: {
    backgroundColor: '#6846FF',
    borderRadius: 18,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
  },
  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#6846FF',
    shadowOpacity: 0.09,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
  },
  panelBtn: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  panelBtnText: {
    marginTop: 6,
    fontSize: 14,
    color: '#6846FF',
    fontWeight: 'bold',
  },
  memberCount: {
    fontSize: 16,
    color: '#eee',
    marginLeft: 6,
    fontWeight: 'bold',
  },
});

export default ChatRoom;