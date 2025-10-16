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
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../store/postsSlice';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../utils/env';
import GradientScreen from '../../component/GradientScreen';

const WritePost: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('오류', '제목을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          title: title.trim(),
          text: content.trim(),
          anonymous: true,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || '등록에 실패했습니다.');
      }
      const created = await res.json();
      dispatch(addPost(created));
      setIsLoading(false);
      Alert.alert('완료', '게시글이 등록되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      setIsLoading(false);
      Alert.alert('오류', e?.message || '등록 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    if (title.trim() || content.trim()) {
      Alert.alert(
        '나가기',
        '작성 중인 내용이 있습니다. 정말 나가시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { text: '나가기', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
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
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>글 쓰기</Text>
          <TouchableOpacity 
            onPress={handleSubmit} 
            style={[
              styles.submitButton,
              (!title.trim() || isLoading) && styles.submitButtonDisabled
            ]}
            disabled={!title.trim() || isLoading}
          >
            <Text style={[
              styles.submitButtonText,
              (!title.trim() || isLoading) && styles.submitButtonTextDisabled
            ]}>
              {isLoading ? '등록 중...' : '등록'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 메인 콘텐츠 */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {/* 제목 입력 */}
            <View style={styles.inputSection}>
              <TextInput
                style={styles.titleInput}
                placeholder="제목을 입력하세요"
                placeholderTextColor="#767676"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
                multiline={false}
              />
            </View>

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 내용 입력 */}
            <View style={styles.inputSection}>
              <TextInput
                style={styles.contentInput}
                placeholder={`내용을 입력해주세요

연락처/SNS계정 공유, 욕설/비방 등 게시물 가이드라인을 위반할 경우 임의로 게시물이 삭제되거나 계정이 이용제한 될 수 있는 점 양해 부탁드립니다.`}
                placeholderTextColor="#ADADAD"
                value={content}
                onChangeText={setContent}
                maxLength={1000}
                multiline={true}
                textAlignVertical="top"
              />
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginLeft: 20,
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 40,
  },
  inputSection: {
    marginBottom: 24,
  },
  titleInput: {
    padding: 16,
    fontSize: 16,
    color: '#767676',
    fontWeight: '500',
  },
  contentInput: {
    padding: 16,
    fontSize: 16,
    color: '#767676',
    minHeight: 250,
    maxHeight: 400,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#ADADAD',
    marginTop: -12,
    marginBottom: 12,
    width: '90%',
    margin: 'auto',
    alignSelf: 'center',
  },
  guidelineText: {
    fontSize: 11,
    color: '#ADADAD',
    lineHeight: 16,
    marginTop: 12,
    marginHorizontal: 4,
  },
});

export default WritePost;
