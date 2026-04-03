import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BenefitListScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const { cardName } = useLocalSearchParams();
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    error: { color: 'red', marginBottom: 8, textAlign: 'center' },
    loading: { textAlign: 'center', color: '#666', marginTop: 40 },
    empty: { textAlign: 'center', color: '#666', marginTop: 40 },
    card: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16, marginBottom: 12 },
    storeName: { fontWeight: 'bold', fontSize: 16 },
    description: { color: '#666', marginTop: 4 },
    location: { color: '#999', fontSize: 12, marginTop: 4 },
    homeButton: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    homeButtonText: { color: '#4A90E2' }
  });

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      const response = await api.get(`/api/benefits/getCardBenefit?userId=${userId}`);
      setBenefits(response.data);
    } catch (err) {
      setError('혜택 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{cardName} 혜택 목록</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <Text style={styles.loading}>로딩 중...</Text>
      ) : benefits.length === 0 ? (
        <Text style={styles.empty}>등록된 혜택이 없습니다.</Text>
      ) : (
        <FlatList
          data={benefits}
          keyExtractor={(item) => item.BENEFIT_ID}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.storeName}>{item.STORE_NAME}</Text>
              <Text style={styles.description}>{item.DESCRIPTION}</Text>
              <Text style={styles.location}>
                위도: {item.LATITUDE} / 경도: {item.LONGITUDE}
              </Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.replace('/(main)/cardlist')}>
        <Text style={styles.homeButtonText}>카드 목록으로</Text>
      </TouchableOpacity>
    </View>
  );
}