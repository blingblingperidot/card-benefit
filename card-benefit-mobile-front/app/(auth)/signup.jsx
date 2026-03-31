import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api/axios';

export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ userId: '', password: '', nickname: '', email: '' });
  const [idCheck, setIdCheck] = useState({ checked: false, isDuplicate: false, message: '' });
  const [error, setError] = useState('');

  const handleCheckId = async () => {
    if (!form.userId) {
      setError('아이디를 입력해주세요.');
      return;
    }
    try {
      const response = await api.get(`/api/users/check-id?userId=${form.userId}`);
      setIdCheck({
        checked: true,
        isDuplicate: response.data.isDuplicate,
        message: response.data.message
      });
    } catch (err) {
      setError('중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSignup = async () => {
    if (!idCheck.checked || idCheck.isDuplicate) {
      setError('아이디 중복확인을 해주세요.');
      return;
    }
    if (!form.password || !form.nickname) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    try {
      await api.post('/api/users/signup', form);
      Alert.alert('회원가입 성공!');
      router.replace('/(auth)/login');
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="아이디"
          value={form.userId}
          onChangeText={(text) => {
            setForm({ ...form, userId: text });
            setIdCheck({ checked: false, isDuplicate: false, message: '' });
          }}
        />
        <TouchableOpacity style={styles.checkButton} onPress={handleCheckId}>
          <Text style={styles.checkButtonText}>중복확인</Text>
        </TouchableOpacity>
      </View>
      {idCheck.message ? (
        <Text style={{ color: idCheck.isDuplicate ? 'red' : 'green', marginBottom: 8 }}>
          {idCheck.message}
        </Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={form.nickname}
        onChangeText={(text) => setForm({ ...form, nickname: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일 (선택)"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.link}>이미 계정이 있으신가요? 로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 12 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  checkButton: { backgroundColor: '#4A90E2', padding: 12, borderRadius: 8, marginLeft: 8 },
  checkButtonText: { color: '#fff' },
  error: { color: 'red', marginBottom: 8 },
  button: { width: '100%', backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#4A90E2' }
});