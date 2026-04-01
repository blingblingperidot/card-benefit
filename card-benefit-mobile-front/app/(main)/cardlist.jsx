import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api/axios';

export default function CardListScreen() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await api.get('/api/cards/getcards');
      setCards(response.data);
    } catch (err) {
      setError('카드 목록 조회 실패');
    }
  };

  const handleDelete = async (cardId) => {
    try {
      await api.post('/api/cards/deletecards', { cardId });
      fetchCards();
    } catch (err) {
      setError('카드 삭제 실패');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 카드 목록</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {cards.length === 0 ? (
        <Text style={styles.empty}>등록된 카드가 없습니다.</Text>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.CARD_ID}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.cardName}>{item.CARD_NAME}</Text>
                <Text style={styles.cardType}>{item.CARD_TYPE}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.CARD_ID)}>
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(main)/cardregister')}>
        <Text style={styles.buttonText}>카드 등록</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.replace('/(main)/home')}>
        <Text style={styles.homeButtonText}>홈으로</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  error: { color: 'red', marginBottom: 8, textAlign: 'center' },
  empty: { textAlign: 'center', color: '#666', marginTop: 40 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16, marginBottom: 12 },
  cardName: { fontWeight: 'bold', fontSize: 16 },
  cardType: { color: '#666', marginTop: 4 },
  deleteButton: { backgroundColor: '#E24B4A', padding: 8, borderRadius: 4 },
  deleteButtonText: { color: '#fff' },
  button: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  homeButton: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  homeButtonText: { color: '#4A90E2' }
});