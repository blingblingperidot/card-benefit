import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await api.post('/api/users/login', form);
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>로그인</h2>
      <input
        name="userId"
        placeholder="아이디"
        value={form.userId}
        onChange={handleChange}
        style={{ margin: '8px', padding: '8px', width: '300px' }}
      />
      <input
        name="password"
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
        style={{ margin: '8px', padding: '8px', width: '300px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin} style={{ margin: '8px', padding: '8px 24px' }}>
        로그인
      </button>
      <p>계정이 없으신가요? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/signup')}>회원가입</span></p>
    </div>
  );
}

export default LoginPage;