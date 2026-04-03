import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api/axios';

export default function SignupScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const [form, setForm] = useState({ userId: '', password: '', nickname: '', email: '' });
  const [idCheck, setIdCheck] = useState({ checked: false, isDuplicate: false, message: '' });
  const [error, setError] = useState('');

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
    row: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 12 },
    input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
    checkButton: { backgroundColor: '#4A90E2', padding: 12, borderRadius: 8, marginLeft: 8 },
    checkButtonText: { color: '#fff' },
    idCheckMessage: { marginBottom: 8 },
    error: { color: 'red', marginBottom: 8 },
    button: { width: '100%', backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { color: '#4A90E2' }
  });

  // ==============================================================
  //                        데이터 저장 처리
  // ==============================================================
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

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handleChange = (key, text) => {
    setForm({ ...form, [key]: text });
    if (key === 'userId') {
      setIdCheck({ checked: false, isDuplicate: false, message: '' });
    }
  };

  // ==============================================================
  //                        필드 정의
  // ==============================================================
  const fields = [
    { key: 'password', placeholder: '비밀번호', secure: true },
    { key: 'nickname', placeholder: '닉네임', secure: false },
    { key: 'email', placeholder: '이메일 (선택)', secure: false },
  ];

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="아이디"
          value={form.userId}
          onChangeText={(text) => handleChange('userId', text)}
        />
        <TouchableOpacity style={styles.checkButton} onPress={handleCheckId}>
          <Text style={styles.checkButtonText}>중복확인</Text>
        </TouchableOpacity>
      </View>

      {idCheck.message ? (
        <Text style={[styles.idCheckMessage, { color: idCheck.isDuplicate ? 'red' : 'green' }]}>
          {idCheck.message}
        </Text>
      ) : null}

      {fields.map((field) => (
        <TextInput
          key={field.key}
          style={styles.input}
          placeholder={field.placeholder}
          secureTextEntry={field.secure}
          value={form[field.key]}
          onChangeText={(text) => handleChange(field.key, text)}
        />
      ))}

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