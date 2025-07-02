import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import type { RootStackParamList } from '../../navigation/types';
import GradientScreen from '../../component/GradientScreen';

const PostDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetail'>>();
  const { postId } = route.params;

  // Redux에서 해당 게시글의 댓글만 필터링
  const comments = useSelector((state: RootState) =>
    state.comments.filter(c => c.postId === postId)
  );

  const post = useSelector((state: RootState) =>
    state.posts.find(p => p.id === postId)
  );

  if (!post) {
    return (
      <View style={[styles.centered, { flex: 1 }]}>
        <TouchableOpacity style={styles.sideButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6846FF" />
        </TouchableOpacity>
        <Text>게시글을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <GradientScreen>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideButton}>
            <Ionicons name="arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleBox}>
            <Text style={styles.title}>라운지</Text>
          </View>
          <TouchableOpacity onPress={() => alert('더보기')} style={styles.sideButton}>
            <Entypo name="dots-three-horizontal" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.comment}>
            <Ionicons name="megaphone-outline" size={12} color="#3D3D3D" style={styles.icon} />
            <Text style={styles.commentText}>비적절한 게시글, 댓글은 신고 대상입니다.</Text>
          </View>
          {/* 게시글 카드 */}
          <View style={styles.card}>
            {/* 작성자/날짜/더보기 */}
            <View style={styles.metaRow}>
              <Ionicons name="person-circle" size={32} color="#B1B1B1" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.author}>{post.author}</Text>
                <Text style={styles.date}>{post.date}</Text>
              </View>
              <TouchableOpacity onPress={() => alert('더보기')}>
                <Entypo name="dots-three-horizontal" size={18} color="#B1B1B1" />
              </TouchableOpacity>
            </View>
            {/* 제목 */}
            <Text style={styles.postTitle}>{post.title}</Text>
            {/* 본문 */}
            <Text style={styles.text}>{post.text}</Text>
            {/* 액션바 */}
            <View style={styles.actionBar}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="heart-outline" size={18} color="#FF6B81" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#B092FF" />
                {/* 댓글 개수: Redux에서 계산 */}
                <Text style={styles.actionText}>{comments.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="share-social-outline" size={18} color="#B1B1B1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="bookmark-outline" size={18} color="#B1B1B1" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 댓글 영역 */}
          <View style={styles.commentSection}>
            <Text style={styles.commentSectionTitle}>댓글 {comments.length}</Text>
            <View style={styles.commentDivider} />
            {comments.map(comment => (
              <React.Fragment key={comment.id}>
                <View style={styles.commentItem}>
                  <Ionicons name="person-circle-outline" size={22} color="#B092FF" style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentDate}>{comment.date}</Text>
                    </View>
                    <Text style={styles.comment1}>{comment.text}</Text>
                  </View>
                  <TouchableOpacity style={styles.commentLikeBtn}>
                    <Ionicons name="heart-outline" size={15} color="#FF6B81" />
                    <Text style={styles.commentLikeText}>{comment.likes ?? 0}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.commentDivider} />
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </View>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 11,
    height: 48,
    position: 'relative',
  },
  sideButton: {
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
  titleBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    elevation: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#B092FF',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 13,
    color: '#2C2C2C',
    fontWeight: '600',
  },
  date: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 2,
  },
  postTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  text: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: '#F2E3FF',
    paddingTop: 7,
    justifyContent: 'flex-start',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 13,
    color: '#444',
    marginLeft: 3,
    fontWeight: '500',
  },
  commentSection: {
    width: '100%',
    backgroundColor: '#F9F8FF',
    borderRadius: 13,
    padding: 14,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#B092FF',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  commentSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6846FF',
    marginBottom: 6,
    marginLeft: 2,
  },
  commentDivider: {
    height: 1,
    backgroundColor: '#E5C7A0',
    marginVertical: 8,
    opacity: 0.5,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    color: '#2C2C2C',
    fontWeight: '600',
    marginRight: 8,
  },
  commentDate: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 2,
  },
  comment1: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
  commentLikeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    paddingVertical: 2,
  },
  commentLikeText: {
    fontSize: 11,
    color: '#FF6B81',
    marginLeft: 2,
    fontWeight: 'bold',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  comment: {
    width: '100%',
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
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
});

export default PostDetail;
