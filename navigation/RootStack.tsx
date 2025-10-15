import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Bottom from './Bottom';
import ProfileDetail from '../Screens/Profile/ProfileDetail';
import Settings from '../Screens/Profile/Settings';
import RoomDetail from '../Screens/Home/RoomDetail';
import Lounge from '../Screens/Lounge/Lounge';
import PostDetail from '../Screens/Lounge/PostDetail';
import WritePost from '../Screens/Lounge/WritePost';
import AIMatching from '../Screens/Home/AIMatching';
import Chat from '../Screens/Chat/Chat';
import ChatRoom from '../Screens/Chat/ChatRoom';
import Login from '../Screens/Auth/Login';
import Signup from '../Screens/Auth/Signup';
import OnboardingMBTI from '../Screens/Onboarding/OnboardingMBTI';
import OnboardingInterests from '../Screens/Onboarding/OnboardingInterests';
import OnboardingHeight from '../Screens/Onboarding/OnboardingHeight';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // 로그인하지 않은 경우 - 인증 및 온보딩 화면들 표시
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="OnboardingMBTI" component={OnboardingMBTI} />
          <Stack.Screen name="OnboardingInterests" component={OnboardingInterests} />
          <Stack.Screen name="OnboardingHeight" component={OnboardingHeight} />
        </>
      ) : (
        // 로그인한 경우 - 메인 앱 화면들 표시
        <>
          <Stack.Screen name="BottomTabs" component={Bottom} />
          <Stack.Screen name="RoomDetail" component={RoomDetail} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetail} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Lounge" component={Lounge} />
          <Stack.Screen name="PostDetail" component={PostDetail} />
          <Stack.Screen name="WritePost" component={WritePost} />
          <Stack.Screen name="AIMatching" component={AIMatching} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="ChatRoom" component={ChatRoom} />
        </>
      )}
    </Stack.Navigator>
  );
}
