import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import GradientScreen from '../../component/GradientScreen';
import { API_BASE_URL } from '../../utils/env';
import { updateProfile } from '../../store/profileSlice';

const ProfileDetail: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);
  const token = useSelector((state: RootState) => state.auth.token);

  // 현재 프로필 상태 로그
  console.log('[PROFILE] 현재 프로필 상태:', profile);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.log('[PROFILE] 토큰이 없습니다.');
        return;
      }

      console.log('[PROFILE] 프로필 정보 요청:', `${API_BASE_URL}/api/user/profile`);
      
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('[PROFILE] 응답 상태:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('[PROFILE] 프로필 데이터 받음:', data);
          
          // 나이 계산 함수
          const calculateAge = (birthDate: string) => {
            if (!birthDate) return '';
            try {
              const birth = new Date(birthDate);
              const today = new Date();
              let age = today.getFullYear() - birth.getFullYear();
              const monthDiff = today.getMonth() - birth.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
              }
              return String(age);
            } catch {
              return '';
            }
          };
          
          const birthDate = data.birth || data.birthDate || data.birthday;
          const calculatedAge = data.age ? String(data.age) : calculateAge(birthDate);
          
          // 백엔드 데이터를 프론트엔드 형식으로 매핑
          const mappedData = {
            id: data.id || data.userId,
            name: data.name,
            nickname: data.nickname,
            email: data.email,
            phone: data.phone || data.phoneNumber,
            birth: birthDate,
            department: data.department || data.major,
            studentId: data.studentId,
            age: calculatedAge,
            height: data.height ? String(data.height) : '',
            joinDate: data.joinDate || data.createdAt || data.registeredAt,
            mbti: data.mbti,
            interests: data.interests || [],
            gender: data.gender,
            prefer: data.prefer || data.Prefer,
            nonPrefer: data.nonPrefer,
          };
          
          console.log('[PROFILE] 매핑된 프로필 데이터:', mappedData);
          dispatch(updateProfile(mappedData));
        } else {
          const errorText = await res.text();
          console.error('[PROFILE] 프로필 요청 실패:', res.status, errorText);
        }
      } catch (e) {
        console.error('[PROFILE] 네트워크 오류:', e);
      }
    };
    fetchProfile();
  }, [dispatch, token]);

  const myInfoList: {
    label: string;
    value: string;
    }[] = [
      { label: '이름', value: profile.name || '미입력' },
      { label: '닉네임', value: profile.nickname || '미입력' },
      { label: '이메일', value: profile.email || '미입력' },
      { label: '전화번호', value: profile.phone || '미입력' },
      { label: '사용자 ID', value: profile.id || '미입력' },
      // 백엔드에서 아직 제공하지 않는 필드들
      { label: '생년월일', value: profile.birth || '미입력' },
      { label: '학과', value: profile.department || '미입력' },
      { label: '학번', value: profile.studentId || '미입력' },
      { label: '나이', value: profile.age || '미입력' },
      { label: '키', value: profile.height || '미입력' },
      { label: '가입일', value: profile.joinDate || '미입력' },
    ];

  return (
    <GradientScreen>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideButton}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleBox}>
          <Text style={styles.title}>나의 프로필 상세 정보</Text>
        </View>
        <TouchableOpacity onPress={() => (navigation as any).navigate('ProfileEdit')} style={styles.sideButton}>
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={require('../../img/Profile.jpg')} style={styles.image} />

        <View style={styles.myInfo}>
          {myInfoList.map((item, idx) => (
            <React.Fragment key={item.label}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
              {idx < myInfoList.length - 1 && <View style={styles.underline} />}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.interests}>
          <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
            <Text style={styles.infoIsLabel}>MBTI</Text>
            <Text style={styles.infoMBTI}>{profile.mbti}</Text>
          </View>

          <View style={styles.underline} />
            <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                <Text style={styles.infoIsLabel}>관심사</Text>
                <View style={styles.interestTags}>
                  {profile.interests.map((item, i) => (
                    <Text key={i} style={styles.infoInterest}>
                      {item}
                    </Text>
                  ))}
                </View>
            </View>
        </View>
      </ScrollView>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 48,
    position: 'relative',
    marginTop: 60,
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
  titleBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'none', // 버튼 클릭 방해 방지
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    elevation: 4, // Android
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  myInfo: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 20,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    width: 180,
  },
  infoValue: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
    flex: 1,
  },
  underline: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  interests: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  infoIsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 3,
  },
  infoMBTI: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    backgroundColor: 'skyblue',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginRight: 100,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '75%',
    marginLeft: 8,
  },
  infoInterest: {
    fontSize: 12,
    color: '#FFFFFF',
    backgroundColor: 'grey',
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});

export default ProfileDetail;
