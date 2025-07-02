export type Gender = '남' | '여';

export interface Participant {
  id: number;
  name: string;
  gender: Gender;
  department: string;
  age: number;
  studentId: string;
  mbti: string;
  interests: string[];
}

export interface MeetingRoom {
  id: number;
  title: string;
  participants: Participant[];
  type?: 'pair' | 'mixed';
}

export type RootStackParamList = {
  Chat: undefined;
  Home: undefined;
  Lounge: undefined;
  Meeting: undefined;
  Profile: undefined;
  ProfileDetail: undefined;
  BottomTabs: undefined;
  Settings: undefined;
  RoomDetail: { room: MeetingRoom };
  PostDetail: { postId: number };
  ChatRoom: { roomId: number };
};


