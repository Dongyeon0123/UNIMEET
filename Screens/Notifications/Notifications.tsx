import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import GradientScreen from '../../component/GradientScreen';
import Header from '../../navigation/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../utils/env';
import { createStompConnection, StompConn } from '../../utils/stomp';

const Notifications: React.FC = () => {
  const token = useSelector((s: RootState) => s.auth.token);
  const [items, setItems] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [conn, setConn] = useState<StompConn | null>(null);

  const load = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.notifications || []);
        setItems(list);
      }
      const u = await fetch(`${API_BASE_URL}/api/notifications/unread/count`, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
      });
      if (u.ok) {
        const { unreadCount } = await u.json();
        setUnreadCount(unreadCount ?? 0);
      }
    } catch {}
  };

  useEffect(() => {
    load();
  }, [token]);

  useEffect(() => {
    const c = createStompConnection(token || undefined);
    setConn(c);
    const interval = setInterval(() => {
      if (c.client.connected) {
        clearInterval(interval);
        c.subscribe('/user/queue/notifications', (msg) => {
          try {
            const payload = JSON.parse(msg.body);
            setItems(prev => [payload, ...prev]);
            setUnreadCount(prev => prev + 1);
          } catch {}
        });
      }
    }, 200);
    return () => { c.disconnect(); };
  }, [token]);

  const markRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
      });
      if (res.ok) load();
    } catch (e: any) { Alert.alert('오류', e?.message || '실패'); }
  };

  const markAll = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: 'POST',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
      });
      if (res.ok) load();
    } catch (e: any) { Alert.alert('오류', e?.message || '실패'); }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
      });
      if (res.ok) load();
    } catch (e: any) { Alert.alert('오류', e?.message || '실패'); }
  };

  return (
    <GradientScreen>
      <Header title={`알림 (${unreadCount})`} onNotificationPress={() => {}} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btn} onPress={markAll}><Text style={styles.btnText}>전체 읽음</Text></TouchableOpacity>
        </View>
        {items.map((n) => (
          <View key={n.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{n.title || n.type}</Text>
              <Text style={styles.msg}>{n.message}</Text>
              <Text style={styles.time}>{n.createdAt}</Text>
            </View>
            <View style={styles.row}>
              {!n.isRead && (
                <TouchableOpacity onPress={() => markRead(n.id)} style={styles.smallBtn}><Text style={styles.smallText}>읽음</Text></TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => remove(n.id)} style={styles.smallBtn}><Text style={styles.smallText}>삭제</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 30 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, marginBottom: 10 },
  btn: { backgroundColor: '#6846FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  title: { fontWeight: '700', color: '#333', marginBottom: 4 },
  msg: { color: '#555' },
  time: { color: '#aaa', fontSize: 11, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  smallBtn: { backgroundColor: '#eee', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, marginLeft: 8 },
  smallText: { color: '#333', fontSize: 12 },
});

export default Notifications;


