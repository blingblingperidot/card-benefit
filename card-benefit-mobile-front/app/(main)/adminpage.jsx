import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminPageScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
    button: { width: '100%', backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    purpleButton: { width: '100%', backgroundColor: '#9B59B6', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
    homeButton: { width: '100%', backgroundColor: '#E24B4A', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  });

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>관리자 페이지</Text>
      <Text style={styles.subtitle}>카드 혜택 위치기반 알림 시스템</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(main)/benefitmanage')}>
        <Text style={styles.buttonText}>혜택 관리</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.purpleButton}
        onPress={() => router.push('/(main)/notificationlog')}>
        <Text style={styles.buttonText}>알림 이력</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.replace('/(main)/home')}>
        <Text style={styles.buttonText}>홈으로</Text>
      </TouchableOpacity>
    </View>
  );
}