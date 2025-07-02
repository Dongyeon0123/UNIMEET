import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Header from '../../navigation/Header';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import type { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientScreen from '../../component/GradientScreen';

const Profile: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const profile = useSelector((state: RootState) => state.profile);

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const myInfoList = [
    { label: '보유 콩', value: profile.beans, onPress: () => alert('보유 콩 상세로 이동') },
    { label: '나의 친구 목록', value: profile.friends, onPress: () => alert('친구 목록으로 이동') },
    { label: '내가 쓴 게시글', value: profile.posts, onPress: () => alert('게시글로 이동') },
    { label: '내가 쓴 댓글', value: profile.comments, onPress: () => alert('댓글로 이동') },
    { label: '선호하는 학과 설정', value: profile.Prefer, onPress: () => alert('선호하는 학과 설정 선택으로 이동') },
    { label: '비 선호하는 학과 설정', value: profile.nonPrefer, onPress: () => alert('선호하는 학과 설정 선택으로 이동') },
  ];  

  return (
    <GradientScreen>
      <View style={styles.container}>
        <Header
          title="마이페이지"
          onNotificationPress={handleSettingsPress}
          iconName="settings-outline"
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.introduce}>
            <Image source={require('../../img/Profile.jpg')} style={styles.image} />
            <View style={styles.infoBox}>
              <Text style={styles.label}>
                이름: <Text style={styles.value}>{profile.name}</Text>
              </Text>
              <Text style={styles.label}>
                닉네임: <Text style={styles.value}>{profile.nickname}</Text>
              </Text>
              <Text style={styles.label}>
                생년월일: <Text style={styles.value}>{profile.birth}</Text>
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('ProfileDetail')}>
                <Text style={styles.goProfile}>나의 프로필 보기</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.myInfo}>
            {myInfoList.map((item, idx) => {
              const isPressable = !!item.onPress;
              const rowContent = (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <View style={styles.infoValueRight}>
                    <Text style={styles.infoValue}>{item.value}</Text>
                    {isPressable && (
                      <Ionicons name="chevron-forward" size={20} color="#bbb" />
                    )}
                  </View>
                </View>
              );
              return (
                <React.Fragment key={item.label}>
                  {isPressable ? (
                    <TouchableOpacity onPress={item.onPress} activeOpacity={0.7}>
                      {rowContent}
                    </TouchableOpacity>
                  ) : (
                    rowContent
                  )}
                  {idx < myInfoList.length - 1 && <View style={styles.underline} />}
                </React.Fragment>
              );
            })}
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
      </View>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  introduce: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 40,
  },
  infoBox: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  value: {
    fontWeight: '400',
    color: '#555',
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
    width: 230,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#6D6D6D',
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  goProfile: {
    textDecorationLine: 'underline',
  },
  menuBox: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  infoValueRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 15,
  },  
});

export default Profile;
