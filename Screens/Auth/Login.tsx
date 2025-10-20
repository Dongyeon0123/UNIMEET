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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../utils/env';
import { fetchWithTimeout } from '../../utils/http';
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        timeoutMs: 30000,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '로그인에 실패했어요.');
      }

      const data = await response.json();
      // 백엔드 응답 예시 가정: { token: string, user: {...} }
      if (data?.token) {
        dispatch(setToken(data.token));
        await AsyncStorage.setItem('auth_token', data.token);
      }
      if (data?.user) {
        dispatch(loginSuccess(data.user));
      } else {
        // user 프로필 API가 분리된 경우 즉시 조회 시도
        const meRes = await fetchWithTimeout(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': data?.token ? `Bearer ${data.token}` : '',
          },
          timeoutMs: 30000,
        });
        if (meRes.ok) {
          const me = await meRes.json();
          dispatch(loginSuccess(me));
        } else {
          dispatch(loginSuccess({ id: '', email, name: '', nickname: '', studentId: '', department: '', birth: '', phone: '' }));
        }
      }

      Alert.alert('로그인 성공', '환영합니다!');
    } catch (err: any) {
      dispatch(loginFailure(err?.name === 'AbortError' ? '요청 시간이 초과되었습니다. 네트워크를 확인해주세요.' : (err?.message || '로그인 중 오류가 발생했습니다.')));
      Alert.alert('오류', err?.name === 'AbortError' ? '요청 시간이 초과되었습니다. 네트워크를 확인해주세요.' : (err?.message || '로그인 중 오류가 발생했습니다.'));
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
      {/* 데코레이션 배경 */}
      <View style={styles.bgDecorations} pointerEvents="none">
        <LinearGradient
          colors={['rgba(104,70,255,0.28)', 'rgba(156,39,176,0.18)', 'transparent']}
          style={styles.decorationOne}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={['rgba(255,107,129,0.22)', 'rgba(177,146,255,0.18)', 'transparent']}
          style={styles.decorationTwo}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>
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

            {/* 소셜 로그인 버튼 제거됨 */}

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
  bgDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorationOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -40,
    left: -30,
    transform: [{ rotate: '15deg' }],
  },
  decorationTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    bottom: -60,
    right: -40,
    transform: [{ rotate: '-10deg' }],
  },
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
    marginBottom: 28,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#6846FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#333',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    flex: 1,
    marginTop: 12,
  },
  formTitle: {
    fontSize: 23,
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
    marginBottom: 22,
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
