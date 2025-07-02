import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 참가자 정보 카드 컴포넌트
const ParticipantInfo: React.FC<{ p: any; color: string }> = ({ p, color }) => (
  <View style={styles.participantCard}>
    <Ionicons
      name="person-circle"
      size={16}
      color={color}
      style={styles.cardIcon}
    />
    <View style={styles.departmentBox}>
      <Text style={[styles.participantDepartment, { color }]} numberOfLines={1} ellipsizeMode="tail">
        {p.department || ''}
      </Text>
    </View>
    <View style={styles.detailsBox}>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>나이</Text>
        <Text style={styles.detailText}>{p.age || '-'}</Text>
      </View>
      <View style={styles.detailDivider} />
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>학번</Text>
        <Text style={styles.detailText}>{p.studentId || '-'}</Text>
      </View>
      <View style={styles.detailDivider} />
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>MBTI</Text>
        <Text style={styles.detailText}>{p.mbti || '-'}</Text>
      </View>
      <View style={styles.detailDivider} />
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>관심사</Text>
        <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
          {p.interests?.length ? p.interests.join(', ') : '-'}
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
  const { room } = route.params;

  const maleList = room.participants.filter(p => p.gender === '남');
  const femaleList = room.participants.filter(p => p.gender === '여');
  const isMixed = room.type === 'mixed';

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

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.comment}>
          <Ionicons name="rocket-outline" size={12} color="#3D3D3D" style={styles.icon} />
          <Text style={styles.commentText}>모든 멤버가 참가 상태이면 정식 채팅방이 시작됩니다.</Text>
        </View>

        <View>
          <Text style={styles.mainTitle}>{room.title}</Text>
        </View>

        {isMixed ? (
          <ScrollView>
            {chunkArray(room.participants, 3).map((row, rowIdx) => (
              <ScrollView
                key={rowIdx}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {row.map(p => (
                  <View key={p.id} style={styles.participantCardWrapper}>
                    <ParticipantInfo p={p} color={getColor(p)} />
                  </View>
                ))}
              </ScrollView>
            ))}
          </ScrollView>
        ) : (
          <>
            <Text style={styles.groupLabel}>남자그룹</Text>
            <View style={styles.participantGroupBox}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {maleList.map(p => (
                  <View key={p.id} style={styles.participantCardWrapper}>
                    <ParticipantInfo p={p} color={getColor(p)} />
                  </View>
                ))}
              </ScrollView>
            </View>
            <Text style={styles.groupLabel}>여자그룹</Text>
            <View style={styles.participantGroupBox}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {femaleList.map(p => (
                  <View key={p.id} style={styles.participantCardWrapper}>
                    <ParticipantInfo p={p} color={getColor(p)} />
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}
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
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    elevation: 4,
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 18,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -2,
    marginBottom: 10,
    marginLeft: 6,
  },
  participantGroupBox: {
    marginBottom: 24,
    alignItems: 'flex-start',
    flex: 1,
  },
  horizontalScroll: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 4,
  },
  participantCardWrapper: {
    marginRight: 18,
    marginBottom: 20,
  },
  participantCard: {
    width: 130,
    minHeight: 185,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: '#B092FF',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  cardIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  departmentBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  participantDepartment: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    letterSpacing: 0.5,
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F8F5FF',
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#8B7E74',
    fontWeight: 'bold',
    width: 42,
  },
  detailText: {
    fontSize: 11,
    color: '#444',
    flex: 1,
    textAlign: 'right',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E5C7A0',
    marginVertical: 5,
    opacity: 0.7,
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
});

export default RoomDetail;
