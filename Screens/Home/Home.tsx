import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Header from '../../navigation/Header';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MeetingRoom, Participant, Gender, RootStackParamList } from '../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../utils/env';

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
  const toParticipant = (idx: number, gender: Gender, from?: any): Participant => ({
    id: idx,
    name: (from?.name || from?.nickname || '미정'),
    gender,
    department: from?.department || '미정',
    age: Number(from?.age || 0),
    studentId: String(from?.studentId || ''),
    mbti: String(from?.mbti || ''),
    interests: Array.isArray(from?.interests) ? from.interests : [],
  });

  const mapBackendRoomToUI = (raw: any): MeetingRoom => {
    const uiType: 'pair' | 'mixed' = raw?.type === 'MIXED' ? 'mixed' : 'pair';
    const max = Number(raw?.maxParticipants || raw?.capacity || raw?.max || (uiType === 'mixed' ? 6 : 4));
    const current = Number(raw?.currentParticipants || (Array.isArray(raw?.participants) ? raw.participants.length : 0));
    const backendParticipants: any[] = Array.isArray(raw?.participants) ? raw.participants : [];

    if (uiType === 'mixed') {
      const mappedExisting = backendParticipants.map((p, i) => toParticipant(i + 1, (p?.gender === '여' ? '여' : '남'), p));
      const placeholdersNeeded = Math.max(0, max - mappedExisting.length);
      const placeholders = Array.from({ length: placeholdersNeeded }).map((_, i) => toParticipant(1000 + i + 1, '남'));
      return {
        id: (raw?.id as any),
        title: String(raw?.title || ''),
        participants: [...mappedExisting, ...placeholders],
        type: uiType,
        // @ts-ignore: carry through capacity for label
        maxParticipants: max,
      } as any;
    }

    // pair: 남/여 절반씩 가정
    const targetMale = Math.ceil(max / 2);
    const targetFemale = Math.floor(max / 2);
    const existingMale = backendParticipants.filter(p => p?.gender === '남');
    const existingFemale = backendParticipants.filter(p => p?.gender === '여');
    const mappedMale = existingMale.map((p, i) => toParticipant(200 + i + 1, '남', p));
    const mappedFemale = existingFemale.map((p, i) => toParticipant(300 + i + 1, '여', p));
    const malePlaceholders = Array.from({ length: Math.max(0, targetMale - mappedMale.length) }).map((_, i) => toParticipant(400 + i + 1, '남'));
    const femalePlaceholders = Array.from({ length: Math.max(0, targetFemale - mappedFemale.length) }).map((_, i) => toParticipant(500 + i + 1, '여'));
    return {
      id: (raw?.id as any),
      title: String(raw?.title || ''),
      participants: [...mappedMale, ...malePlaceholders, ...mappedFemale, ...femalePlaceholders],
      type: uiType,
      // @ts-ignore
      maxParticipants: max,
      // @ts-ignore
      maleCapacity: targetMale,
      // @ts-ignore
      femaleCapacity: targetFemale,
    } as any;
  };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const token = useSelector((state: RootState) => state.auth.token);
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

  // 목록 새로고침: 여러 엔드포인트 순차 시도
  const refreshRooms = async () => {
    const endpoints = [
      '/api/meetings/available',
      '/api/meetings',
      '/api/meetings/list',
    ];
    for (const ep of endpoints) {
      try {
        console.log('[HOME][LIST] Request → GET', `${API_BASE_URL}${ep}`);
        const res = await fetch(`${API_BASE_URL}${ep}`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        });
        const text = await res.text();
        console.log('[HOME][LIST] Response ←', res.status, text?.slice(0, 400));
        if (!res.ok) continue;
        let data: any = {};
        try { data = JSON.parse(text); } catch {}
        const list = Array.isArray(data)
          ? data
          : (Array.isArray(data?.content)
              ? data.content
              : (Array.isArray(data?.meetingRooms) ? data.meetingRooms : []));
        if (Array.isArray(list)) {
          const mapped = list.map(mapBackendRoomToUI);
          // 최신순으로 정렬 (ID 기준 내림차순 - ID가 클수록 최신)
          const sorted = mapped.sort((a: any, b: any) => {
            // ID 기준으로 내림차순 정렬 (ID가 클수록 최신)
            return (b.id || 0) - (a.id || 0);
          });
          setMeetingRooms(sorted as any);
          return;
        }
      } catch (e) {
        console.warn('[HOME][LIST] Failed on endpoint:', e);
      }
    }
    // 모든 시도가 실패한 경우 기존 목록 유지 (빈 배열로 설정하지 않음)
    console.warn('[HOME][LIST] 모든 엔드포인트 실패, 기존 목록 유지');
  };

  // 초기 로드 및 토큰 변경 시 새로고침
  useEffect(() => {
    setMeetingRooms([]);
    refreshRooms();
  }, [token]);

  // 모달 상태 및 입력값
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [roomTitle, setRoomTitle] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<RoomPreset>(ROOM_PRESETS[0]);

  // 인원수 표시
  const getPeopleLabel = (room: MeetingRoom) => {
    if (room.type === 'mixed') {
      const max = (room as any).maxParticipants || room.participants.length;
      return `${max}인`;
    }
    const maleCap = (room as any).maleCapacity ?? Math.ceil(((room as any).maxParticipants || room.participants.length) / 2);
    const femaleCap = (room as any).femaleCapacity ?? Math.floor(((room as any).maxParticipants || room.participants.length) / 2);
    return `${maleCap}:${femaleCap}`;
  };

  // 방이 다 찼는지(name이 모두 채워졌는지)
  const isRoomFull = (room: MeetingRoom) =>
    room.participants.every((p: Participant) => p.name !== "" && p.name !== "미정");

  // 방 만들기
  const handleCreateRoom = () => {
    setModalVisible(true);
  };

  const handleAddRoom = async () => {
    if (!roomTitle.trim()) return;
    try {
      const payload: any = {
        title: roomTitle.trim(),
        description: '',
        type: (selectedPreset.type === 'mixed' ? 'MIXED' : 'PAIR'),
        maxParticipants: (selectedPreset.male + selectedPreset.female),
      };
      console.log('[MEETING][CREATE] Request → POST', `${API_BASE_URL}/api/meetings/create`, payload);
      const res = await fetch(`${API_BASE_URL}/api/meetings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });
      const resText = await res.text();
      console.log('[MEETING][CREATE] Response ←', res.status, resText?.slice(0, 400));
      if (!res.ok) {
        Alert.alert('오류', resText || '미팅방 생성에 실패했습니다.');
        return;
      }
      // 모달 닫고 초기화
      setModalVisible(false);
      setRoomTitle('');
      setSelectedPreset(ROOM_PRESETS[0]);
      
      // 방 목록 새로고침 (최신순 정렬 포함) - 실패해도 기존 목록 유지
      try {
        await refreshRooms();
      } catch (e) {
        console.warn('방 목록 새로고침 실패, 기존 목록 유지:', e);
      }
    } catch (e: any) {
      console.error('[MEETING][CREATE] Failed:', e?.message || e);
      Alert.alert('오류', e?.message || '네트워크 오류가 발생했습니다.');
    }
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
          <View style={styles.guideHeader}>
            <View style={styles.guideIcon}>
              <Ionicons name="sparkles" size={24} color="#6846FF" />
            </View>
            <Text style={styles.guideTitle}>UniMeet 시작하기</Text>
          </View>
          
          <View style={styles.guideContent}>
            <View style={styles.guideStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>1</Text>
              </View>
              <Text style={styles.stepDescription}>원하는 미팅방을 선택하세요</Text>
            </View>
            
            <View style={styles.guideStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>2</Text>
              </View>
              <Text style={styles.stepDescription}>프로필을 작성하고 신청하세요</Text>
            </View>
            
            <View style={styles.guideStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>3</Text>
              </View>
              <Text style={styles.stepDescription}>새로운 인연을 만나보세요!</Text>
            </View>
          </View>
          
          <View style={styles.guideFooter}>
            <Ionicons name="heart" size={16} color="#FF6B81" />
            <Text style={styles.guideFooterText}>지금 시작해보세요</Text>
            <Ionicons name="heart" size={16} color="#FF6B81" />
          </View>
          
          <TouchableOpacity style={styles.aiMatchingBtn} onPress={() => navigation.navigate('AIMatching')}>
            <View style={styles.aiIconContainer}>
              <Ionicons name="analytics" size={20} color="#FFF" />
            </View>
            <Text style={styles.aiMatchingText}>AI 매칭 분석</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" />
          </TouchableOpacity>
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

        {Array.isArray(meetingRooms) ? meetingRooms.map((room) => {
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
                    <View style={styles.mixedGrid}>
                      {room.participants.map((participant) => (
                        <View key={participant.id} style={[styles.gridCell, participant.name === '' || participant.name === '미정' ? styles.gridCellEmpty : null]}>
                          <Ionicons name="person" size={14} style={[styles.mixedIcon, participant.name === '' || participant.name === '미정' ? { opacity: 0.4 } : null]} />
                          <Text style={[styles.gridCellText, participant.name === '' || participant.name === '미정' ? styles.emptyText : null]}>
                            {participant.name === '' || participant.name === '미정' ? '빈 자리' : (participant.department || participant.name)}
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
                            participant.name === "" || participant.name === "미정" ? (
                              <View key={`empty-m-${participant.id}`} style={[styles.participantRow, styles.emptySlot]}>
                                <Ionicons name="person" size={12} style={[styles.male, { opacity: 0.4 }]} />
                                <Text style={[styles.participantText, styles.emptyText]}>빈 자리</Text>
                              </View>
                            ) : (
                              <View key={participant.id} style={styles.participantRow}>
                                <Ionicons name="person" size={12} style={styles.male} />
                                <Text style={[styles.participantText, styles.male]}>
                                  {participant.department || participant.name}
                                </Text>
                              </View>
                            )
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
                            participant.name === "" || participant.name === "미정" ? (
                              <View key={`empty-f-${participant.id}`} style={[styles.participantRow, styles.emptySlot]}>
                                <Ionicons name="person" size={12} style={[styles.female, { opacity: 0.4 }]} />
                                <Text style={[styles.participantText, styles.emptyText]}>빈 자리</Text>
                              </View>
                            ) : (
                              <View key={participant.id} style={styles.participantRow}>
                                <Ionicons name="person" size={12} style={styles.female} />
                                <Text style={[styles.participantText, styles.female]}>
                                  {participant.department || participant.name}
                                </Text>
                              </View>
                            )
                          ))}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }) : null}
      </ScrollView>

      {/* 방 만들기 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            {/* 핸들 바 */}
            <View style={styles.modalHandle} />
            
            {/* 헤더 */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <Ionicons name="add-circle" size={28} color="#6846FF" />
                <Text style={styles.modalHeaderText}>새로운 미팅방 만들기</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            {/* 본문 - ScrollView로 감싸기 */}
            <ScrollView 
              style={styles.modalBodyWrapper}
              contentContainerStyle={styles.modalBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>
                  <Ionicons name="text" size={16} color="#6846FF" /> 방 제목
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="어떤 미팅을 만들까요? (예: React 스터디, 축구 같이 해요)"
                  placeholderTextColor="#A0A0A0"
                  value={roomTitle}
                  onChangeText={setRoomTitle}
                  multiline={true}
                  maxLength={100}
                />
                <Text style={styles.charCount}>{roomTitle.length}/100</Text>
              </View>

              <View style={styles.presetSection}>
                <Text style={styles.presetLabel}>
                  <Ionicons name="people" size={16} color="#6846FF" /> 미팅 유형 선택
                </Text>
                <Text style={styles.presetDescription}>참여하고 싶은 미팅 스타일을 선택해주세요</Text>
                
                <View style={styles.presetContainer}>
                  {ROOM_PRESETS.map((preset) => (
                    <TouchableOpacity
                      key={preset.label}
                      style={[
                        styles.presetButton,
                        selectedPreset.label === preset.label && styles.presetButtonSelected
                      ]}
                      onPress={() => setSelectedPreset(preset)}
                      activeOpacity={0.8}
                    >
                      <View style={[
                        styles.presetIconContainer,
                        selectedPreset.label === preset.label && styles.presetIconContainerSelected
                      ]}>
                        <Ionicons 
                          name={preset.type === 'mixed' ? 'people' : 'heart'} 
                          size={24} 
                          color={selectedPreset.label === preset.label ? '#FFF' : '#6846FF'} 
                        />
                      </View>
                      <View style={styles.presetTextContainer}>
                        <Text style={[
                          styles.presetText,
                          selectedPreset.label === preset.label && styles.presetTextSelected
                        ]}>
                          {preset.label}
                        </Text>
                        <Text style={[
                          styles.presetSubText,
                          selectedPreset.label === preset.label && styles.presetSubTextSelected
                        ]}>
                          {preset.type === 'mixed' ? '성별무관' : '남녀매칭'}
                        </Text>
                      </View>
                      {selectedPreset.label === preset.label && (
                        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* 버튼 그룹 */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.createButton,
                  !roomTitle.trim() && styles.createButtonDisabled
                ]}
                onPress={handleAddRoom}
                disabled={!roomTitle.trim()}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={roomTitle.trim() ? ['#6846FF', '#9C27B0'] : ['#CCC', '#999']}
                  style={styles.createButtonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Ionicons name="rocket" size={18} color="#FFF" />
                  <Text style={styles.createButtonText}>미팅방 생성</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#6846FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(104, 70, 255, 0.1)',
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  guideIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(104, 70, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  guideContent: {
    marginBottom: 16,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6846FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  guideFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 129, 0.1)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  guideFooterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B81',
    marginHorizontal: 8,
  },
  aiMatchingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6846FF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 16,
    shadowColor: '#6846FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiMatchingText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
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
    color: '#FF9800',
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
  mixedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  gridCell: {
    width: '48%',
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridCellEmpty: {
    backgroundColor: 'transparent',
  },
  gridCellText: {
    fontSize: 12,
    color: '#333',
  },
  emptySlot: {
    opacity: 0.7,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    flex: 1,
    marginTop: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalHeaderText: {
    color: '#333',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
  },
  modalBodyWrapper: {
    flex: 1,
  },
  modalBody: {
    padding: 24,
    paddingBottom: 20,
  },
  inputSection: {
    marginBottom: 28,
  },
  inputLabel: {
    color: '#333',
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    minHeight: 60,
    textAlignVertical: 'top',
    color: '#333',
  },
  charCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  presetSection: {
    marginBottom: 20,
  },
  presetLabel: {
    color: '#333',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  presetContainer: {
    gap: 12,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: '#FAFAFA',
    shadowColor: '#6846FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  presetButtonSelected: {
    backgroundColor: '#6846FF',
    borderColor: '#6846FF',
    shadowOpacity: 0.2,
    elevation: 8,
  },
  presetIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(104, 70, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  presetIconContainerSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  presetTextContainer: {
    flex: 1,
  },
  presetText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  presetTextSelected: {
    color: '#FFF',
  },
  presetSubText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  presetSubTextSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  buttonGroup: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: '#FFF',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  createButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },  
});

export default Home;
