import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  nickname: '',
  birth: '',
  department: '',
  studentId: '',
  age: '',
  height: '',
  phone: '',
  joinDate: '',
  mbti: '',
  interests: [],
  beans: '',
  friends: '',
  posts: '',
  comments: '',
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
