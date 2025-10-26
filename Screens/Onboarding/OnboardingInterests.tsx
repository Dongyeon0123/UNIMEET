import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import GradientScreen from '../../component/GradientScreen';
import type { RootStackParamList } from '../../navigation/types';

const INTERESTS = [
  { id: 'sports', name: '운동', icon: 'fitness', color: '#FF6B6B' },
  { id: 'music', name: '음악', icon: 'musical-notes', color: '#4ECDC4' },
  { id: 'movie', name: '영화', icon: 'film', color: '#45B7D1' },
  { id: 'game', name: '게임', icon: 'game-controller', color: '#96CEB4' },
  { id: 'reading', name: '독서', icon: 'book', color: '#FECA57' },
  { id: 'travel', name: '여행', icon: 'airplane', color: '#FF9FF3' },
  { id: 'cooking', name: '요리', icon: 'restaurant', color: '#F38BA8' },
  { id: 'photography', name: '사진', icon: 'camera', color: '#A8E6CF' },
  { id: 'study', name: '스터디', icon: 'school', color: '#88D8B0' },
  { id: 'art', name: '예술', icon: 'color-palette', color: '#B4A7D6' },
  { id: 'fashion', name: '패션', icon: 'shirt', color: '#FFB7B2' },
  { id: 'cafe', name: '카페', icon: 'cafe', color: '#D4A574' },
  { id: 'party', name: '파티', icon: 'wine', color: '#FF8A80' },
  { id: 'volunteer', name: '봉사', icon: 'heart', color: '#81C784' },
  { id: 'pet', name: '반려동물', icon: 'paw', color: '#FFB74D' },
  { id: 'nature', name: '자연', icon: 'leaf', color: '#A5D6A7' },
];

type OnboardingInterestsRouteProp = RouteProp<RootStackParamList, 'OnboardingInterests'>;

const OnboardingInterests: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OnboardingInterestsRouteProp>();
  const { mbti, signupForm } = route.params || {};
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        if (prev.length >= 5) {
          Alert.alert('알림', '최대 5개까지 선택할 수 있습니다.');
          return prev;
        }
        return [...prev, interestId];
      }
    });
  };

  const handleNext = () => {
    if (selectedInterests.length < 1) {
      Alert.alert('알림', '최소 1개 이상의 관심사를 선택해주세요.');
      return;
    }
    // 키 선택 페이지로 이동
    console.log('[OnboardingInterests] OnboardingHeight로 이동:', {
      prefilledMBTI: mbti || '',
      prefilledInterests: selectedInterests,
      signupForm: signupForm
    });
    navigation.navigate('OnboardingHeight', { 
      prefilledMBTI: mbti || '',
      prefilledInterests: selectedInterests,
      signupForm: signupForm
    });
  };

  const handleSkip = () => {
    navigation.navigate('OnboardingHeight', { 
      prefilledMBTI: mbti || '', 
      prefilledInterests: [],
      signupForm: signupForm
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <GradientScreen>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>프로필 설정</Text>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>건너뛰기</Text>
          </TouchableOpacity>
        </View>

        {/* 진행 상태 바 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66.66%' }]} />
          </View>
          <Text style={styles.progressText}>2/3</Text>
        </View>

        {/* 메인 콘텐츠 */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart-outline" size={40} color="#6846FF" />
            </View>
            <Text style={styles.title}>관심사를 알려주세요</Text>
            <Text style={styles.subtitle}>
              공통 관심사가 있는 사람들과{'\n'}
              더 재미있는 미팅을 만들어보세요
            </Text>
            <Text style={styles.selectionInfo}>
              {selectedInterests.length}/5 선택됨 (최소 1개)
            </Text>
          </View>

          <View style={styles.interestsGrid}>
            {INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestCard,
                  selectedInterests.includes(interest.id) && styles.interestCardSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.interestIconContainer, 
                  { backgroundColor: interest.color },
                  selectedInterests.includes(interest.id) && styles.interestIconContainerSelected
                ]}>
                  <Ionicons 
                    name={interest.icon as any} 
                    size={24} 
                    color={selectedInterests.includes(interest.id) ? '#FFF' : '#FFF'} 
                  />
                </View>
                <Text style={[
                  styles.interestName,
                  selectedInterests.includes(interest.id) && styles.interestNameSelected
                ]}>
                  {interest.name}
                </Text>
                {selectedInterests.includes(interest.id) && (
                  <View style={styles.checkContainer}>
                    <Ionicons name="checkmark-circle" size={20} color="#6846FF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="bulb-outline" size={20} color="#6846FF" />
            <Text style={styles.infoText}>
              나중에 프로필에서 언제든지 변경할 수 있어요
            </Text>
          </View>
        </ScrollView>

        {/* 다음 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedInterests.length < 1 && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={selectedInterests.length < 1}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedInterests.length >= 1 ? ['#6846FF', '#9C27B0'] : ['#CCC', '#999']}
              style={styles.nextButtonGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <Text style={styles.nextButtonText}>다음</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  progressText: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'right',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#6846FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  selectionInfo: {
    fontSize: 12,
    color: '#6846FF',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  interestCard: {
    width: '30%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  interestCardSelected: {
    borderColor: '#6846FF',
    backgroundColor: '#F8F7FF',
  },
  interestIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  interestIconContainerSelected: {
    shadowColor: '#6846FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  interestName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  interestNameSelected: {
    color: '#6846FF',
  },
  checkContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OnboardingInterests;
