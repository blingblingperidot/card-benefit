import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api/axios';

export default function PaymentHistoryScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchUserId, setSearchUserId] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, fontSize: 13 },
    searchButton: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 6, justifyContent: 'center' },
    searchButtonText: { color: '#fff', fontWeight: 'bold' },
    statusRow: { flexDirection: 'row', gap: 6, marginBottom: 16, flexWrap: 'wrap' },
    statusButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#ccc' },
    statusButtonActive: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#4A90E2' },
    statusButtonText: { fontSize: 12, color: '#666' },
    statusButtonTextActive: { fontSize: 12, color: '#fff' },
    card: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 14, marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    label: { color: '#666', fontSize: 12 },
    value: { fontSize: 12, fontWeight: 'bold' },
    statusSuccess: { color: '#27ae60', fontWeight: 'bold' },
    statusFailed: { color: '#E24B4A', fontWeight: 'bold' },
    statusPending: { color: '#f39c12', fontWeight: 'bold' },
    statusCancelled: { color: '#999', fontWeight: 'bold' },
    error: { color: 'red', textAlign: 'center', marginBottom: 8 },
    empty: { textAlign: 'center', color: '#666', marginTop: 40 },
    loading: { textAlign: 'center', color: '#666', marginTop: 40 },
    backButton: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    backButtonText: { color: '#4A90E2' },
  });

  const statusList = ['', 'SUCCESS', 'FAILED', 'PENDING', 'CANCELLED'];

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    fetchLogs();
  }, [searchStatus]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchUserId.trim()) params.userId = searchUserId.trim();
      if (searchStatus) params.status = searchStatus;
      const response = await api.get('/api/payments/list', { params });
      setLogs(response.data);
    } catch (err) {
      setError('결제 내역 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        상태 색상
  // ==============================================================
  const getStatusStyle = (status) => {
    if (status === 'SUCCESS')   return styles.statusSuccess;
    if (status === 'FAILED')    return styles.statusFailed;
    if (status === 'PENDING')   return styles.statusPending;
    if (status === 'CANCELLED') return styles.statusCancelled;
    return {};
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>결제 내역</Text>

      {/* 검색 */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="사용자 ID"
          value={searchUserId}
          onChangeText={setSearchUserId}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchLogs}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* 상태 필터 */}
      <View style={styles.statusRow}>
        {statusList.map((s) => (
          <TouchableOpacity
            key={s}
            style={searchStatus === s ? styles.statusButtonActive : styles.statusButton}
            onPress={() => setSearchStatus(s)}>
            <Text style={searchStatus === s ? styles.statusButtonTextActive : styles.statusButtonText}>
              {s === '' ? '전체' : s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <Text style={styles.loading}>로딩 중...</Text>
      ) : logs.length === 0 ? (
        <Text style={styles.empty}>결제 내역이 없습니다.</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.PAYMENT_ID}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>결제ID</Text>
                <Text style={styles.value}>{item.PAYMENT_ID}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>사용자ID</Text>
                <Text style={styles.value}>{item.USER_ID}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>정가</Text>
                <Text style={styles.value}>{Number(item.AMOUNT).toLocaleString()}원</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>할인</Text>
                <Text style={styles.value}>{Number(item.DISCOUNT_AMOUNT).toLocaleString()}원</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>최종금액</Text>
                <Text style={styles.value}>{Number(item.FINAL_AMOUNT).toLocaleString()}원</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>상태</Text>
                <Text style={getStatusStyle(item.STATUS)}>{item.STATUS}</Text>
              </View>
              {item.ERROR_MESSAGE ? (
                <View style={styles.row}>
                  <Text style={styles.label}>오류</Text>
                  <Text style={[styles.value, { color: '#E24B4A', flex: 1, textAlign: 'right' }]} numberOfLines={2}>
                    {item.ERROR_MESSAGE}
                  </Text>
                </View>
              ) : null}
              <View style={styles.row}>
                <Text style={styles.label}>결제시각</Text>
                <Text style={styles.value}>{item.CREATED_AT}</Text>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}>
        <Text style={styles.backButtonText}>뒤로</Text>
      </TouchableOpacity>
    </View>
  );
}