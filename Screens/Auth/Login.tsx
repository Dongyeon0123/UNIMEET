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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { loginStart, loginSuccess, loginFailure, setToken } from '../../store/authSlice';
import { API_BASE_URL } from '../../utils/env';
import GradientScreen from '../../component/GradientScreen';
import type { RootStackParamList } from '../../navigation/types';

const Login: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    dispatch(loginStart());
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '로그인에 실패했어요.');
      }

      const data = await response.json();
      // 백엔드 응답 예시 가정: { token: string, user: {...} }
      if (data?.token) {
        dispatch(setToken(data.token));
      }
      if (data?.user) {
        dispatch(loginSuccess(data.user));
      } else {
        // user 프로필 API가 분리된 경우 즉시 조회 시도
        const meRes = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': data?.token ? `Bearer ${data.token}` : '',
          },
        });
        if (meRes.ok) {
          const me = await meRes.json();
          dispatch(loginSuccess(me));
        } else {
          // 토큰만 받은 경우 최소한 토큰 저장
          dispatch(loginSuccess({ id: '', email, name: '', nickname: '', studentId: '', department: '', birth: '', phone: '' }));
        }
      }

      Alert.alert('로그인 성공', '환영합니다!');
    } catch (err: any) {
      dispatch(loginFailure(err?.message || '로그인 중 오류가 발생했습니다.'));
      Alert.alert('오류', err?.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    Alert.alert('비밀번호 찾기', '이메일로 비밀번호 재설정 링크를 보내드립니다.');
  };

  return (
    <GradientScreen>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* 로고 및 타이틀 */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="heart" size={50} color="#6846FF" />
            </View>
            <Text style={styles.title}>UniMeet</Text>
            <Text style={styles.subtitle}>대학생 미팅 & 커뮤니티</Text>
          </View>

          {/* 로그인 폼 */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>로그인</Text>
            
            {/* 이메일 입력 */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="이메일 주소"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
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

            {/* 비밀번호 찾기 */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>

            {/* 로그인 버튼 */}
            <TouchableOpacity
              style={[styles.loginButton, (!email.trim() || !password.trim()) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading || !email.trim() || !password.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={(!email.trim() || !password.trim()) ? ['#CCC', '#999'] : ['#6846FF', '#9C27B0']}
                style={styles.loginButtonGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="refresh" size={20} color="#FFF" />
                    <Text style={styles.loginButtonText}>로그인 중...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>로그인</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* 구분선 */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* 소셜 로그인 버튼들 */}
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('준비중', '카카오 로그인 준비 중입니다.')}>
                <View style={[styles.socialButtonContent, { backgroundColor: '#FEE500' }]}>
                  <Text style={[styles.socialButtonText, { color: '#000' }]}>카카오로 시작하기</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('준비중', 'Google 로그인 준비 중입니다.')}>
                <View style={[styles.socialButtonContent, { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD' }]}>
                  <Text style={[styles.socialButtonText, { color: '#333' }]}>Google로 시작하기</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* 회원가입 링크 */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>아직 계정이 없으신가요? </Text>
              <TouchableOpacity onPress={goToSignup}>
                <Text style={styles.signupLink}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#6846FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    flex: 1,
    marginTop: 10,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    marginBottom: 14,
    paddingHorizontal: 16,
    height: 52,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#6846FF',
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E9ECEF',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#666',
    fontSize: 12,
  },
  socialButtons: {
    gap: 10,
    marginBottom: 20,
  },
  socialButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  socialButtonContent: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 13,
  },
  signupLink: {
    color: '#6846FF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default Login;
