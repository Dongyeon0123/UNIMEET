import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { updateUser, loginSuccess } from '../../store/authSlice';
import GradientScreen from '../../component/GradientScreen';
import type { RootStackParamList } from '../../navigation/types';

const HEIGHT_PRESETS = [
  '150cm', '155cm', '160cm', '165cm', '170cm', '175cm', '180cm', '185cm', '190cm'
];

type OnboardingHeightRouteProp = RouteProp<RootStackParamList, 'OnboardingHeight'>;

const OnboardingHeight: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OnboardingHeightRouteProp>();
  const dispatch = useDispatch();
  const { prefilledMBTI, prefilledInterests, signupForm } = route.params || {};
  const mbti = prefilledMBTI;
  const interests = prefilledInterests;
  
  const [height, setHeight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleHeightSelect = (selectedHeight: string) => {
    setHeight(selectedHeight);
  };

  const handleComplete = () => {
    if (!height.trim()) {
      Alert.alert('알림', '키를 입력해주세요.');
      return;
    }

    // Signup으로 이동하면서 모든 온보딩 데이터 전달
    console.log('[OnboardingHeight] Signup으로 이동:', {
      prefilledMBTI: mbti || '',
      prefilledInterests: interests || [],
      prefilledHeight: height,
      signupForm: signupForm
    });
    
    navigation.navigate('Signup', { 
      prefilledMBTI: mbti || '',
      prefilledInterests: interests || [],
      prefilledHeight: height,
      signupForm: signupForm
    });
  };

  const handleSkip = () => {
    navigation.navigate('Signup', { 
      prefilledMBTI: mbti || '', 
      prefilledInterests: interests || [],
      prefilledHeight: '',
      signupForm: signupForm
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const validateHeight = (text: string) => {
    // 숫자와 cm만 허용
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned) {
      setHeight(cleaned + 'cm');
    } else {
      setHeight('');
    }
  };

  return (
    <GradientScreen>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>3/3</Text>
        </View>

        {/* 메인 콘텐츠 */}
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="resize-outline" size={40} color="#6846FF" />
            </View>
            <Text style={styles.title}>키를 알려주세요</Text>
            <Text style={styles.subtitle}>
              더 정확한 매칭을 위해{'\n'}
              키 정보를 입력해주세요
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>키 입력</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="예: 170cm"
                placeholderTextColor="#999"
                value={height}
                onChangeText={validateHeight}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </View>

          <View style={styles.presetsSection}>
            <Text style={styles.presetsLabel}>빠른 선택</Text>
            <View style={styles.presetsGrid}>
              {HEIGHT_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetButton,
                    height === preset && styles.presetButtonSelected,
                  ]}
                  onPress={() => handleHeightSelect(preset)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.presetText,
                    height === preset && styles.presetTextSelected,
                  ]}>
                    {preset}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#6846FF" />
            <Text style={styles.infoText}>
              개인정보는 안전하게 보호되며, 매칭 시에만 사용됩니다
            </Text>
          </View>
        </View>

        {/* 완료 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              !height.trim() && styles.completeButtonDisabled
            ]}
            onPress={handleComplete}
            disabled={!height.trim()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={height.trim() ? ['#6846FF', '#9C27B0'] : ['#CCC', '#999']}
              style={styles.completeButtonGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <>
                <Ionicons name="arrow-forward-circle" size={20} color="#FFF" />
                <Text style={styles.completeButtonText}>다음</Text>
              </>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    marginBottom: 40,
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
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  presetsSection: {
    marginBottom: 30,
  },
  presetsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetButton: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetButtonSelected: {
    borderColor: '#6846FF',
    backgroundColor: '#F8F7FF',
  },
  presetText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  presetTextSelected: {
    color: '#6846FF',
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
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default OnboardingHeight;
