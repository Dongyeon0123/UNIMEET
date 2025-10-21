import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../../navigation/Header';
import GradientScreen from '../../component/GradientScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../utils/env';

const Meeting :React.FC = () => {
  const handleNotificationPress = () => {
    alert('내 미팅 화면에서 알림을 눌렀습니다!');
  };

  const token = useSelector((state: RootState) => state.auth.token);
  const [myRooms, setMyRooms] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/meetings/my`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        });
        const text = await res.text();
        if (!res.ok) return setMyRooms([]);
        let data: any = {};
        try { data = JSON.parse(text); } catch {}
        const list = Array.isArray(data) ? data : (Array.isArray(data?.meetingRooms) ? data.meetingRooms : (Array.isArray(data?.content) ? data.content : []));
        setMyRooms(list || []);
      } catch {
        setMyRooms([]);
      }
    };
    load();
  }, [token]);

  return (

    <GradientScreen>
        
        <View style={styles.container}>
            {/* 헤더 */}
            <Header title="내 미팅" onNotificationPress={handleNotificationPress} />

            <ScrollView contentContainerStyle={styles.content}>
                {myRooms.length === 0 ? (
                  <Text style={styles.text}>신청한 미팅이 없습니다.</Text>
                ) : (
                  myRooms.map((r: any) => (
                    <View key={r.id} style={styles.card}>
                      <Text style={styles.title}>{r.title}</Text>
                      <Text style={styles.meta}>{(r.type === 'MIXED' ? '혼성' : '일반')} • 정원 {r.maxParticipants || r.capacity || r.max || '-'}명</Text>
                    </View>
                  ))
                )}
            </ScrollView>
        </View>

    </GradientScreen>
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  text: {
    fontSize: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: '#666',
  },
});

export default Meeting;
