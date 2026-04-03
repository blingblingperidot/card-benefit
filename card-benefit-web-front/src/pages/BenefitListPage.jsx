import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

function BenefitListPage() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const location = useLocation();
  const { cardName } = location.state || {};
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const response = await api.get(`/api/benefits/getCardBenefit?userId=${userId}`);
      setBenefits(response.data);
    } catch (err) {
      setError('혜택 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>{cardName} 혜택 목록</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>로딩 중...</p>
      ) : benefits.length === 0 ? (
        <p>등록된 혜택이 없습니다.</p>
      ) : (
        benefits.map((benefit) => (
          <div key={benefit.BENEFIT_ID} style={{
            width: '350px', border: '1px solid #ccc', borderRadius: '8px',
            padding: '16px', margin: '8px'
          }}>
            <p style={{ fontWeight: 'bold' }}>{benefit.STORE_NAME}</p>
            <p style={{ color: '#666' }}>{benefit.DESCRIPTION}</p>
            <p style={{ color: '#999', fontSize: '12px' }}>
              위도: {benefit.LATITUDE} / 경도: {benefit.LONGITUDE}
            </p>
          </div>
        ))
      )}
      <button
        onClick={() => navigate('/card/list')}
        style={{ marginTop: '16px', padding: '10px 24px', cursor: 'pointer' }}>
        카드 목록으로
      </button>
    </div>
  );
}

export default BenefitListPage;