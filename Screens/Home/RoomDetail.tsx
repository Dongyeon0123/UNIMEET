import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../utils/env';

const { width } = Dimensions.get('window');

const ParticipantInfo: React.FC<{ p: any; color: string; index: number }> = ({ p, color, index }) => {
  const isEmptySlot = !p.name || p.name === '' || p.name === '미정';
  const displayColor = isEmptySlot ? '#999' : color;
  const displayDepartment = isEmptySlot ? '빈 자리' : (p.department || '미정');
  const displayMBTI = isEmptySlot ? 'UNKNOWN' : (p.mbti || 'UNKNOWN');
  const displayAge = isEmptySlot ? '-' : (p.age || '-');
  const displayStudentId = isEmptySlot ? '-' : (p.studentId?.slice(-2) || '-');
  const displayInterests = isEmptySlot ? '관심사 없음' : (p.interests?.length ? p.interests.join(' • ') : '관심사 없음');

  return (
    <View style={[styles.participantCard, isEmptySlot && styles.emptyParticipantCard]}>
      <View style={[styles.statusIndicator, { backgroundColor: isEmptySlot ? 'transparent' : (p.isOnline ? '#4CAF50' : '#FFC107') }]} />
      
      <View style={styles.leftSection}>
        <View style={[styles.avatarContainer, { borderColor: displayColor }]}>
          <Ionicons name="person" size={20} color={displayColor} style={isEmptySlot && { opacity: 0.4 }} />
        </View>
        <View style={[styles.basicInfo, isEmptySlot && { alignItems: 'flex-start', width: '100%' }]}>
          <Text style={[styles.participantDepartment, { color: displayColor }]} numberOfLines={1} ellipsizeMode="tail">
            {displayDepartment}
          </Text>
          <Text style={[
            styles.mbtiText, 
            { 
              backgroundColor: displayColor + '20', 
              color: displayColor,
              marginLeft: isEmptySlot ? 0 : 0,
              textAlign: isEmptySlot ? 'left' : 'left'
            }
          ]}>
            {displayMBTI}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={12} color="#666" />
            <Text style={styles.detailValue}>{displayAge}세</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="school-outline" size={12} color="#666" />
            <Text style={styles.detailValue}>{displayStudentId}</Text>
          </View>
        </View>
        
        <View style={styles.interestsContainer}>
          <Text style={styles.interestsText} numberOfLines={2} ellipsizeMode="tail">
            {displayInterests}
          </Text>
        </View>
      </View>
    </View>
  );
};

// 3개씩 끊어서 2차원 배열로 변환
function chunkArray(arr: any[], size: number) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

