import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import GradientScreen from '../../component/GradientScreen';

const ProfileDetail: React.FC = () => {
  const navigation = useNavigation();
  const profile = useSelector((state: RootState) => state.profile);

  const myInfoList: {
    label: string;
    value: string;
    }[] = [
      { label: '이름', value: profile.name },
      { label: '닉네임', value: profile.nickname },
      { label: '생년월일', value: profile.birth },
      { label: '학과', value: profile.department },
      { label: '학번', value: profile.studentId },
      { label: '나이', value: profile.age },
      { label: '키', value: profile.height },
      { label: '전화번호', value: profile.phone },
      { label: '가입일', value: profile.joinDate },
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
        <TouchableOpacity onPress={() => alert('수정화면으로 이동')} style={styles.sideButton}>
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
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
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
