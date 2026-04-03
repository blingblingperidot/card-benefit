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
    headerRow: { flexDirection: 'row', backgroundColor: '#f5f5f5', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: '#ddd', borderTopWidth: 1, borderTopColor: '#ddd' },
    headerCell: { fontWeight: 'bold', fontSize: 11, paddingHorizontal: 4, textAlign: 'center' },
    row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
    cell: { fontSize: 11, paddingHorizontal: 4, textAlign: 'center' },
    deleteButton: { backgroundColor: '#E24B4A', padding: 6, borderRadius: 4, alignItems: 'center' },
    deleteButtonText: { color: '#fff', fontSize: 11 },
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
  //                        그리드 컬럼 정의
  // ==============================================================
  const columns = [
    { key: 'BENEFIT_ID', label: '혜택ID', flex: 1.2 },
    { key: 'CARD_TYPE', label: '카드종류', flex: 1.2 },
    { key: 'STORE_NAME', label: '매장명', flex: 1.2 },
    { key: 'DESCRIPTION', label: '설명', flex: 2 },
  ];

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>관리자 페이지</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* 헤더 */}
      <View style={styles.headerRow}>
        {columns.map((col) => (
          <Text key={col.key} style={[styles.headerCell, { flex: col.flex }]}>{col.label}</Text>
        ))}
        <Text style={[styles.headerCell, { flex: 0.8 }]}>삭제</Text>
      </View>

      {/* 바디 */}
      {loading ? (
        <Text style={styles.loading}>로딩 중...</Text>
      ) : benefits.length === 0 ? (
        <Text style={styles.empty}>등록된 혜택이 없습니다.</Text>
      ) : (
        <FlatList
          data={benefits}
          keyExtractor={(item) => item.BENEFIT_ID}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {columns.map((col) => (
                <Text key={col.key} style={[styles.cell, { flex: col.flex }]} numberOfLines={1}>{item[col.key]}</Text>
              ))}
              <View style={{ flex: 0.8, alignItems: 'center' }}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.BENEFIT_ID)}>
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
              </View>
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