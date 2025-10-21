import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WEBSOCKET_URL } from './env';

export type StompConn = {
  client: Client;
  subscribe: (destination: string, onMessage: (msg: IMessage) => void) => StompSubscription | null;
  send: (destination: string, body?: any) => void;
  disconnect: () => Promise<void>;
};

export function createStompConnection(token?: string): StompConn {
  const client = new Client({
    webSocketFactory: () => new SockJS(WEBSOCKET_URL),
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: () => {}, // 디버그 로그 비활성화
    onConnect: () => {
      console.log('[채팅] 실시간 연결 성공');
    },
    onStompError: () => {
      // 에러 무시 (ngrok 환경에서는 정상)
    },
    onWebSocketError: () => {
      // 에러 무시
    },
  });

  client.activate();

  return {
    client,
    subscribe: (destination, onMessage) => {
      if (!client.connected) return null;
      return client.subscribe(destination, onMessage);
    },
    send: (destination, body) => {
      if (!client.connected) return;
      client.publish({ destination, body: body ? JSON.stringify(body) : undefined });
    },
    disconnect: async () => {
      if (client.active) await client.deactivate();
    },
  };
}


