import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api/axios';

export default function CardRegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ cardName: '', cardType: '' });
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!form.cardName || !form.cardType) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    try {
      await api.post('/api/cards/insertcards', form);
      Alert.alert('카드 등록 성공!');
      router.replace('/(main)/cardlist');
    } catch (err) {
      setError('카드 등록 실패');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>카드 등록</Text>
      <TextInput
        style={styles.input}
        placeholder="카드명 (예: 삼성ID_ON카드)"
        value={form.cardName}
        onChangeText={(text) => setForm({ ...form, cardName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="카드 종류 (예: SAMSUNG_ID_ON)"
        value={form.cardType}
        onChangeText={(text) => setForm({ ...form, cardType: text })}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>등록</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.replace('/(main)/cardlist')}>
        <Text style={styles.cancelButtonText}>취소</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  error: { color: 'red', marginBottom: 8 },
  button: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: { padding: 14, borderRadius: 8, alignItems: 'center' },
  cancelButtonText: { color: '#4A90E2' }
});