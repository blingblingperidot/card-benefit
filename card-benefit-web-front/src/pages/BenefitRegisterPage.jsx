import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function BenefitRegisterPage() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cardType: '',
    storeName: '',
    latitude: '',
    longitude: '',
    description: ''
  });
  const [error, setError] = useState('');

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
      alert('혜택 등록 성공!');
      navigate('/admin');
    } catch (err) {
      setError('혜택 등록 실패');
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
    { name: 'cardType', placeholder: '카드 종류 (예: SAMSUNG_ID_ON)', required: true },
    { name: 'storeName', placeholder: '매장명', required: true },
    { name: 'latitude', placeholder: '위도', required: true },
    { name: 'longitude', placeholder: '경도', required: true },
    { name: 'description', placeholder: '설명', required: false },
  ];

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>혜택 등록</h2>
      <div style={{ width: '400px' }}>
        {fields.map((field) => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder + (field.required ? ' *' : '')}
            value={form[field.name]}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        ))}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleInsert}
            style={{ flex: 1, padding: '10px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            등록
          </button>
          <button
            onClick={() => navigate('/admin')}
            style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default BenefitRegisterPage;