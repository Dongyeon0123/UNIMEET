import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import GradientScreen from '../../component/GradientScreen';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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
  }[] = [
    { id: 1, text: '안녕하세요!', mine: false, time: '오전 9:01', nickname: '익명1', avatar: 'person-circle-outline', readCount: 2 },
    { id: 2, text: '안녕하세요~', mine: true, time: '오전 9:01', nickname: '나', avatar: 'person-circle', readCount: 2 },
    { id: 3, text: 'React Native 스터디 내일 7시에 만나요!', mine: false, time: '오후 2:38', nickname: '익명2', avatar: 'person-circle-outline', readCount: 3 },
    { id: 4, text: '네! 장소는 어디에요?', mine: true, time: '오후 3:16', nickname: '나', avatar: 'person-circle', readCount: 3 },
];

const ChatRoom: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ChatRoom'>>();
  const { roomId } = route.params;

  const room = useSelector((state: RootState) =>
    state.chats.find(r => r.id === roomId)
  );

  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: input,
        mine: true,
        time: getKoreanAmPmTime(), // 오전/오후 포맷
        nickname: '나',
        avatar: 'person-circle',
        readCount: 1,
      },
    ]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
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
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
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