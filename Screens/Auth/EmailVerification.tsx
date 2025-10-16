import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import GradientScreen from '../../component/GradientScreen';
import { API_BASE_URL } from '../../utils/env';

type EmailVerificationRoute = RouteProp<RootStackParamList, 'EmailVerification'>;

const EmailVerification: React.FC = () => {
  const route = useRoute<EmailVerificationRoute>();
  const navigation = useNavigation();
  const { email } = route.params;

  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert('안내', '인증 코드를 전송했습니다. 메일함을 확인하세요.');
    } catch (e: any) {
      Alert.alert('오류', e?.message || '코드 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert('오류', '인증 코드를 입력하세요.');
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: code.trim() }),
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert('성공', '이메일 인증이 완료되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      Alert.alert('오류', e?.message || '인증에 실패했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <GradientScreen>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Text style={styles.title}>이메일 인증</Text>
          <Text style={styles.subtitle}>{email}</Text>
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={isSending}>
            <Text style={styles.btnText}>{isSending ? '전송 중...' : '인증 코드 보내기'}</Text>
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="인증 코드 6자리"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
          </View>
          <TouchableOpacity style={[styles.verifyBtn, !code.trim() && { opacity: 0.6 }]} onPress={handleVerify} disabled={!code.trim() || isVerifying}>
            <Text style={styles.btnText}>{isVerifying ? '확인 중...' : '인증하기'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 80 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { color: '#f0f0f0', marginBottom: 20 },
  inputWrap: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginTop: 16 },
  input: { height: 48, fontSize: 16 },
  sendBtn: { backgroundColor: '#434343', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  verifyBtn: { backgroundColor: '#6846FF', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: '700' },
});

export default EmailVerification;


