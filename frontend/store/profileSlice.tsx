import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '이동연',
  nickname: '강아지똥',
  birth: '2001.01.23',
  department: '컴퓨터공학과',
  studentId: '20학번',
  age: '25',
  height: '175cm',
  phone: '010-3200-1951',
  joinDate: '2025.01.02',
  mbti: 'ESTP',
  interests: ['#운동', '#축구', '#게임', '#음악', '#영화', '#드라마'],
  beans: '0개',
  friends: '0명',
  posts: '0개',
  comments: '0개',
  Prefer: '꺼짐',
  nonPrefer: '꺼짐'
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      return { ...state, ...action.payload };
    }
  },
  selectors: {
    selectProfile: (sliceState) => sliceState,
  }
});

export const { updateProfile } = profileSlice.actions;
export const { selectProfile } = profileSlice.selectors;
export default profileSlice.reducer;
