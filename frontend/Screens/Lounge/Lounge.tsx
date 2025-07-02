import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../../navigation/Header';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import GradientScreen from '../../component/GradientScreen';

const Lounge: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const posts = useSelector((state: RootState) => state.posts);
  const comments = useSelector((state: RootState) => state.comments); // 댓글 배열 가져오기

  const handleNotificationPress = (): void => {
    alert('라운지 화면에서 알림을 눌렀습니다!');
  };

  const handleWritePress = () => {
    alert('글쓰기 버튼 클릭!');
  };

  return (
    <GradientScreen>
      <View style={styles.container}>
        <Header
          title="라운지"
          onNotificationPress={handleNotificationPress}
          iconName="search"
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.comment}>
            <Ionicons name="megaphone-outline" size={12} color="#3D3D3D" style={styles.icon} />
            <Text style={styles.commentText}>비적절한 게시글, 댓글은 신고 대상입니다.</Text>
          </View>

          <View style={styles.postList}>
            {posts
              .filter(post => !post.notice)
              .map(post => {
                // 실제 댓글 수 계산
                const commentCount = comments.filter(c => c.postId === post.id).length;
                return (
                  <TouchableOpacity
                    key={post.id}
                    style={styles.postCard}
                    onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
                  >
                    <Text style={styles.postTitle}>{post.title}</Text>
                    {post.text && <Text style={styles.postText}>{post.text}</Text>}
                    <View style={styles.postMeta}>
                      <Text style={styles.postAuthor}>{post.author}</Text>
                      <Text style={styles.postDate}>{post.date}</Text>
                      <Ionicons name="chatbubble-ellipses-outline" size={14} color="#B092FF" style={{ marginLeft: 8, marginRight: 2 }} />
                      <Text style={styles.postComments}>{commentCount}</Text>
                      <Ionicons name="heart-outline" size={15} color="#FF6B81" style={{ marginLeft: 6, marginRight: 2 }} />
                      <Text style={styles.postLikes}>{post.likes}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.fab} onPress={handleWritePress}>
          <Ionicons name="pencil" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  comment: {
    width: '100%',
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },
  commentText: {
    fontSize: 11,
    color: '#3D3D3D',
  },
  icon: {
    marginRight: 5,
    marginBottom: 2,
    color: '#3D3D3D',
  },
  content: {
    flexGrow: 1,
    padding: 10,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  postList: {
    marginTop: 10,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3D3D3D',
    marginBottom: 7,
  },
  postText: {
    color: '#606060',
    fontSize: 13,
    marginBottom: 7,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthor: {
    fontSize: 11,
    color: '#6846FF',
    marginRight: 5,
  },
  postDate: {
    fontSize: 11,
    color: '#AAA',
  },
  postComments: {
    fontSize: 11,
    color: '#B092FF',
    fontWeight: 'bold',
  },
  postLikes: {
    fontSize: 11,
    color: '#FF6B81',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 32,
    backgroundColor: '#6846FF',
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6846FF',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default Lounge;
