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
    reconnectDelay: 3000,
    debug: () => {},
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


