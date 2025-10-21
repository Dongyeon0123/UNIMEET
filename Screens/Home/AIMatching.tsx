import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Animated,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientScreen from '../../component/GradientScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../utils/env';

const { width, height } = Dimensions.get('window');

const AIMatching: React.FC = () => {
  const navigation = useNavigation();
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const currentUserGender = useSelector((state: RootState) => state.auth.user?.gender);
  
  const [matches, setMatches] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const fadeAnim = new Animated.Value(1);
  const slideAnim = new Animated.Value(0);

  // 백엔드에서 매칭 데이터 가져오기
  useEffect(() => {
    const loadMatches = async () => {
      setIsLoading(true);
      try {
        console.log('[AI_MATCHING] 매칭 데이터 로드 시작');
        const res = await fetch(`${API_BASE_URL}/api/matches?limit=10`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        });
        
        console.log('[AI_MATCHING] 응답 상태:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('[AI_MATCHING] 받은 데이터:', data);
          
          const matchList = Array.isArray(data) ? data : (data.matches || []);
          console.log('[AI_MATCHING] 매칭 개수:', matchList.length);
          
          setMatches(matchList);
          
          // 백엔드 응답에 이미 사용자 정보가 포함되어 있음
          const allUsers = matchList.map((match: any) => ({
            id: match.userId,
            name: match.name || match.nickname,
            age: match.age,
            department: match.department,
            mbti: match.mbti,
            interests: match.interests || match.commonInterests || [],
            gender: match.gender,
            studentId: match.studentId,
            height: match.height,
            prefer: match.prefer,
            nonPrefer: match.nonPrefer,
            compatibility: Math.round((match.compatibilityScore || match.score || 0) * 100), // 0.0~1.0 → 0~100%
            detailedScores: match.detailedScores,
          })).filter((u: any) => u.id); // userId가 있는 것만 필터링
          
          // 성별 필터링: 남자는 여자만, 여자는 남자만
          const filteredUsers = allUsers.filter((user: any) => {
            // 임시로 필터링 비활성화 - 디버깅용
            // return true;
            
            if (!currentUserGender) return true; // 성별 정보 없으면 모두 표시
            
            // 남자는 여자만, 여자는 남자만 매칭
            if (currentUserGender === '남') {
              return user.gender === '여';
            } else if (currentUserGender === '여') {
              return user.gender === '남';
            }
            
            return true;
          });
          
          console.log('[AI_MATCHING] 전체 사용자:', allUsers.length);
          console.log('[AI_MATCHING] 필터링된 사용자:', filteredUsers.length);
          console.log('[AI_MATCHING] 현재 사용자 성별:', currentUserGender);
          setUsers(filteredUsers);
        } else {
          console.error('[AI_MATCHING] API 에러:', await res.text());
        }
      } catch (e) {
        console.error('[AI_MATCHING] 로드 에러:', e);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) {
      loadMatches();
    }
  }, [token]);

  const currentUser = users[currentUserIndex];

  // AI 분석 시뮬레이션
  const startAnalysis = () => {
    setIsAnalyzing(true);
    setShowResult(false);
    setAnalysisProgress(0);
    
    // 진행률 애니메이션
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setShowResult(true);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const nextUser = () => {
    if (currentUserIndex < users.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => {
        setCurrentUserIndex(prev => prev + 1);
        setShowResult(false);
        fadeAnim.setValue(1);
        slideAnim.setValue(0);
      });
    }
  };

  const prevUser = () => {
    if (currentUserIndex > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => {
        setCurrentUserIndex(prev => prev - 1);
        setShowResult(false);
        fadeAnim.setValue(1);
        slideAnim.setValue(0);
      });
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#8BC34A';
    if (score >= 70) return '#FFC107';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getCompatibilityText = (score: number) => {
    if (score >= 90) return '완벽한 매칭!';
    if (score >= 80) return '매우 좋은 매칭';
    if (score >= 70) return '좋은 매칭';
    if (score >= 60) return '보통 매칭';
    return '낮은 매칭';
  };

  // 로딩 중이거나 사용자가 없을 때
  if (isLoading) {
    return (
      <GradientScreen>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AI 매칭 분석</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6846FF" />
            <Text style={styles.loadingText}>AI 매칭 분석 중...</Text>
          </View>
        </View>
      </GradientScreen>
    );
  }

  if (users.length === 0) {
    return (
      <GradientScreen>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AI 매칭 분석</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>매칭된 사용자가 없습니다</Text>
            <Text style={styles.emptySubText}>프로필을 완성하고 관심사를 추가해보세요!</Text>
          </View>
        </View>
      </GradientScreen>
    );
  }

  return (
    <GradientScreen>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI 매칭 분석</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* 사용자 정보 카드 */}
          <Animated.View 
            style={[
              styles.userCard,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }]
              }
            ]}
          >
            <View style={[
              styles.userAvatar,
              { 
                backgroundColor: currentUser.gender === '여' ? 'rgba(255, 107, 129, 0.1)' : 'rgba(104, 70, 255, 0.1)',
                borderColor: currentUser.gender === '여' ? '#FF6B81' : '#6846FF'
              }
            ]}>
              <Ionicons 
                name="person" 
                size={60} 
                color={currentUser.gender === '여' ? '#FF6B81' : '#6846FF'} 
              />
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.name || '이름 없음'}</Text>
              <Text style={styles.userAge}>{currentUser.age || 0}세</Text>
              <Text style={styles.userDepartment}>{currentUser.department || currentUser.major || '학과 미정'}</Text>
              
              {currentUser.mbti && (
                <View style={[
                  styles.mbtiContainer,
                  { backgroundColor: currentUser.gender === '여' ? '#FF6B81' : '#6846FF' }
                ]}>
                  <Text style={styles.mbtiText}>{currentUser.mbti}</Text>
                </View>
              )}
              
              {currentUser.interests && currentUser.interests.length > 0 && (
                <View style={styles.interestsContainer}>
                  {currentUser.interests.map((interest: string, index: number) => (
                    <View 
                      key={index} 
                      style={[
                        styles.interestTag,
                        { backgroundColor: currentUser.gender === '여' ? 'rgba(255, 107, 129, 0.1)' : 'rgba(104, 70, 255, 0.1)' }
                      ]}
                    >
                      <Text style={[
                        styles.interestText,
                        { color: currentUser.gender === '여' ? '#FF6B81' : '#6846FF' }
                      ]}>#{interest}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              {currentUser.personality && currentUser.personality.length > 0 && (
                <View style={styles.personalityContainer}>
                  {currentUser.personality.map((trait: string, index: number) => (
                    <View key={index} style={styles.personalityTag}>
                      <Text style={styles.personalityText}>{trait}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Animated.View>

          {/* 분석 버튼 */}
          {!showResult && (
            <TouchableOpacity 
              style={styles.analyzeButton} 
              onPress={startAnalysis}
              disabled={isAnalyzing}
            >
              <Ionicons name="analytics" size={20} color="#FFF" />
              <Text style={styles.analyzeButtonText}>
                {isAnalyzing ? '분석 중...' : 'AI 매칭 분석 시작'}
              </Text>
            </TouchableOpacity>
          )}

          {/* 분석 진행률 */}
          {isAnalyzing && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${analysisProgress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{analysisProgress}% 완료</Text>
            </View>
          )}

          {/* 분석 결과 */}
          {showResult && (
            <Animated.View 
              style={[styles.resultContainer, { opacity: fadeAnim }]}
            >
              <View style={styles.compatibilityCard}>
                <View style={styles.compatibilityHeader}>
                  <Ionicons name="heart" size={24} color={getCompatibilityColor(currentUser.compatibility)} />
                  <Text style={styles.compatibilityTitle}>매칭률</Text>
                </View>
                
                <View style={styles.compatibilityScore}>
                  <Text style={[
                    styles.scoreNumber, 
                    { color: getCompatibilityColor(currentUser.compatibility) }
                  ]}>
                    {currentUser.compatibility}%
                  </Text>
                  <Text style={[
                    styles.scoreText,
                    { color: getCompatibilityColor(currentUser.compatibility) }
                  ]}>
                    {getCompatibilityText(currentUser.compatibility)}
                  </Text>
                </View>
                
                <View style={styles.compatibilityBar}>
                  <View 
                    style={[
                      styles.compatibilityFill,
                      { 
                        width: `${currentUser.compatibility}%`,
                        backgroundColor: getCompatibilityColor(currentUser.compatibility)
                      }
                    ]} 
                  />
                </View>
                
                <Text style={styles.compatibilityDescription}>
                  {currentUser.compatibility >= 90 
                    ? '당신과 완벽한 궁합을 보이는 사람입니다! 💕'
                    : currentUser.compatibility >= 80
                    ? '매우 좋은 매칭입니다. 만나볼 만해요! ✨'
                    : currentUser.compatibility >= 70
                    ? '좋은 매칭입니다. 흥미로운 만남이 될 것 같아요! 🌟'
                    : '다양한 관점을 나눌 수 있는 좋은 기회가 될 것 같아요! 🤝'
                  }
                </Text>
                
                {/* 매칭 신청 버튼 */}
                <TouchableOpacity 
                  style={[
                    styles.matchRequestButton,
                    { backgroundColor: getCompatibilityColor(currentUser.compatibility) }
                  ]}
                  onPress={async () => {
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/matches/${currentUser.matchId}/request`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': token ? `Bearer ${token}` : '',
                        },
                      });
                      
                      if (res.ok) {
                        Alert.alert(
                          '매칭 신청 완료',
                          `${currentUser.name}님에게 매칭 신청을 보냈습니다! 💕`,
                          [{ text: '확인' }]
                        );
                      } else {
                        const errorText = await res.text();
                        Alert.alert('매칭 신청 실패', errorText || '다시 시도해주세요.');
                      }
                    } catch (e) {
                      Alert.alert('오류', '매칭 신청 중 문제가 발생했습니다.');
                    }
                  }}
                >
                  <Ionicons name="heart" size={20} color="#FFF" />
                  <Text style={styles.matchRequestButtonText}>매칭 신청하기</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* 네비게이션 버튼 */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              style={[styles.navButton, currentUserIndex === 0 && styles.navButtonDisabled]} 
              onPress={prevUser}
              disabled={currentUserIndex === 0}
            >
              <Ionicons name="chevron-back" size={20} color={currentUserIndex === 0 ? "#CCC" : "#666"} />
              <Text style={[styles.navButtonText, currentUserIndex === 0 && styles.navButtonTextDisabled]}>
                이전
              </Text>
            </TouchableOpacity>
            
            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                {currentUserIndex + 1} / {users.length}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.navButton, currentUserIndex === users.length - 1 && styles.navButtonDisabled]} 
              onPress={nextUser}
              disabled={currentUserIndex === users.length - 1}
            >
              <Text style={[styles.navButtonText, currentUserIndex === users.length - 1 && styles.navButtonTextDisabled]}>
                다음
              </Text>
              <Ionicons name="chevron-forward" size={20} color={currentUserIndex === users.length - 1 ? "#CCC" : "#666"} />
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingTop: 70,
    paddingBottom: 18,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    elevation: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#6846FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(104, 70, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#6846FF',
  },
  userInfo: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  userAge: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  userDepartment: {
    fontSize: 14,
    color: '#6846FF',
    fontWeight: '600',
    marginBottom: 16,
  },
  mbtiContainer: {
    backgroundColor: '#6846FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  mbtiText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  interestTag: {
    backgroundColor: 'rgba(104, 70, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  interestText: {
    color: '#6846FF',
    fontSize: 12,
    fontWeight: '600',
  },
  personalityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  personalityTag: {
    backgroundColor: 'rgba(255, 107, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  personalityText: {
    color: '#FF6B81',
    fontSize: 12,
    fontWeight: '600',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6846FF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
    shadowColor: '#6846FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  analyzeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6846FF',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  resultContainer: {
    marginBottom: 20,
  },
  compatibilityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  compatibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  compatibilityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 8,
  },
  compatibilityScore: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  compatibilityBar: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  compatibilityFill: {
    height: '100%',
    borderRadius: 6,
  },
  compatibilityDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  matchRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  matchRequestButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  navButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: '#CCC',
  },
  pageIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  pageText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default AIMatching;

