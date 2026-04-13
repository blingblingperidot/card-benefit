import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

function PaymentCompletePage() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(3);

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    const pgToken = new URLSearchParams(location.search).get('pg_token');
    const tid = sessionStorage.getItem('tid');
    const partnerOrderId = sessionStorage.getItem('partnerOrderId');

    if (!pgToken || !tid || !partnerOrderId) {
      setStatus('fail');
      setError('결제 정보가 없습니다.');
      return;
    }

    approvePayment(pgToken, tid, partnerOrderId);
  }, []);

  const approvePayment = async (pgToken, tid, partnerOrderId) => {
    try {
      await api.post('/api/payments/approve', {
        pgToken,
        tid,
        partnerOrderId,
      });

      sessionStorage.removeItem('tid');
      sessionStorage.removeItem('partnerOrderId');
      setStatus('success');

      // 3초 카운트다운 후 카드 목록으로 이동
      let count = 3;
      const timer = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
          navigate('/card/list');
        }
      }, 1000);

    } catch (err) {
      setStatus('fail');
      setError(err.response?.data?.message || '결제 승인 실패');
    }
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>

      {status === 'processing' && (
        <>
          <p style={{ fontSize: '18px' }}>결제 처리 중...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
          <h2>결제 완료!</h2>
          <p style={{ color: '#666', marginBottom: '8px' }}>결제가 정상적으로 완료되었습니다.</p>
          <p style={{ color: '#999', marginBottom: '32px', fontSize: '14px' }}>
            {countdown}초 후 카드 목록으로 이동합니다.
          </p>
          <button
            onClick={() => navigate('/card/list')}
            style={{ padding: '12px 32px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px', width: '200px' }}>
            카드 목록으로
          </button>
          <button
            onClick={() => navigate('/home')}
            style={{ padding: '12px 32px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', width: '200px' }}>
            홈으로
          </button>
        </>
      )}

      {status === 'fail' && (
        <>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>❌</div>
          <h2>결제 실패</h2>
          <p style={{ color: 'red', marginBottom: '32px' }}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            style={{ padding: '12px 32px', backgroundColor: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px', width: '200px' }}>
            다시 시도
          </button>
          <button
            onClick={() => navigate('/home')}
            style={{ padding: '12px 32px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', width: '200px' }}>
            홈으로
          </button>
        </>
      )}

    </div>
  );
}

export default PaymentCompletePage;