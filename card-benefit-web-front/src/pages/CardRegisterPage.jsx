import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CardRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ cardName: '', cardType: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.cardName || !form.cardType) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    try {
      await api.post('/api/cards/insertcards', form);
      alert('카드 등록 성공!');
      navigate('/card/list');
    } catch (err) {
      setError('카드 등록 실패');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>카드 등록</h2>
      <input
        name="cardName"
        placeholder="카드명 (예: 삼성ID_ON카드)"
        value={form.cardName}
        onChange={handleChange}
        style={{ margin: '8px', padding: '8px', width: '300px' }}
      />
      <input
        name="cardType"
        placeholder="카드 종류 (예: SAMSUNG_ID_ON)"
        value={form.cardType}
        onChange={handleChange}
        style={{ margin: '8px', padding: '8px', width: '300px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handleRegister}
        style={{ margin: '8px', padding: '8px 24px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        등록
      </button>
      <button
        onClick={() => navigate('/card/list')}
        style={{ margin: '8px', padding: '8px 24px', cursor: 'pointer' }}>
        취소
      </button>
    </div>
  );
}

export default CardRegisterPage;