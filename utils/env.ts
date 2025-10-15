import Constants from 'expo-constants';
import { Platform } from 'react-native';

type Extra = {
  API_BASE_URL?: string;
  WEBSOCKET_URL?: string;
};

const extra: Extra = (Constants.expoConfig as any)?.extra || (Constants.manifest as any)?.extra || {};

function resolveHostFromExpo(): string | null {
  // Try to extract development host (Metro) to derive LAN IP
  const hostUri: string | undefined = (Constants.expoConfig as any)?.hostUri || (Constants.manifest as any)?.hostUri;
  if (!hostUri) return null;
  const host = hostUri.split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;
  return host;
}

const devHost = resolveHostFromExpo();

function defaultHostByPlatform(): string {
  if (Platform.OS === 'ios') {
    // iOS 시뮬레이터는 Mac의 localhost로 접근 가능
    return 'localhost';
  }
  // Android 에뮬레이터는 10.0.2.2가 호스트 머신의 localhost
  return '10.0.2.2';
}

const host = devHost || defaultHostByPlatform();

export const API_BASE_URL: string = extra.API_BASE_URL || `http://${host}:8080`;
export const WEBSOCKET_URL: string = extra.WEBSOCKET_URL || `http://${host}:8080/ws`;


