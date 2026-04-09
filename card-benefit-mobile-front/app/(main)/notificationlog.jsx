import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api/axios';

export default function NotificationLogScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchUserId, setSearchUserId] = useState('');

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    error: { color: 'red', marginBottom: 8, textAlign: 'center' },
    loading: { textAlign: 'center', color: '#666', marginTop: 40 },
    empty: { textAlign: 'center', color: '#666', marginTop: 40 },
    searchRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, fontSize: 14 },
    searchButton: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 6, justifyContent: 'center' },
    searchButtonText: { color: '#fff', fontWeight: 'bold' },
    card: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 14, marginBottom: 10 },
    logId: { color: '#999', fontSize: 11 },
    userId: { fontWeight: 'bold', fontSize: 15, marginTop: 4 },
    benefitId: { color: '#666', marginTop: 2 },
    statusRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
    statusLabel: { fontSize: 12, color: '#999' },
    statusOk: { fontSize: 12, color: '#27ae60', fontWeight: 'bold' },
    statusError: { fontSize: 12, color: '#E24B4A', fontWeight: 'bold' },
    statusNull: { fontSize: 12, color: '#999' },
    errorMsg: { color: '#E24B4A', fontSize: 12, marginTop: 4 },
    createdAt: { color: '#999', fontSize: 11, marginTop: 4 },
    refreshButton: { backgroundColor: '#1D9E75', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
    backButton: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: '#ccc' },
    backButtonText: { color: '#333' },
    homeButton: { backgroundColor: '#E24B4A', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
  });

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/notifications/getNotificationList', {
        params: { userId: searchUserId.trim() }
      });
      setLogs(response.data);
    } catch (err) {
      setError('알림 이력 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handleRefreshFcmStatus = async () => {
    try {
      const ids = logs
        .filter(log => log.EXPO_MESSAGE_ID && !log.FCM_STATUS)
        .map(log => log.EXPO_MESSAGE_ID);

      if (ids.length === 0) {
        Alert.alert('알림', '갱신할 항목이 없습니다.');
        return;
      }

      await api.post('/api/notifications/refreshFcmStatus', { ids });
      await fetchLogs();
      Alert.alert('알림', 'FCM 상태 갱신 완료');
    } catch (err) {
      setError('FCM 상태 갱신 실패');
    }
  };

  const getStatusStyle = (value) => {
    if (value === 'OK') return styles.statusOk;
    if (value === 'ERROR') return styles.statusError;
    return styles.statusNull;
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림 이력</Text>

      {/* 검색 영역 */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={searchUserId}
          onChangeText={setSearchUserId}
          onSubmitEditing={fetchLogs}
          placeholder="사용자 ID "
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchLogs}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <Text style={styles.loading}>로딩 중...</Text>
      ) : logs.length === 0 ? (
        <Text style={styles.empty}>알림 이력이 없습니다.</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.LOG_ID}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.logId}>{item.LOG_ID}</Text>
              <Text style={styles.userId}>{item.USER_ID}</Text>
              <Text style={styles.benefitId}>{item.BENEFIT_ID}</Text>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Expo</Text>
                <Text style={getStatusStyle(item.EXPO_STATUS)}>{item.EXPO_STATUS ?? '-'}</Text>
                <Text style={styles.statusLabel}>FCM</Text>
                <Text style={getStatusStyle(item.FCM_STATUS)}>{item.FCM_STATUS ?? '-'}</Text>
              </View>
              {item.ERROR_MESSAGE && <Text style={styles.errorMsg}>{item.ERROR_MESSAGE}</Text>}
              <Text style={styles.createdAt}>{item.CREATED_AT}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshFcmStatus}>
        <Text style={styles.buttonText}>FCM 상태 갱신</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>뒤로</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/(main)/home')}>
        <Text style={styles.buttonText}>홈으로</Text>
      </TouchableOpacity>
    </View>
  );
}