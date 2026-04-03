import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api/axios';

export default function BenefitRegisterScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const [form, setForm] = useState({
    cardType: '',
    storeName: '',
    latitude: '',
    longitude: '',
    description: ''
  });
  const [error, setError] = useState('');

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

  // ==============================================================
  //                        데이터 저장 처리
  // ==============================================================
  const handleInsert = async () => {
    if (!form.cardType || !form.storeName || !form.latitude || !form.longitude) {
      setError('필수 항목을 입력해주세요.');
      return;
    }
    try {
      await api.post('/api/benefits/insertbenefit', form);
      Alert.alert('혜택 등록 성공!');
      router.replace('/(main)/adminpage');
    } catch (err) {
      setError('혜택 등록 실패');
    }
  };

  // ==============================================================
  //                        필드 정의
  // ==============================================================
  const fields = [
    { key: 'cardType', placeholder: '카드 종류 (예: SAMSUNG_ID_ON)', required: true },
    { key: 'storeName', placeholder: '매장명', required: true },
    { key: 'latitude', placeholder: '위도', required: true },
    { key: 'longitude', placeholder: '경도', required: true },
    { key: 'description', placeholder: '설명', required: false },
  ];

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>혜택 등록</Text>
      {fields.map((field) => (
        <TextInput
          key={field.key}
          style={styles.input}
          placeholder={field.placeholder + (field.required ? ' *' : '')}
          value={form[field.key]}
          onChangeText={(text) => setForm({ ...form, [field.key]: text })}
        />
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleInsert}>
        <Text style={styles.buttonText}>등록</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.replace('/(main)/adminpage')}>
        <Text style={styles.cancelButtonText}>취소</Text>
      </TouchableOpacity>
    </View>
  );
}