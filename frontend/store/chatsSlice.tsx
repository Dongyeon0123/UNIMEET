import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatRoom {
  id: number;
  name: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  profileColor: string;
  memberCount: number;
}

const initialState: ChatRoom[] = [
  {
    id: 1,
    name: 'React 스터디',
    lastMessage: '내일 7시에 만나요!',
    lastTime: '1분 전',
    unread: 2,
    profileColor: '#6846FF',
    memberCount: 3,
  },
  {
    id: 2,
    name: '에브리타임 채팅',
    lastMessage: 'ㅋㅋㅋㅋㅋㅋㅋㅋㅋ',
    lastTime: '5분 전',
    unread: 0,
    profileColor: '#FF62D5',
    memberCount: 4,
  },
  {
    id: 3,
    name: '수업팀플',
    lastMessage: '자료 올렸어요!',
    lastTime: '어제',
    unread: 1,
    profileColor: '#FF9800',
    memberCount: 3,
  },
];

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    updateRoom(state, action: PayloadAction<ChatRoom>) {
      const idx = state.findIndex(r => r.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
  },
});

export const { updateRoom } = chatsSlice.actions;
export default chatsSlice.reducer;
