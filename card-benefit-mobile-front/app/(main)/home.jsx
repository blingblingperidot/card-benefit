import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/(auth)/login');
      }
    };
    checkToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈</Text>
      <Text style={styles.subtitle}>카드 혜택 위치기반 알림 시스템</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(main)/cardlist')}>
        <Text style={styles.buttonText}>내 카드 목록</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  button: { width: '100%', backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  logoutButton: { width: '100%', backgroundColor: '#E24B4A', padding: 14, borderRadius: 8, alignItems: 'center' },
  logoutButtonText: { color: '#fff', fontWeight: 'bold' }
});