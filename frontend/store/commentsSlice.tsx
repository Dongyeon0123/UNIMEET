import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Comment {
  id: number;
  postId: number;
  author: string;
  text: string;
  date: string;
  likes?: number;
}

const initialState: Comment[] = [
  { id: 1, postId: 1, author: '익명', text: '좋은 정보 감사합니다!', date: '2분 전' },
  { id: 2, postId: 1, author: '익명', text: '저도 궁금했어요~', date: '1분 전' },
  { id: 3, postId: 2, author: '익명', text: '참여하고 싶어요!', date: '3분 전' },
  { id: 4, postId: 3, author: '익명', text: '사진 찍었어요!', date: '5분 전' },
  // 데이터 원하는 만큼 추가해보기
  { id: 5, postId: 2, author: '익명', text: '프로젝트를 진행하는건가요?', date: '한시간 전'},
];

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<Comment>) {
      state.push(action.payload);
    },
    deleteComment(state, action: PayloadAction<number>) {
      return state.filter(comment => comment.id !== action.payload);
    },
  },
});

export const { addComment, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;
