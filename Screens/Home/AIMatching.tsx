import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientScreen from '../../component/GradientScreen';

const { width, height } = Dimensions.get('window');

// 임시 사용자 데이터
const mockUsers = [
  {
    id: 1,
    name: '김민수',
    age: 22,
    department: '컴퓨터공학과',
    mbti: 'INTJ',
    interests: ['코딩', '게임', '영화'],
    photo: null,
    personality: ['분석적', '논리적', '독립적'],
    compatibility: 87
  },
  {
    id: 2,
    name: '이지영',
    age: 21,
    department: '디자인학과',
    mbti: 'ENFP',
    interests: ['그림그리기', '음악', '여행'],
    photo: null,
    personality: ['창의적', '열정적', '사교적'],
    compatibility: 92
  },
  {
    id: 3,
    name: '박준호',
    age: 23,
    department: '경영학과',
    mbti: 'ESTJ',
    interests: ['독서', '운동', '요리'],
    photo: null,
    personality: ['리더십', '계획적', '책임감'],
    compatibility: 78
  },
  {
    id: 4,
    name: '정수진',
    age: 22,
    department: '심리학과',
    mbti: 'INFP',
    interests: ['심리학', '책읽기', '산책'],
    photo: null,
    personality: ['공감능력', '직관적', '따뜻함'],
    compatibility: 85
  }
];

const AIMatching: React.FC = () => {
  const navigation = useNavigation();
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  const fadeAnim = new Animated.Value(1);
  const slideAnim = new Animated.Value(0);

  const currentUser = mockUsers[currentUserIndex];

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
    if (currentUserIndex < mockUsers.length - 1) {
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
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={60} color="#6846FF" />
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userAge}>{currentUser.age}세</Text>
              <Text style={styles.userDepartment}>{currentUser.department}</Text>
              
              <View style={styles.mbtiContainer}>
                <Text style={styles.mbtiText}>{currentUser.mbti}</Text>
              </View>
              
              <View style={styles.interestsContainer}>
                {currentUser.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>#{interest}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.personalityContainer}>
                {currentUser.personality.map((trait, index) => (
                  <View key={index} style={styles.personalityTag}>
                    <Text style={styles.personalityText}>{trait}</Text>
                  </View>
                ))}
              </View>
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
              <Ionicons name="chevron-back" size={20} color={currentUserIndex === 0 ? "#CCC" : "#6846FF"} />
              <Text style={[styles.navButtonText, currentUserIndex === 0 && styles.navButtonTextDisabled]}>
                이전
              </Text>
            </TouchableOpacity>
            
            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                {currentUserIndex + 1} / {mockUsers.length}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.navButton, currentUserIndex === mockUsers.length - 1 && styles.navButtonDisabled]} 
              onPress={nextUser}
              disabled={currentUserIndex === mockUsers.length - 1}
            >
              <Text style={[styles.navButtonText, currentUserIndex === mockUsers.length - 1 && styles.navButtonTextDisabled]}>
                다음
              </Text>
              <Ionicons name="chevron-forward" size={20} color={currentUserIndex === mockUsers.length - 1 ? "#CCC" : "#6846FF"} />
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
    color: '#FFF',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButtonText: {
    color: '#6846FF',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: '#CCC',
  },
  pageIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  pageText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AIMatching;

