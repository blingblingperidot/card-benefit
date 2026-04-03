import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api/axios';

export default function AdminPageScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    error: { color: 'red', marginBottom: 8, textAlign: 'center' },
    loading: { textAlign: 'center', color: '#666', marginTop: 40 },
    empty: { textAlign: 'center', color: '#666', marginTop: 40 },
    card: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardInfo: { flex: 1 },
    benefitId: { color: '#999', fontSize: 12 },
    storeName: { fontWeight: 'bold', fontSize: 16, marginTop: 4 },
    cardType: { color: '#666', marginTop: 4 },
    description: { color: '#999', fontSize: 12, marginTop: 4 },
    deleteButton: { backgroundColor: '#E24B4A', padding: 8, borderRadius: 4, marginLeft: 8 },
    deleteButtonText: { color: '#fff' },
    button: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
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
      const response = await api.get('/api/benefits/getAllBenefits');
      setBenefits(response.data);
    } catch (err) {
      setError('혜택 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handleDelete = async (benefitId) => {
    try {
      await api.post('/api/benefits/deletebenefit', { benefitId });
      fetchBenefits();
    } catch (err) {
      setError('혜택 삭제 실패');
    }
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>관리자 페이지</Text>
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
              <View style={styles.cardInfo}>
                <Text style={styles.benefitId}>{item.BENEFIT_ID}</Text>
                <Text style={styles.storeName}>{item.STORE_NAME}</Text>
                <Text style={styles.cardType}>{item.CARD_TYPE}</Text>
                <Text style={styles.description}>{item.DESCRIPTION}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.BENEFIT_ID)}>
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(main)/benefitregister')}>
        <Text style={styles.buttonText}>혜택 등록</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.replace('/(main)/home')}>
        <Text style={styles.homeButtonText}>홈으로</Text>
      </TouchableOpacity>
    </View>
  );
}