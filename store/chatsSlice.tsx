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

const initialState: ChatRoom[] = [];

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
