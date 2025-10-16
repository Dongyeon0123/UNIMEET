import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import GradientScreen from '../../component/GradientScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../utils/env';
import { useNavigation } from '@react-navigation/native';

const ProfileEdit: React.FC = () => {
  const navigation = useNavigation();
  const profile = useSelector((state: RootState) => state.profile);
  const token = useSelector((state: RootState) => state.auth.token);

  const [nickname, setNickname] = useState(profile.nickname || '');
  const [mbti, setMbti] = useState(profile.mbti || '');
  const [height, setHeight] = useState(profile.height || '');
  const [interests, setInterests] = useState((profile.interests || []).join(', '));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          nickname: nickname.trim(),
          mbti: mbti.trim(),
          height: height.trim(),
          interests: interests.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert('완료', '프로필이 저장되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      Alert.alert('오류', e?.message || '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <GradientScreen>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>프로필 수정</Text>
          <View style={styles.inputWrap}><TextInput style={styles.input} placeholder="닉네임" value={nickname} onChangeText={setNickname} /></View>
          <View style={styles.inputWrap}><TextInput style={styles.input} placeholder="MBTI" value={mbti} onChangeText={setMbti} autoCapitalize="characters" maxLength={4} /></View>
          <View style={styles.inputWrap}><TextInput style={styles.input} placeholder="키(cm)" value={height} onChangeText={setHeight} keyboardType="number-pad" /></View>
          <View style={styles.inputWrap}><TextInput style={styles.input} placeholder="관심사(쉼표로 구분)" value={interests} onChangeText={setInterests} /></View>
          <TouchableOpacity style={[styles.saveBtn, (!nickname.trim() || isSaving) && { opacity: 0.6 }]} onPress={handleSave} disabled={!nickname.trim() || isSaving}>
            <Text style={styles.saveText}>{isSaving ? '저장 중...' : '저장'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 80 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 16 },
  inputWrap: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, paddingHorizontal: 12 },
  input: { height: 48, fontSize: 16 },
  saveBtn: { backgroundColor: '#6846FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveText: { color: '#fff', fontWeight: '700' },
});

export default ProfileEdit;


