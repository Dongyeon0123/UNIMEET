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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import GradientScreen from '../../component/GradientScreen';
import { API_BASE_URL } from '../../utils/env';
import { fetchWithTimeout } from '../../utils/http';
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
  gender: string; // "남" 또는 "여"
  mbti: string; // 선택 또는 필수 여부는 백엔드 스펙에 따름
  interestsInput: string; // 쉼표 구분 입력 → 배열 변환
}

type SignupRoute = RouteProp<RootStackParamList, 'Signup'>;

const Signup: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SignupRoute>();
  
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
    gender: '',
    mbti: route.params?.prefilledMBTI || '',
    interestsInput: (route.params?.prefilledInterests || []).join(', '),
  });

  // 온보딩에서 돌아온 경우 값 반영하고 회원가입 진행
  React.useEffect(() => {
    if (route.params?.prefilledMBTI !== undefined || route.params?.prefilledInterests !== undefined) {
      console.log('[SIGNUP] 온보딩에서 돌아옴:', {
        prefilledMBTI: route.params?.prefilledMBTI,
        prefilledInterests: route.params?.prefilledInterests,
        signupForm: route.params?.signupForm
      });
      
      const restoredForm = {
        // signupForm이 있으면 기존 폼 데이터 복원 (이메일/패스워드 포함)
        ...(route.params?.signupForm || {}),
        // 온보딩에서 받은 MBTI/관심사 반영 (덮어쓰기)
        mbti: route.params?.prefilledMBTI || '',
        interestsInput: (route.params?.prefilledInterests || []).join(', '),
      };
      
      console.log('[SIGNUP] 폼 데이터 복원:', restoredForm);
      
      setForm(restoredForm);
      
      // 복원된 데이터로 바로 회원가입 진행
      handleSignupWithData(restoredForm);
    }
  }, [route.params?.prefilledMBTI, route.params?.prefilledInterests, route.params?.signupForm]);

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
    
    if (!/^[^@\s]+@kku\.ac\.kr$/.test(email)) {
      Alert.alert('오류', '건국대학교 이메일(@kku.ac.kr)만 사용할 수 있습니다.');
      return false;
    }
    
    if (password.length < 8) {
      Alert.alert('오류', '비밀번호는 8자 이상이어야 합니다.');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    const { name, nickname, studentId, department, birth, phone, gender } = form;
    
    if (!name.trim() || !nickname.trim() || !studentId.trim() || !department.trim() || !birth.trim() || !phone.trim() || !gender.trim()) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return false;
    }
    // 학번: 숫자 9자리 이상 권장 (예: 202012345)
    if (!/^\d{9,}$/.test(studentId)) {
      Alert.alert('오류', '학번은 숫자 9자리 이상이어야 합니다.');
      return false;
    }
    // 생년월일: YYYY-MM-DD 형식, 또는 사용자가 점으로 입력한 경우 허용 후 변환
    const birthNormalized = birth.includes('.') ? birth.replace(/\./g, '-') : birth;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthNormalized)) {
      Alert.alert('오류', '생년월일은 YYYY-MM-DD 형식이어야 합니다.');
      return false;
    }
    // 성별: 남/여
    if (!/^(남|여)$/.test(gender)) {
      Alert.alert('오류', '성별은 "남" 또는 "여"로 입력해주세요.');
      return false;
    }

    // MBTI가 입력된 경우 형식 보정 (대문자, 2~4자)
    if (form.mbti && !/^[A-Za-z]{2,4}$/.test(form.mbti.trim())) {
      Alert.alert('오류', 'MBTI는 영문 2~4자로 입력해주세요. (예: INTJ)');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      // 개인정보 완료 후 MBTI 온보딩으로 이동 (현재 폼 데이터 전달)
      (navigation as any).navigate('OnboardingMBTI', { signupForm: form });
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigation.goBack();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignupWithData = async (formData: any) => {
    // 필수 필드 검증
    const signupData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      nickname: formData.nickname,
      studentId: formData.studentId,
      department: formData.department,
      birth: formData.birth && typeof formData.birth === 'string' && formData.birth.includes('.') 
        ? formData.birth.replace(/\./g, '-') 
        : formData.birth,
      phone: formData.phone,
      gender: formData.gender,
      mbti: formData.mbti?.toUpperCase() || undefined,
      interests: formData.interestsInput && typeof formData.interestsInput === 'string' && formData.interestsInput.trim()
        ? formData.interestsInput.split(',').map((s: string) => s.trim()).filter(Boolean)
        : undefined,
    };

    // 필수 필드 검증
    console.log('[SIGNUP] 복원된 데이터로 회원가입:', signupData);
    
    if (!signupData.email || !signupData.password || !signupData.name || !signupData.nickname || 
        !signupData.studentId || !signupData.department || !signupData.birth || !signupData.phone || !signupData.gender) {
      console.log('[SIGNUP] 필수 필드 누락:', {
        email: !!signupData.email,
        password: !!signupData.password,
        name: !!signupData.name,
        nickname: !!signupData.nickname,
        studentId: !!signupData.studentId,
        department: !!signupData.department,
        birth: !!signupData.birth,
        phone: !!signupData.phone,
        gender: !!signupData.gender,
      });
      Alert.alert('오류', '필수 항목을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    const startedAt = Date.now();
    console.log('[SIGNUP] API_BASE_URL =', API_BASE_URL);
    console.log('[SIGNUP] Request → /auth/signup (timeout 30000ms)', {
      ...signupData,
      passwordLen: signupData.password?.length,
    });
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
        timeoutMs: 30000,
      });
      const elapsed = Date.now() - startedAt;
      console.log('[SIGNUP] Response ← /auth/signup', response.status, `(${elapsed}ms)`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SIGNUP] Error body:', errorText);
        throw new Error(errorText || '회원가입에 실패했습니다.');
      }
      const data = await response.json();
      console.log('[SIGNUP] Success:', data);
      Alert.alert('회원가입 완료', '이메일 인증을 완료해주세요.', [
        { text: '확인', onPress: () => navigation.replace('EmailVerification', { email: formData.email }) }
      ]);
    } catch (err: any) {
      const elapsed = Date.now() - startedAt;
      const isAbort = err?.name === 'AbortError';
      console.error('[SIGNUP] Failed after', `${elapsed}ms`, isAbort ? '(AbortError)' : '', err?.message || err);
      Alert.alert('오류', isAbort ? '요청 시간이 초과되었습니다. 네트워크를 확인해주세요.' : (err?.message || '회원가입 중 오류가 발생했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    // 온보딩에서 돌아온 경우가 아니면 검증 수행
    if (!route.params?.prefilledMBTI && !route.params?.prefilledInterests) {
      if (!validateStep2()) return;
    }

    // 필수 필드 검증
    const signupData = {
      email: form.email,
      password: form.password,
      name: form.name,
      nickname: form.nickname,
      studentId: form.studentId,
      department: form.department,
      birth: (form.birth || '').includes('.') ? (form.birth || '').replace(/\./g, '-') : form.birth,
      phone: form.phone,
      gender: form.gender,
      mbti: form.mbti?.toUpperCase() || undefined,
      interests: form.interestsInput
        ? form.interestsInput.split(',').map(s => s.trim()).filter(Boolean)
        : undefined,
    };

    // 필수 필드 검증
    console.log('[SIGNUP] 현재 폼 상태:', form);
    console.log('[SIGNUP] signupData:', signupData);
    
    if (!signupData.email || !signupData.password || !signupData.name || !signupData.nickname || 
        !signupData.studentId || !signupData.department || !signupData.birth || !signupData.phone || !signupData.gender) {
      console.log('[SIGNUP] 필수 필드 누락:', {
        email: !!signupData.email,
        password: !!signupData.password,
        name: !!signupData.name,
        nickname: !!signupData.nickname,
        studentId: !!signupData.studentId,
        department: !!signupData.department,
        birth: !!signupData.birth,
        phone: !!signupData.phone,
        gender: !!signupData.gender,
      });
      Alert.alert('오류', '필수 항목을 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const startedAt = Date.now();
    console.log('[SIGNUP] API_BASE_URL =', API_BASE_URL);
    console.log('[SIGNUP] Request → /auth/signup (timeout 30000ms)', {
      ...signupData,
      passwordLen: signupData.password?.length,
    });
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
        timeoutMs: 30000,
      });
      const elapsed = Date.now() - startedAt;
      console.log('[SIGNUP] Response ← /auth/signup', response.status, `(${elapsed}ms)`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SIGNUP] Error body:', errorText?.slice(0, 400));
        throw new Error(errorText || '회원가입에 실패했습니다.');
      }
      setIsLoading(false);
      Alert.alert('회원가입 완료', '이메일 인증을 먼저 완료해주세요.', [
        { text: '인증하러 가기', onPress: () => (navigation as any).navigate('EmailVerification', { email: form.email }) },
        { text: '나중에', onPress: () => (navigation as any).navigate('OnboardingMBTI') }
      ]);
    } catch (err: any) {
      setIsLoading(false);
      const elapsed = Date.now() - startedAt;
      const isAbort = err?.name === 'AbortError';
      console.error('[SIGNUP] Failed after', `${elapsed}ms`, isAbort ? '(AbortError)' : '', err?.message || err);
      const msg = isAbort ? '요청 시간이 초과되었습니다. 네트워크를 확인해주세요.' : (err?.message || '회원가입 중 오류가 발생했습니다.');
      Alert.alert('오류', msg);
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
          placeholder="학번 (예: 202012345)"
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
          placeholder="생년월일 (YYYY-MM-DD)"
          placeholderTextColor="#999"
          value={form.birth}
          onChangeText={(value) => updateForm('birth', value)}
          keyboardType="numeric"
        />
      </View>

      {/* 성별 */}
      <View style={styles.inputContainer}>
        <Ionicons name="male-female-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="성별 (남/여)"
          placeholderTextColor="#999"
          value={form.gender}
          onChangeText={(value) => updateForm('gender', value)}
          autoCapitalize="none"
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
              onPress={currentStep === 2 ? handleNext : handleNext}
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
                      다음
                    </Text>
                    <Ionicons 
                      name="arrow-forward" 
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
