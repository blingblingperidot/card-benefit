import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import api from '../../api/axios';

export default function LoginScreen() {

  // ==============================================================
  //                        변수 정의s
  // ==============================================================
  const router = useRouter();
  const [form, setForm] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
    input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
    error: { color: 'red', marginBottom: 8 },
    button: { width: '100%', backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { color: '#4A90E2' }
  });

  // ==============================================================
  //                        데이터 저장 처리
  // ==============================================================
  const handleLogin = async () => {
    try {
      const response = await api.post('/api/users/login', form);
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userId', response.data.userId);
      await AsyncStorage.setItem('usrTpCd', response.data.usrTpCd);

      await registerFcmToken(response.data.token);

      router.replace('/(main)/home');
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const registerFcmToken = async (jwtToken) => {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      const fcmToken = await Notifications.getExpoPushTokenAsync({
        projectId: '7d85980c-7ae1-435b-9a58-5f60c2435bd1'
      });

      await api.post('/api/users/fcm-token', { fcmToken: fcmToken.data }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
    } catch (err) {
      console.log('FCM 토큰 등록 실패:', err);
    }
  };

  // ==============================================================
  //                        필드 정의
  // ==============================================================
  const fields = [
    { key: 'userId', placeholder: '아이디', secure: false },
    { key: 'password', placeholder: '비밀번호', secure: true },
  ];

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      {fields.map((field) => (
        <TextInput
          key={field.key}
          style={styles.input}
          placeholder={field.placeholder}
          secureTextEntry={field.secure}
          value={form[field.key]}
          onChangeText={(text) => setForm({ ...form, [field.key]: text })}
        />
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.link}>계정이 없으신가요? 회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}