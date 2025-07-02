import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import Header from '../../navigation/Header';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MeetingRoom, Participant, Gender, RootStackParamList } from '../../navigation/types';

interface RoomPreset {
  label: string;
  male: number;
  female: number;
  type: 'pair' | 'mixed';
}

const ROOM_PRESETS: RoomPreset[] = [
  { label: '1:1', male: 1, female: 1, type: 'pair' },
  { label: '2:2', male: 2, female: 2, type: 'pair' },
  { label: '3:3', male: 3, female: 3, type: 'pair' },
  { label: '혼성 4인', male: 2, female: 2, type: 'mixed' },
  { label: '혼성 6인', male: 3, female: 3, type: 'mixed' },
];

const Home: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 대충 임의로 만든 데이터들
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([
    {
      id: 1,
      title: 'HTML 스터디 모집합니다',
      participants: [
        {
          id: 1,
          name: "홍길동",
          gender: "남",
          department: "컴퓨터공학과",
          age: 22,
          studentId: "20",
          mbti: "INTJ",
          interests: ["#코딩", "#음악"]
        },
        {
          id: 2,
          name: "이철수",
          gender: "남",
          department: "메카트로닉스공학과",
          age: 23,
          studentId: "20",
          mbti: "ENFP",
          interests: ["#로봇", "#여행"]
        },
        {
          id: 3,
          name: "김영희",
          gender: "여",
          department: "유아교육과",
          age: 21,
          studentId: "21",
          mbti: "ISFJ",
          interests: ["#아이돌", "#독서"]
        },
        {
          id: 4,
          name: "박수진",
          gender: "여",
          department: "간호학과",
          age: 22,
          studentId: "22",
          mbti: "ENTJ",
          interests: ["#운동", "#영화"]
        },
      ],
      type: 'pair',
    },
    {
      id: 2,
      title: '토익 700점 목표',
      participants: [
        {
          id: 5,
          name: "",
          gender: "남",
          department: "",
          age: 0,
          studentId: "",
          mbti: "",
          interests: []
        },
        {
          id: 6,
          name: "김철민",
          gender: "남",
          department: "기계공학과",
          age: 23,
          studentId: "24",
          mbti: "ESFP",
          interests: ["#음악", "#축구"]
        },
        {
          id: 7,
          name: "박준형",
          gender: "남",
          department: "토목공학과",
          age: 22,
          studentId: "20",
          mbti: "INFJ",
          interests: ["#영화", "#요리"]
        },
        {
          id: 8,
          name: "한지민",
          gender: "여",
          department: "경영학과",
          age: 21,
          studentId: "21",
          mbti: "ENFJ",
          interests: ["#패션", "#여행"]
        },
        {
          id: 9,
          name: "이민정",
          gender: "여",
          department: "디자인학과",
          age: 22,
          studentId: "23",
          mbti: "ISFP",
          interests: ["#그림", "#음악"]
        },
        {
          id: 10,
          name: "정유진",
          gender: "여",
          department: "화학공학과",
          age: 23,
          studentId: "24",
          mbti: "ESTJ",
          interests: ["#독서", "#수영"]
        },
      ],
      type: 'pair',
    },
    {
      id: 3,
      title: '남녀 상관없는 혼성방',
      participants: [
        {
          id: 11,
          name: "박지성",
          gender: "남",
          department: "생명공학과",
          age: 22,
          studentId: "24",
          mbti: "INTP",
          interests: ["#축구", "#여행"]
        },
        {
          id: 12,
          name: "김소연",
          gender: "여",
          department: "스포츠건강학과",
          age: 21,
          studentId: "25",
          mbti: "ESFJ",
          interests: ["#운동", "#음악"]
        },
        {
          id: 13,
          name: "이동현",
          gender: "남",
          department: "컴퓨터공학과",
          age: 23,
          studentId: "23",
          mbti: "ISTJ",
          interests: ["#프로그래밍", "#게임"]
        },
        {
          id: 14,
          name: "최유리",
          gender: "여",
          department: "화학공학과",
          age: 22,
          studentId: "21",
          mbti: "INFJ",
          interests: ["#영화", "#요리"]
        },
        {
          id: 15,
          name: "",
          gender: "남",
          department: "",
          age: 0,
          studentId: "",
          mbti: "",
          interests: []
        },
        {
          id: 16,
          name: "",
          gender: "여",
          department: "",
          age: 0,
          studentId: "",
          mbti: "",
          interests: []
        },
      ],
      type: 'mixed',
    },
  ]);  

  // 모달 상태 및 입력값
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [roomTitle, setRoomTitle] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<RoomPreset>(ROOM_PRESETS[0]);

  // 인원수 표시
  const getPeopleLabel = (room: MeetingRoom) => {
    if (room.type === 'mixed') {
      return `${room.participants.length}인`;
    }
    const maleCountFilled :number = room.participants.filter(p => p.gender === "남" && p.name !== "").length;
    const femaleCountFilled :number = room.participants.filter(p => p.gender === "여" && p.name !== "").length;
    return `${maleCountFilled}:${femaleCountFilled}`;
  };

  // 방이 다 찼는지(name이 모두 채워졌는지)
  const isRoomFull = (room: MeetingRoom) =>
    room.participants.every((p: Participant) => p.name !== "");

  // 방 만들기
  const handleCreateRoom = () => {
    setModalVisible(true);
  };

  const handleAddRoom = () => {
    if (!roomTitle.trim()) return;
    const newId = meetingRooms.length ? Math.max(...meetingRooms.map(r => r.id)) + 1 : 1;
    
    const participants: Participant[] = [
      ...Array(selectedPreset.male).fill(null).map((_, idx) => ({
        id: newId * 100 + idx + 1,
        name: "",
        gender: "남" as Gender,
        department: "",
        age: 0,
        studentId: "",
        mbti: "",
        interests: [],
      })),
      ...Array(selectedPreset.female).fill(null).map((_, idx) => ({
        id: newId * 100 + selectedPreset.male + idx + 1,
        name: "",
        gender: "여" as Gender,
        department: "",
        age: 0,
        studentId: "",
        mbti: "",
        interests: [],
      })),
    ];
    

    setMeetingRooms(prev => [
      ...prev,
      { 
        id: newId, 
        title: roomTitle, 
        participants,
        type: selectedPreset.type 
      }
    ]);
    setModalVisible(false);
    setRoomTitle('');
    setSelectedPreset(ROOM_PRESETS[0]);
  };

  return (
    <LinearGradient
      colors={['#FFB1E8', '#EC75FF', '#947CFF', '#F0F0E9', '#F0F0E9']}
      locations={[0, 0.28, 0.54, 0.9, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.5 }}
      style={styles.container}
    >
      <Header title="UniMeet" onNotificationPress={() => alert('홈 화면에서 알림을 눌렀습니다!')} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.comment}>
          <Ionicons name="rocket-outline" size={12} color="#3D3D3D" style={styles.icon} />
          <Text style={styles.commentText}>여기는 개발자 코멘트를 적는 곳.</Text>
        </View>

        <View style={styles.guideBox}>
          <Text style={styles.guideBoxText}>여기는 이용 가이드 / 이미지를 넣는 곳.</Text>
        </View>

        <View style={styles.meetingContainer}>
          <Text style={styles.text1}>미팅</Text>
          <TouchableOpacity onPress={() => alert('설명하는 기능 준비중')}>
            <Ionicons name="help-circle-outline" size={20} style={styles.icon} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.createRoomBtn} onPress={handleCreateRoom}>
            <Ionicons name="add-circle-outline" size={15} style={{ marginRight: 2 }} />
            <Text style={styles.createRoomBtnText}>방만들기</Text>
          </TouchableOpacity>
        </View>

        {meetingRooms.map((room) => {
          const isMixed :boolean = room.type === 'mixed';
          return (
            <TouchableOpacity
              key={room.id}
              style={styles.meetingCard}
              activeOpacity={0.85}
              onPress={() => {
                navigation.navigate('RoomDetail', { room });
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{room.title}</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.peopleCount}>{getPeopleLabel(room)}</Text>
                  <Text
                    style={[
                      styles.roomStatus,
                      isRoomFull(room) ? styles.fullStatus : styles.openStatus,
                    ]}
                  >
                    {isRoomFull(room) ? "인원이 다 찼어요" : "참여가 가능해요"}
                  </Text>
                </View>
              </View>
              <View style={styles.participantsContainer}>
                {isMixed ? (
                  <View style={styles.mixedBox}>
                    <Text style={styles.mixedLabel}>혼성</Text>
                    <View style={styles.mixedParticipantsWrap}>
                      {room.participants.map((participant) => (
                        <View key={participant.id} style={styles.mixedParticipantRow}>
                          <Ionicons name="person" size={15} style={styles.mixedIcon} />
                          <Text
                            style={[
                              styles.participantText,
                              styles.mixedIcon,
                              participant.name === "" && styles.noName,
                            ]}
                          >
                            {participant.name === "" ? "없음" : participant.department}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                  <View style={styles.genderRowWrap}>
                    {/* 남자 그룹 */}
                    <View style={styles.genderBoxMale}>
                      <Text style={styles.genderLabelMale}>남</Text>
                      <View style={styles.participantsWrap}>
                        {room.participants
                          .filter((participant) => participant.gender === "남")
                          .map((participant) => (
                            <View key={participant.id} style={styles.participantRow}>
                              <Ionicons name="person" size={12} style={styles.male} />
                              <Text
                                style={[
                                  styles.participantText,
                                  styles.male,
                                  participant.name === "" && styles.noName,
                                ]}
                              >
                                {participant.name === "" ? "없음" : participant.department}
                              </Text>
                            </View>
                          ))}
                      </View>
                    </View>
                    {/* 여자 그룹 */}
                    <View style={styles.genderBoxFemale}>
                      <Text style={styles.genderLabelFemale}>여</Text>
                      <View style={styles.participantsWrap}>
                        {room.participants
                          .filter((participant) => participant.gender === "여")
                          .map((participant) => (
                            <View key={participant.id} style={styles.participantRow}>
                              <Ionicons name="person" size={12} style={styles.female} />
                              <Text
                                style={[
                                  styles.participantText,
                                  styles.female,
                                  participant.name === "" && styles.noName,
                                ]}
                              >
                                {participant.name === "" ? "없음" : participant.department}
                              </Text>
                            </View>
                          ))}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 방 만들기 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* 헤더 */}
            <LinearGradient
              colors={['#947CFF', '#EC75FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.modalHeader}
            >
              <Text style={styles.modalHeaderText}>새로운 미팅방</Text>
            </LinearGradient>

            {/* 본문 */}
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>방 제목</Text>
              <TextInput
                style={styles.input}
                placeholder="예) 즐겁게 놀아요"
                placeholderTextColor="#A0A0A0"
                value={roomTitle}
                onChangeText={setRoomTitle}
              />

              <Text style={styles.presetLabel}>유형 선택</Text>
              <View style={styles.presetContainer}>
                {ROOM_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.label}
                    style={[
                      styles.presetButton,
                      selectedPreset.label === preset.label && styles.presetButtonSelected
                    ]}
                    onPress={() => setSelectedPreset(preset)}
                  >
                    <Ionicons 
                      name={preset.type === 'mixed' ? 'people' : 'male-female'} 
                      size={20} 
                      color={selectedPreset.label === preset.label ? '#FFF' : '#947CFF'} 
                    />
                    <Text style={[
                      styles.presetText,
                      selectedPreset.label === preset.label && styles.presetTextSelected
                    ]}>
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 버튼 그룹 */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>닫기</Text>
              </TouchableOpacity>
              <LinearGradient
                colors={['#947CFF', '#EC75FF']}
                style={styles.createButton}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <TouchableOpacity onPress={handleAddRoom}>
                  <Text style={styles.createButtonText}>
                    <Ionicons name="rocket" size={14} /> 생성하기
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 17,
    alignItems: 'center'
  },
  comment: {
    width: '100%',
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },
  commentText: {
    fontSize:11,
    color: '#3D3D3D'
  },
  guideBox: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
    '#D1D0D0',
    marginBottom: 30,
  },
  guideBoxText: {
    textAlign: 'center',
    color: '#3D3D3D'
  },
  text1: { fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    marginLeft: 5
  },
  meetingContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 5,
    marginBottom: 2,
    color: '#3D3D3D'
  },
  createRoomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8
  },
  createRoomBtnText: {
    fontWeight: '600',
    fontSize: 12
  },
  meetingCard: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 13,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 7,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  peopleCount: {
    fontSize: 10,
    backgroundColor: '#2C2C2C',
    color: '#FFFFFF',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 15,
    marginRight: 5,
  },
  roomStatus: {
    fontSize: 11,
  },
  fullStatus: {
    color: '#FF6666',
  },
  openStatus: {
    color: '#767676',
  },
  participantsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    width: '100%',
  },
  genderRowWrap: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  genderBoxMale: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginRight: 5,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  genderBoxFemale: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginLeft: 5,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  genderLabelMale: {
    fontWeight: '500',
    color: '#767676',
    fontSize: 12,
    marginRight: 8,
    minWidth: 20,
    textAlignVertical: 'center',
  },
  genderLabelFemale: {
    fontWeight: '500',
    color: '#767676',
    fontSize: 12,
    marginRight: 8,
    minWidth: 20,
    textAlignVertical: 'center',
  },
  participantsWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    minWidth: 70 },
  mixedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    minHeight: 60, width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  mixedLabel: {
    fontWeight: '500',
    color: '#767676',
    fontSize: 12,
    minWidth: 28,
    textAlignVertical: 'center',
  },
  mixedParticipantsWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  mixedParticipantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    minWidth: 120,
    marginLeft: 25
  },
  male: {
    color: '#6846FF',
    marginRight: 5
  },
  female: {
    color: '#FF62D5',
    marginRight: 5
  },
  mixedIcon: {
    color: '#FF9800',
    marginRight: 5
  },
  participantText: {
    fontSize: 12
  },
  noName: {
    color: '#767676',
    fontStyle: 'italic'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  modalHeader: {
    padding: 20,
    alignItems: 'center',
  },
  modalHeaderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  modalBody: {
    padding: 25,
  },
  inputLabel: {
    color: '#444',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#EEE',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 25,
    backgroundColor: '#FAFAFA',
  },
  presetLabel: {
    color: '#444',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600',
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EEE',
    gap: 8,
  },
  presetButtonSelected: {
    backgroundColor: '#947CFF',
    borderColor: '#947CFF',
  },
  presetText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  presetTextSelected: {
    color: '#FFF',
  },
  buttonGroup: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelButton: {
    flex: 0.8,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  createButton: {
    flex: 1,
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: '700',
    textAlign: 'center',
    padding: 16,
  },  
});

export default Home;
