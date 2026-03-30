import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userId: '', password: '', nickname: '', email: '' });
  const [idCheck, setIdCheck] = useState({ checked: false, isDuplicate: false, message: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'userId') {
      setIdCheck({ checked: false, isDuplicate: false, message: '' });
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
      alert('회원가입 성공!');
      navigate('/login');
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>회원가입</h2>

      <div style={{ display: 'flex', margin: '8px' }}>
        <input
          name="userId"
          placeholder="아이디"
          value={form.userId}
          onChange={handleChange}
          style={{ padding: '8px', width: '240px' }}
        />
        <button onClick={handleCheckId} style={{ padding: '8px', marginLeft: '8px' }}>
          중복확인
        </button>
      </div>
      {idCheck.message && (
        <p style={{ color: idCheck.isDuplicate ? 'red' : 'green' }}>{idCheck.message}</p>
      )}

      <input
        name="password"
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
        style={{ margin: '8px', padding: '8px', width: '300px' }}
      />
      <input
        name="nickname"
        placeholder="닉네임"
        value={form.nickname}
        onChange={handleChange}
        style={{ margin: '8px', padding: '8px', width: '300px' }}
      />
      <input
        name="email"
        placeholder="이메일 (선택)"
        value={form.email}
        onChange={handleChange}
        style={{ margin: '8px', padding: '8px', width: '300px' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleSignup} style={{ margin: '8px', padding: '8px 24px' }}>
        회원가입
      </button>
      <p>이미 계정이 있으신가요? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/login')}>로그인</span></p>
    </div>
  );
}

export default SignupPage;