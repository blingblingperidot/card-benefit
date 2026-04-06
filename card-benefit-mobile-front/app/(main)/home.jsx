import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import api from '../../api/axios';

export default function HomeScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const [usrTpCd, setUsrTpCd] = useState('');
  const [locationStatus, setLocationStatus] = useState('위치 권한 확인 중...');
  const intervalRef = useRef(null);

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 8 },
    locationStatus: { fontSize: 12, color: '#999', marginBottom: 24 },
    button: { width: '100%', backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    adminButton: { width: '100%', backgroundColor: '#9B59B6', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
    logoutButton: { width: '100%', backgroundColor: '#E24B4A', padding: 14, borderRadius: 8, alignItems: 'center' },
    logoutButtonText: { color: '#fff', fontWeight: 'bold' }
  });

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token');
      const storedUsrTpCd = await AsyncStorage.getItem('usrTpCd');
      if (!token) {
        router.replace('/(auth)/login');
        return;
      }
      setUsrTpCd(storedUsrTpCd);
      await startLocationTracking();
    };
    init();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startLocationTracking = async () => {
    // 위치 권한 요청
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationStatus('위치 권한이 거부되었습니다.');
      return;
    }

    setLocationStatus('위치 추적 중...');

    // 10초마다 위치 전송
    intervalRef.current = setInterval(async () => {
      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        await api.post('/api/locations/update', { latitude, longitude });
        setLocationStatus(`위치 전송 완료 (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
      } catch (err) {
        console.log('위치 전송 실패:', err);
      }
    }, 10000);
  };

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handleLogout = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('usrTpCd');
    router.replace('/(auth)/login');
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈</Text>
      <Text style={styles.subtitle}>카드 혜택 위치기반 알림 시스템</Text>
      <Text style={styles.locationStatus}>{locationStatus}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(main)/cardlist')}>
        <Text style={styles.buttonText}>내 카드 목록</Text>
      </TouchableOpacity>
      {usrTpCd === 'ADMIN' && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => router.push('/(main)/adminpage')}>
          <Text style={styles.buttonText}>관리자 페이지</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}