import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import { Provider } from 'react-redux';
import { store } from './store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, loginSuccess } from './store/authSlice';
import { API_BASE_URL } from './utils/env';

function Bootstrapper(): React.JSX.Element {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        dispatch(setToken(token));
        try {
          const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const me = await res.json();
            dispatch(loginSuccess(me));
          }
        } catch {}
      }
    })();
  }, [dispatch]);
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

export default function App() :React.JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Bootstrapper />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
