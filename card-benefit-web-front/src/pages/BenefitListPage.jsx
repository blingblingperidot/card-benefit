import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

function BenefitListPage() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const location = useLocation();
  const { cardType, cardName, cardId } = location.state || {};
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
      const response = await api.get(`/api/benefits/getCardBenefit?cardType=${cardType}`);
      setBenefits(response.data);
    } catch (err) {
      setError('혜택 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        할인 정보 표시
  // ==============================================================
  const getDiscountText = (benefit) => {
    if (benefit.DISCOUNT_TYPE === 'RATE')   return `${benefit.DISCOUNT_RATE}% 할인`;
    if (benefit.DISCOUNT_TYPE === 'AMOUNT') return `${benefit.DISCOUNT_PRICE}원 할인`;
    if (benefit.DISCOUNT_TYPE === 'POINT')  return `${benefit.POINT_AMOUNT}P 적립`;
    return null;
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
            <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{benefit.STORE_NAME}</p>
            <p style={{ color: '#666', fontSize: '14px' }}>{benefit.DESCRIPTION}</p>
            {getDiscountText(benefit) && (
              <p style={{ color: '#4A90E2', fontWeight: 'bold', fontSize: '14px' }}>
                {getDiscountText(benefit)}
              </p>
            )}
            <button
              onClick={() => navigate('/product/list', {
                state: {
                  storeName: benefit.STORE_NAME,
                  benefit:   benefit,
                  cardId:    cardId,
                  cardType:  cardType,
                  cardName:  cardName,
                }
              })}
              style={{ marginTop: '8px', width: '100%', padding: '8px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              상품 보기
            </button>
          </div>
        ))
      )}
      <button
        onClick={() => navigate('/card/list')}
        style={{ marginTop: '16px', padding: '10px 24px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '8px' }}>
        카드 목록으로
      </button>
    </div>
  );
}

export default BenefitListPage;