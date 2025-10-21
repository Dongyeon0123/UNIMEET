import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import GradientScreen from '../../component/GradientScreen';
import type { RootStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

const MBTI_TYPES = [
  { id: 'INTJ', name: 'INTJ', desc: '건축가', color: '#6B73FF' },
  { id: 'INTP', name: 'INTP', desc: '논리술사', color: '#9C88FF' },
  { id: 'ENTJ', name: 'ENTJ', desc: '통솔자', color: '#FF6B6B' },
  { id: 'ENTP', name: 'ENTP', desc: '변론가', color: '#FF9F43' },
  { id: 'INFJ', name: 'INFJ', desc: '옹호자', color: '#10AC84' },
  { id: 'INFP', name: 'INFP', desc: '중재자', color: '#54A0FF' },
  { id: 'ENFJ', name: 'ENFJ', desc: '선도자', color: '#5F27CD' },
  { id: 'ENFP', name: 'ENFP', desc: '활동가', color: '#00D2D3' },
  { id: 'ISTJ', name: 'ISTJ', desc: '현실주의자', color: '#2E86AB' },
  { id: 'ISFJ', name: 'ISFJ', desc: '수호자', color: '#A23E48' },
  { id: 'ESTJ', name: 'ESTJ', desc: '경영자', color: '#F18701' },
  { id: 'ESFJ', name: 'ESFJ', desc: '영사', color: '#C44569' },
  { id: 'ISTP', name: 'ISTP', desc: '모험가', color: '#40739E' },
  { id: 'ISFP', name: 'ISFP', desc: '모험가', color: '#487EB0' },
  { id: 'ESTP', name: 'ESTP', desc: '사업가', color: '#8C7AE6' },
  { id: 'ESFP', name: 'ESFP', desc: '연예인', color: '#F8B500' },
];

const OnboardingMBTI: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OnboardingMBTI'>>();
  const [selectedMBTI, setSelectedMBTI] = useState<string>('');

  const handleNext = () => {
    if (selectedMBTI) {
      console.log('[OnboardingMBTI] OnboardingInterests로 이동:', {
        mbti: selectedMBTI,
        signupForm: route.params?.signupForm
      });
      navigation.navigate('OnboardingInterests', { 
        mbti: selectedMBTI,
        signupForm: route.params?.signupForm 
      });
    }
  };

  const handleSkip = () => {
    navigation.navigate('OnboardingInterests', { 
      mbti: '',
      signupForm: route.params?.signupForm 
    });
  };

  return (
    <GradientScreen>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
            <View style={[styles.progressFill, { width: '33.33%' }]} />
          </View>
          <Text style={styles.progressText}>1/3</Text>
        </View>

        {/* 메인 콘텐츠 */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="happy-outline" size={40} color="#6846FF" />
            </View>
            <Text style={styles.title}>나의 MBTI는?</Text>
            <Text style={styles.subtitle}>
              다른 사람들과 더 잘 맞는 미팅을 위해{'\n'}
              MBTI를 알려주세요
            </Text>
          </View>

          <View style={styles.mbtiGrid}>
            {MBTI_TYPES.map((mbti) => (
              <TouchableOpacity
                key={mbti.id}
                style={[
                  styles.mbtiCard,
                  selectedMBTI === mbti.id && styles.mbtiCardSelected,
                ]}
                onPress={() => setSelectedMBTI(mbti.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.mbtiIconContainer, { backgroundColor: mbti.color }]}>
                  <Text style={styles.mbtiName}>{mbti.name}</Text>
                </View>
                <Text style={styles.mbtiDesc}>{mbti.desc}</Text>
                {selectedMBTI === mbti.id && (
                  <View style={styles.checkContainer}>
                    <Ionicons name="checkmark-circle" size={24} color="#6846FF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#6846FF" />
            <Text style={styles.infoText}>
              MBTI를 모르시나요? 무료 테스트를 해보세요!
            </Text>
          </View>
        </ScrollView>

        {/* 다음 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedMBTI && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={!selectedMBTI}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedMBTI ? ['#6846FF', '#9C27B0'] : ['#CCC', '#999']}
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
  },
  mbtiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mbtiCard: {
    width: (width - 48 - 12) / 4,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
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
  mbtiCardSelected: {
    borderColor: '#6846FF',
    backgroundColor: '#F8F7FF',
  },
  mbtiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mbtiName: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  mbtiDesc: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  checkContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFF',
    borderRadius: 12,
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

export default OnboardingMBTI;