const RoomDetail: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RoomDetail'>>();
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const currentUserGender = useSelector((state: RootState) => state.auth.user?.gender) as string | undefined;
  const [room, setRoom] = useState(route.params.room);
  const [actualParticipants, setActualParticipants] = useState<any[]>([]);

  // 미팅 성립 확인 및 채팅방 생성 함수
  const checkAndCreateChatRoom = async (roomData: any, participants: any[]) => {
    try {
      const maxParticipants = roomData.maxParticipants || roomData.capacity || roomData.max;
      const currentParticipants = participants.length;
      
      console.log('미팅 성립 확인:', {
        currentParticipants,
        maxParticipants,
        isFull: currentParticipants >= maxParticipants
      });
      
      // 미팅이 성립되었는지 확인 (정원이 다 찼는지)
      if (currentParticipants >= maxParticipants) {
        console.log('미팅 성립! 채팅방 생성 시도...', { currentParticipants, maxParticipants });
        
        // 모든 참가자의 userId 추출
        const userIds = participants.map(p => p.userId).filter(id => id);
        
        if (userIds.length >= 2) {
          console.log('채팅방 생성 참가자:', userIds);
          
          let chatRes;
          
          // 1:1 미팅인 경우
          if (maxParticipants === 2 && userIds.length === 2) {
            console.log('1:1 채팅방 생성 API 호출');
            console.log('전달할 채팅방 이름:', roomData.title);
            console.log('미팅방 데이터:', roomData);
            
            const requestBody = {
              userAId: userIds[0],
              userBId: userIds[1],
              name: roomData.title // 미팅방 제목을 채팅방 이름으로 전달
            };
            console.log('1:1 채팅방 생성 요청 body:', requestBody);
            
            chatRes = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
              },
              body: JSON.stringify(requestBody),
            });
          } else {
            // 그룹 미팅인 경우 (2:2, 3:3 등)
            console.log('그룹 채팅방 생성 API 호출');
            console.log('전달할 채팅방 제목:', roomData.title);
            console.log('미팅방 데이터:', roomData);
            
            const requestBody = {
              title: roomData.title,
              participantIds: userIds
            };
            console.log('그룹 채팅방 생성 요청 body:', requestBody);
            
            chatRes = await fetch(`${API_BASE_URL}/api/chat/rooms/group`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
              },
              body: JSON.stringify(requestBody),
            });
          }
          
          if (chatRes.ok) {
            const chatData = await chatRes.json();
            console.log('채팅방 생성 성공:', chatData);
            
            Alert.alert(
              '미팅 성립!', 
              '모든 참가자가 모였습니다. 채팅방이 생성되었습니다.',
              [
                { text: '채팅방으로 이동', onPress: () => navigation.navigate('ChatRoom', { roomId: chatData.roomId || chatData.id }) },
                { text: '나중에', style: 'cancel' }
              ]
            );
          } else {
            const errorText = await chatRes.text();
            console.warn('채팅방 생성 실패:', errorText);
            
            // 500 에러인 경우 서버 문제임을 알림
            if (chatRes.status === 500) {
              Alert.alert(
                '채팅방 생성 실패', 
                '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
              );
            }
          }
        } else {
          console.warn('참가자가 2명 미만이어서 채팅방을 생성할 수 없습니다:', userIds.length);
        }
      }
    } catch (error) {
      console.error('채팅방 생성 중 오류:', error);
    }
  };

  const normalizeRoom = (raw: any) => {
    if (!raw) return route.params.room;
    const uiType = raw?.type === 'MIXED' ? 'mixed' : (raw?.type === 'PAIR' ? 'pair' : (raw?.type || route.params.room.type));
    const backendParticipants: any[] = Array.isArray(raw?.participants) ? raw.participants : (Array.isArray(raw?.participants?.items) ? raw.participants.items : []);
    const current = Number(raw?.currentParticipants || backendParticipants.length || 0);
    const max = Number(raw?.maxParticipants || raw?.capacity || raw?.max || 0);

    // 기본 max 추정: 없으면 타입 기준으로 보수적으로 채움
    let targetMax = max > 0 ? max : (uiType === 'mixed' ? (current <= 4 ? 4 : 6) : (current <= 2 ? 2 : (current <= 4 ? 4 : 6)));

    const toP = (idx: number, gender: '남' | '여', from?: any) => ({
      id: idx,
      name: (from?.name || from?.nickname || ''),
      gender,
      department: from?.department || '',
      age: Number(from?.age || 0),
      studentId: String(from?.studentId || ''),
      mbti: String(from?.mbti || ''),
      interests: Array.isArray(from?.interests) ? from.interests : [],
    });

    let participants: any[] = [];
    if (uiType === 'mixed') {
      const mapped = backendParticipants.map((p, i) => toP(100 + i + 1, (p?.gender === '여' ? '여' : '남'), p));
      const placeholders = Array.from({ length: Math.max(0, targetMax - mapped.length) }).map((_, i) => toP(1000 + i + 1, '남'));
      participants = [...mapped, ...placeholders];
    } else {
      const existingMale = backendParticipants.filter(p => p?.gender === '남');
      const existingFemale = backendParticipants.filter(p => p?.gender === '여');
      const targetMale = Math.ceil(targetMax / 2);
      const targetFemale = Math.floor(targetMax / 2);
      const males = existingMale.map((p, i) => toP(200 + i + 1, '남', p));
      const females = existingFemale.map((p, i) => toP(300 + i + 1, '여', p));
      const malePlaceholders = Array.from({ length: Math.max(0, targetMale - males.length) }).map((_, i) => toP(400 + i + 1, '남'));
      const femalePlaceholders = Array.from({ length: Math.max(0, targetFemale - females.length) }).map((_, i) => toP(500 + i + 1, '여'));
      participants = [...males, ...malePlaceholders, ...females, ...femalePlaceholders];
    }

    return {
      ...route.params.room,
      id: raw?.id || route.params.room.id,
      title: raw?.title || route.params.room.title,
      type: uiType,
      participants,
      backendParticipants, // 백엔드 참가자 데이터 저장
    } as any;
  };

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/meetings/${room.id}`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        });
        if (res.ok) {
          const data = await res.json();
          const normalized = normalizeRoom(data);
          setRoom(normalized);
          
          // 실제 참가자 데이터 저장 (성별 제한 확인용)
          const backendParticipants: any[] = Array.isArray(data?.participants) ? data.participants : (Array.isArray(data?.participants?.items) ? data.participants.items : []);
          console.log('백엔드 참가자 데이터:', backendParticipants);
          setActualParticipants(backendParticipants);
        }
      } catch (e) {}
    };
    loadDetail();
  }, [room.id, token]);

  // 실제 참가자만 필터링 (백엔드 데이터 기준)
  const confirmed = room.participants.filter(p => p.name && p.name !== '' && p.name !== '미정' && p.id < 1000);
  const maleList = room.participants.filter(p => p.gender === '남');
  const femaleList = room.participants.filter(p => p.gender === '여');
  const isMixed = room.type === 'mixed';
  
  // 방 타입에 따른 최대 인원수 계산
  const getMaxParticipants = () => {
    const backendMax = (room as any).maxParticipants || (room as any).capacity || (room as any).max;
    if (backendMax) return Number(backendMax);
    if (isMixed) return 6; // 기본 6
    // pair 기본 4 (2:2)로 보수적 가정
    return 4;
  };
  
  const maxParticipants = getMaxParticipants();
  
  // 실제로 신청을 받을 수 있는지 판단
  const canApply = confirmed.length < maxParticipants;
  const isFull = !canApply;
  
  // 디버깅용
  console.log('방 타입:', isMixed ? '혼성' : '일반');
  console.log('현재 참가자 수:', room.participants.length);
  console.log('남자:', maleList.length, '여자:', femaleList.length);
  console.log('최대 참가자 수:', maxParticipants);
  console.log('인원이 다 찼나:', isFull);
  // 실제 백엔드 데이터로 성별 제한 로그 출력
  const backendParticipants = (room as any).backendParticipants || actualParticipants;
  const actualMaleCount = backendParticipants.filter((p: any) => p.gender === '남').length;
  const actualFemaleCount = backendParticipants.filter((p: any) => p.gender === '여').length;
  console.log('1:1 미팅 성별 제한:', !isMixed ? `남자 ${actualMaleCount}/1, 여자 ${actualFemaleCount}/1` : '해당없음');

  // 색상 결정 함수
  const getColor = (p: any) => {
    if (isMixed) return '#FF9800'; // 혼성방은 주황
    if (p.gender === '여') return '#FF62D5'; // 여자 핑크
    return '#6846FF'; // 남자 보라
  };

  return (
    <LinearGradient
      colors={['#FF87DD', '#B092FF', '#DBD6EC', '#F0F0E9']}
      locations={[0, 0.43, 0.71, 0.93]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.35 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideButton}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Meeting Room</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 안내 메시지 */}
        <View style={styles.comment}>
          <Ionicons name="rocket-outline" size={12} color="#3D3D3D" style={styles.icon} />
          <Text style={styles.commentText}>모든 멤버가 참가 상태이면 정식 채팅방이 시작됩니다.</Text>
        </View>

        {/* 방 제목 및 정보 */}
        <View style={styles.roomHeader}>
          <Text style={styles.roomTitle}>{room.title}</Text>
          <View style={styles.roomStats}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={14} color="#666" />
              <Text style={styles.statText}>{room.participants.length}명</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="time" size={14} color="#666" />
              <Text style={styles.statText}>진행중</Text>
            </View>
          </View>
        </View>

        {isMixed ? (
          <View>
            {room.participants.map((p, index) => (
              <View key={p.id} style={styles.participantCardWrapper}>
                <ParticipantInfo p={p} color={getColor(p)} index={index} />
              </View>
            ))}
          </View>
        ) : (
          <>
            <View style={styles.groupHeader}>
              <View style={[styles.groupIcon, { backgroundColor: '#6846FF20' }]}>
                <Ionicons name="male" size={16} color="#6846FF" />
              </View>
              <Text style={styles.groupLabel}>남자그룹</Text>
              <Text style={styles.groupCount}>{maleList.length}명</Text>
            </View>
            <View style={styles.participantGroupBox}>
              {maleList.map((p, index) => (
                <View key={p.id} style={styles.participantCardWrapper}>
                  <ParticipantInfo p={p} color={getColor(p)} index={index} />
                </View>
              ))}
            </View>
            <View style={styles.groupHeader}>
              <View style={[styles.groupIcon, { backgroundColor: '#FF62D520' }]}>
                <Ionicons name="female" size={16} color="#FF62D5" />
              </View>
              <Text style={styles.groupLabel}>여자그룹</Text>
              <Text style={styles.groupCount}>{femaleList.length}명</Text>
            </View>
            <View style={styles.participantGroupBox}>
              {femaleList.map((p, index) => (
                <View key={p.id} style={styles.participantCardWrapper}>
                  <ParticipantInfo p={p} color={getColor(p)} index={index} />
                </View>
              ))}
            </View>
          </>
        )}
        
        {/* 신청 버튼 */}
        <View style={styles.buttonContainer}>
          {(() => {
            const alreadyJoined = currentUserId ? confirmed.some((p: any) => p.userId === currentUserId) : false;
            
            if (alreadyJoined) {
              return (
                <TouchableOpacity style={styles.fullButton} disabled>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={[styles.fullButtonText, { color: '#4CAF50' }]}>신청되었습니다!</Text>
                </TouchableOpacity>
              );
            }
            
            // 1:1 미팅에서 성별 제한 확인
            if (!isMixed && currentUserGender) {
              // 실제 참가자만 확인 (백엔드 데이터 기준)
              // room 객체에서 직접 백엔드 데이터를 가져와서 사용
              const backendParticipants = (room as any).backendParticipants || actualParticipants;
              const actualMaleCount = backendParticipants.filter((p: any) => p.gender === '남').length;
              const actualFemaleCount = backendParticipants.filter((p: any) => p.gender === '여').length;
              const currentGenderCount = currentUserGender === '남' ? actualMaleCount : actualFemaleCount;
              
              // 1:1 미팅에서는 각 성별당 1명씩만 허용
              const maxForGender = 1;
              
              console.log('성별 제한 확인:', {
                currentUserGender,
                actualMaleCount,
                actualFemaleCount,
                currentGenderCount,
                maxForGender,
                maxParticipants,
                backendParticipants: backendParticipants.map((p: any) => ({ name: p.name, gender: p.gender })),
                backendParticipantsLength: backendParticipants.length
              });
              
              if (currentGenderCount >= maxForGender) {
                return (
                  <TouchableOpacity style={styles.fullButton} disabled>
                    <Ionicons name="person" size={20} color="#999" />
                    <Text style={styles.fullButtonText}>
                      {currentUserGender === '남' ? '남자' : '여자'} 정원이 다 찼어요 ({currentGenderCount}/{maxForGender})
                    </Text>
                  </TouchableOpacity>
                );
              }
            }
            
            if (isFull) {
              return (
                <TouchableOpacity style={styles.fullButton} disabled>
                  <Ionicons name="people" size={20} color="#999" />
                  <Text style={styles.fullButtonText}>인원이 다 찼어요 ({confirmed.length}/{maxParticipants})</Text>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                style={styles.applyButton}
                onPress={async () => {
                  try {
                    const resJoin = await fetch(`${API_BASE_URL}/api/meetings/${room.id}/join`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '',
                      },
                    });
                    if (resJoin.ok) {
                      Alert.alert('신청 완료', '미팅 신청이 완료되었습니다.');
                      // 신청 성공 후 방 정보 즉시 새로고침
                      const res = await fetch(`${API_BASE_URL}/api/meetings/${room.id}`, {
                        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
                      });
                      if (res.ok) {
                        const data = await res.json();
                        const normalized = normalizeRoom(data);
                        setRoom(normalized);
                        
                        // 실제 참가자 데이터도 업데이트
                        const backendParticipants: any[] = Array.isArray(data?.participants) ? data.participants : (Array.isArray(data?.participants?.items) ? data.participants.items : []);
                        setActualParticipants(backendParticipants);
                        console.log('방 정보 새로고침 완료:', normalized);
                        
                        // 미팅 성립 확인 및 채팅방 생성
                        await checkAndCreateChatRoom(data, backendParticipants);
                      }
                    } else {
                      const errorText = await resJoin.text();
                      Alert.alert('신청 실패', errorText || '미팅 신청에 실패했습니다.');
                    }
                  } catch (e) {}
                }}
              >
                <Ionicons name="add-circle" size={20} color="#FFF" />
                <Text style={styles.applyButtonText}>미팅 신청하기 ({confirmed.length}/{maxParticipants})</Text>
              </TouchableOpacity>
            );
          })()}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 18,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    elevation: 4,
  },
  content: {
    paddingTop: 5,
    paddingHorizontal: 20,
    paddingBottom: 140,
    flexGrow: 1,
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
    fontSize: 11,
    color: '#3D3D3D'
  },
  icon: {
    marginRight: 5,
    marginBottom: 2,
    color: '#3D3D3D'
  },
  // 방 헤더 스타일
  roomHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  roomTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  roomStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#DDD',
    marginHorizontal: 12,
  },
  // 그룹 헤더 스타일
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  groupCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: '600',
  },
  participantGroupBox: {
    marginBottom: 28,
    alignItems: 'flex-start',
    flex: 1,
  },
  horizontalScroll: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 8,
  },
  participantCardWrapper: {
    marginBottom: 12,
  },
  // 가로형 참가자 카드 스타일
  participantCard: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#B092FF',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  emptyParticipantCard: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.7,
  },
  statusIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FF',
    marginRight: 12,
  },
  basicInfo: {
    flex: 1,
  },
  participantDepartment: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  mbtiText: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  rightSection: {
    flex: 1,
    paddingLeft: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  interestsContainer: {
    marginTop: 4,
  },
  interestsText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  sideButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  // 버튼 컨테이너 및 버튼 스타일
  buttonContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  applyButton: {
    backgroundColor: '#434343',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6846FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  fullButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fullButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default RoomDetail;
