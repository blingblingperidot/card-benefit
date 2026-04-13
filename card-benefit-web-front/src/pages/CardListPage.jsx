import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CardListPage() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cards/getcards');
      setCards(response.data);
    } catch (err) {
      setError('카드 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handleDelete = async (cardId) => {
    try {
      await api.post('/api/cards/deletecards', { cardId });
      fetchCards();
    } catch (err) {
      setError('카드 삭제 실패');
    }
  };

  const handleBenefitList = (cardType, cardName, cardId) => {
    navigate('/benefit/list', { state: { cardType, cardName, cardId } });
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>내 카드 목록</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>로딩 중...</p>
      ) : cards.length === 0 ? (
        <p>등록된 카드가 없습니다.</p>
      ) : (
        cards.map((card) => (
          <div key={card.CARD_ID} style={{
            width: '300px', border: '1px solid #ccc', borderRadius: '8px',
            padding: '16px', margin: '8px', display: 'flex', justifyContent: 'space-between'
          }}>
            <div
              style={{ cursor: 'pointer', flex: 1 }}
              onClick={() => handleBenefitList(card.CARD_TYPE, card.CARD_NAME, card.CARD_ID)}>
              <p style={{ fontWeight: 'bold' }}>{card.CARD_NAME}</p>
              <p style={{ color: '#666' }}>{card.CARD_TYPE}</p>
            </div>
            <button
              onClick={() => handleDelete(card.CARD_ID)}
              style={{ backgroundColor: '#E24B4A', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer' }}>
              삭제
            </button>
          </div>
        ))
      )}
      <button
        onClick={() => navigate('/card/register')}
        style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        카드 등록
      </button>
      <button
        onClick={() => navigate('/home')}
        style={{ marginTop: '8px', padding: '10px 24px', cursor: 'pointer' }}>
        홈으로
      </button>
    </div>
  );
}

export default CardListPage;