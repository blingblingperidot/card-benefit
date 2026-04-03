import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function LoginPage({ setToken }) {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const [form, setForm] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');

  // ==============================================================
  //                        데이터 저장 처리
  // ==============================================================
  const handleLogin = async () => {
    try {
      const response = await api.post('/api/users/login', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('usrTpCd', response.data.usrTpCd);
      setToken(response.data.token);
      navigate('/home');
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==============================================================
  //                        필드 정의
  // ==============================================================
  const fields = [
    { name: 'userId', placeholder: '아이디', type: 'text' },
    { name: 'password', placeholder: '비밀번호', type: 'password' },
  ];

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>로그인</h2>
      {fields.map((field) => (
        <input
          key={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={form[field.name]}
          onChange={handleChange}
          style={{ margin: '8px', padding: '8px', width: '300px' }}
        />
      ))}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handleLogin}
        style={{ margin: '8px', padding: '8px 24px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        로그인
      </button>
      <p>계정이 없으신가요?
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => navigate('/signup')}>
          회원가입
        </span>
      </p>
    </div>
  );
}

export default LoginPage;