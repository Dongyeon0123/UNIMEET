import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../utils/env';

const { width } = Dimensions.get('window');

const ParticipantInfo: React.FC<{ p: any; color: string; index: number }> = ({ p, color, index }) => (
  <View style={styles.participantCard}>
    <View style={[styles.statusIndicator, { backgroundColor: p.isOnline ? '#4CAF50' : '#FFC107' }]} />
    
    <View style={styles.leftSection}>
      <View style={[styles.avatarContainer, { borderColor: (p.department && p.department !== '미정') ? color : '#999' }]}>
        <Ionicons name="person" size={20} color={(p.department && p.department !== '미정') ? color : '#999'} />
      </View>
      <View style={styles.basicInfo}>
        <Text style={[styles.participantDepartment, { color: (p.department && p.department !== '미정') ? color : '#999' }]} numberOfLines={1} ellipsizeMode="tail">
          {p.department || '미정'}
        </Text>
        <Text style={[styles.mbtiText, { backgroundColor: color + '20', color: color }]}>
          {p.mbti || 'UNKNOWN'}
        </Text>
      </View>
    </View>
    
    <View style={styles.rightSection}>
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={12} color="#666" />
          <Text style={styles.detailValue}>{p.age || '-'}세</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="school-outline" size={12} color="#666" />
          <Text style={styles.detailValue}>{p.studentId?.slice(-2) || '-'}</Text>
        </View>
      </View>
      
      <View style={styles.interestsContainer}>
        <Text style={styles.interestsText} numberOfLines={2} ellipsizeMode="tail">
          {p.interests?.length ? p.interests.join(' • ') : '관심사 없음'}
        </Text>
      </View>
    </View>
  </View>
);

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
  const [room, setRoom] = useState(route.params.room);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/meetings/${room.id}`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        });
        if (res.ok) {
          const data = await res.json();
          setRoom(data);
        }
      } catch (e) {}
    };
    loadDetail();
  }, [room.id, token]);

  const maleList = room.participants.filter(p => p.gender === '남');
  const femaleList = room.participants.filter(p => p.gender === '여');
  const isMixed = room.type === 'mixed';
  
  // 방 타입에 따른 최대 인원수 계산
  const getMaxParticipants = () => {
    const currentTotal = room.participants.length;
    const maleCount = maleList.length;
    const femaleCount = femaleList.length;
    
    if (isMixed) {
      // 혼성방: 4명 또는 6명
      if (currentTotal <= 4) return 4;
      return 6;
    } else {
      // 일반방: 남녀 비율을 맞춰야 함
      if (maleCount === 1 && femaleCount === 1) return 2; // 1:1
      if (maleCount <= 2 && femaleCount <= 2) return 4; // 2:2
      return 6; // 3:3
    }
  };
  
  const maxParticipants = getMaxParticipants();
  
  // 실제로 신청을 받을 수 있는지 판단
  const canApply = room.participants.length < maxParticipants;
  const isFull = !canApply;
  
  // 디버깅용
  console.log('방 타입:', isMixed ? '혼성' : '일반');
  console.log('현재 참가자 수:', room.participants.length);
  console.log('남자:', maleList.length, '여자:', femaleList.length);
  console.log('최대 참가자 수:', maxParticipants);
  console.log('인원이 다 찼나:', isFull);

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
          {isFull ? (
            <TouchableOpacity style={styles.fullButton} disabled>
              <Ionicons name="people" size={20} color="#999" />
              <Text style={styles.fullButtonText}>인원이 다 찼어요 ({room.participants.length}/{maxParticipants})</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.applyButton}
              onPress={async () => {
                try {
                  await fetch(`${API_BASE_URL}/api/meetings/${room.id}/apply`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': token ? `Bearer ${token}` : '',
                    },
                  });
                  // 성공 시 상세 재로딩
                  const res = await fetch(`${API_BASE_URL}/api/meetings/${room.id}`, {
                    headers: { 'Authorization': token ? `Bearer ${token}` : '' },
                  });
                  if (res.ok) {
                    const data = await res.json();
                    setRoom(data);
                  }
                } catch (e) {}
              }}
            >
              <Ionicons name="add-circle" size={20} color="#FFF" />
              <Text style={styles.applyButtonText}>미팅 신청하기 ({room.participants.length}/{maxParticipants})</Text>
            </TouchableOpacity>
          )}
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
