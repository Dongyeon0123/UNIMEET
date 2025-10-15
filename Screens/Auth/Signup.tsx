import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import GradientScreen from '../../component/GradientScreen';
import { API_BASE_URL } from '../../utils/env';
import type { RootStackParamList } from '../../navigation/types';

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  studentId: string;
  department: string;
  birth: string;
  phone: string;
}

const Signup: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [form, setForm] = useState<SignupForm>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    studentId: '',
    department: '',
    birth: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: 계정정보, 2: 개인정보

  const updateForm = (field: keyof SignupForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const { email, password, confirmPassword } = form;
    
    if (!email.trim()) {
      Alert.alert('오류', '이메일을 입력해주세요.');
      return false;
    }
    
    if (!email.includes('@')) {
      Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('오류', '비밀번호는 6자 이상이어야 합니다.');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    const { name, nickname, studentId, department, birth, phone } = form;
    
    if (!name.trim() || !nickname.trim() || !studentId.trim() || !department.trim() || !birth.trim() || !phone.trim()) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigation.goBack();
    } else {
      setCurrentStep(1);
    }
  };

  const handleSignup = async () => {
    if (!validateStep2()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          nickname: form.nickname,
          studentId: form.studentId,
          department: form.department,
          birth: form.birth,
          phone: form.phone,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '회원가입에 실패했습니다.');
      }
      setIsLoading(false);
      Alert.alert('회원가입 완료', '프로필 설정을 진행해주세요!', [
        { text: '확인', onPress: () => navigation.navigate('OnboardingMBTI') }
      ]);
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert('오류', err?.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>계정 정보</Text>
      <Text style={styles.stepSubtitle}>로그인에 사용할 계정 정보를 입력해주세요</Text>

      {/* 이메일 */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="이메일 주소"
          placeholderTextColor="#999"
          value={form.email}
          onChangeText={(value) => updateForm('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* 비밀번호 */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 (6자 이상)"
          placeholderTextColor="#999"
          value={form.password}
          onChangeText={(value) => updateForm('password', value)}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Ionicons 
            name={showPassword ? "eye-outline" : "eye-off-outline"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      {/* 비밀번호 확인 */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          placeholderTextColor="#999"
          value={form.confirmPassword}
          onChangeText={(value) => updateForm('confirmPassword', value)}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity 
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeButton}
        >
          <Ionicons 
            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      {/* 비밀번호 일치 표시 */}
      {form.password && form.confirmPassword && (
        <View style={styles.passwordMatch}>
          <Ionicons 
            name={form.password === form.confirmPassword ? "checkmark-circle" : "close-circle"} 
            size={16} 
            color={form.password === form.confirmPassword ? "#4CAF50" : "#F44336"} 
          />
          <Text style={[
            styles.passwordMatchText,
            { color: form.password === form.confirmPassword ? "#4CAF50" : "#F44336" }
          ]}>
            {form.password === form.confirmPassword ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}
          </Text>
        </View>
      )}
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>개인 정보</Text>
      <Text style={styles.stepSubtitle}>프로필에 사용될 정보를 입력해주세요</Text>

      {/* 이름 */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="실명"
          placeholderTextColor="#999"
          value={form.name}
          onChangeText={(value) => updateForm('name', value)}
          autoCapitalize="words"
        />
      </View>

      {/* 닉네임 */}
      <View style={styles.inputContainer}>
        <Ionicons name="at-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="닉네임"
          placeholderTextColor="#999"
          value={form.nickname}
          onChangeText={(value) => updateForm('nickname', value)}
        />
      </View>

      {/* 학번 */}
      <View style={styles.inputContainer}>
        <Ionicons name="school-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="학번 (예: 20학번)"
          placeholderTextColor="#999"
          value={form.studentId}
          onChangeText={(value) => updateForm('studentId', value)}
        />
      </View>

      {/* 학과 */}
      <View style={styles.inputContainer}>
        <Ionicons name="library-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="학과명"
          placeholderTextColor="#999"
          value={form.department}
          onChangeText={(value) => updateForm('department', value)}
        />
      </View>

      {/* 생년월일 */}
      <View style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="생년월일 (YYYY.MM.DD)"
          placeholderTextColor="#999"
          value={form.birth}
          onChangeText={(value) => updateForm('birth', value)}
          keyboardType="numeric"
        />
      </View>

      {/* 전화번호 */}
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="전화번호 (010-0000-0000)"
          placeholderTextColor="#999"
          value={form.phone}
          onChangeText={(value) => updateForm('phone', value)}
          keyboardType="phone-pad"
        />
      </View>
    </>
  );

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
          <Text style={styles.headerTitle}>회원가입</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 진행 상태 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentStep / 2) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{currentStep}/2</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {currentStep === 1 ? renderStep1() : renderStep2()}

            {/* 다음/가입 버튼 */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={currentStep === 1 ? handleNext : handleSignup}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6846FF', '#9C27B0']}
                style={styles.actionButtonGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="refresh" size={20} color="#FFF" />
                    <Text style={styles.actionButtonText}>가입 중...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.actionButtonText}>
                      {currentStep === 1 ? '다음' : '가입하기'}
                    </Text>
                    <Ionicons 
                      name={currentStep === 1 ? "arrow-forward" : "checkmark"} 
                      size={20} 
                      color="#FFF" 
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* 로그인 링크 */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>이미 계정이 있으신가요? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 28,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    marginBottom: 16,
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
  eyeButton: {
    padding: 4,
  },
  passwordMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: -8,
  },
  passwordMatchText: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 24,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#6846FF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Signup;
