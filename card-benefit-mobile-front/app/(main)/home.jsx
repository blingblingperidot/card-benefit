import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const [usrTpCd, setUsrTpCd] = useState('');

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
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
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      const storedUsrTpCd = await AsyncStorage.getItem('usrTpCd');
      if (!token) {
        router.replace('/(auth)/login');
      } else {
        setUsrTpCd(storedUsrTpCd);
      }
    };
    checkToken();
  }, []);

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handleLogout = async () => {
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