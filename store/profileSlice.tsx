import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  name: '',
  nickname: '',
  email: '',
  birth: '',
  department: '',
  studentId: '',
  age: '',
  height: '',
  phone: '',
  joinDate: '',
  mbti: '',
  interests: [],
  gender: '',
  beans: '',
  friends: '',
  posts: '',
  comments: '',
  Prefer: '꺼짐',
  nonPrefer: '꺼짐',
  prefer: '꺼짐'
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
