import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function PaymentCompleteScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emoji: { fontSize: 60, marginBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { color: '#666', marginBottom: 8, textAlign: 'center' },
    countdown: { color: '#999', fontSize: 14, marginBottom: 32 },
    button: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', width: 200, marginBottom: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    homeButton: { borderWidth: 1, borderColor: '#ccc', padding: 14, borderRadius: 8, alignItems: 'center', width: 200 },
    homeButtonText: { color: '#666' },
  });

  // ==============================================================
  //                        카운트다운 후 자동 이동
  // ==============================================================
  useEffect(() => {
    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        router.replace('/(main)/cardlist');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>✅</Text>
      <Text style={styles.title}>결제 완료!</Text>
      <Text style={styles.subtitle}>결제가 정상적으로 완료되었습니다.</Text>
      <Text style={styles.countdown}>{countdown}초 후 카드 목록으로 이동합니다.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(main)/cardlist')}>
        <Text style={styles.buttonText}>카드 목록으로</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.replace('/(main)/home')}>
        <Text style={styles.homeButtonText}>홈으로</Text>
      </TouchableOpacity>
    </View>
  );
}