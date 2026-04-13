import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

function PaymentPage() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const location = useLocation();
  const { product, benefit, cardId, cardType, cardName, storeName, discountAmount, finalAmount } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/api/payments/ready', {
        benefitId:      benefit?.BENEFIT_ID || 'NONE',
        cardId:         cardId,
        itemName:       product.PRODUCT_NAME,
        amount:         product.PRICE,
        discountAmount: discountAmount || 0,
        approvalUrl:    'http://localhost:3000/payment/success',
        cancelUrl:      'http://localhost:3000/payment/cancel',
        failUrl:        'http://localhost:3000/payment/fail',
      });

      const { nextRedirectPcUrl, tid, partnerOrderId } = response.data;

      sessionStorage.setItem('tid',            tid);
      sessionStorage.setItem('partnerOrderId', partnerOrderId);

      window.location.href = nextRedirectPcUrl;

    } catch (err) {
      setError(err.response?.data?.message || '결제 준비 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>결제</h2>
      <div style={{ width: '350px', border: '1px solid #ccc', borderRadius: '8px', padding: '24px', margin: '8px' }}>

        <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>결제 정보</p>

        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>카드</p>
          <p style={{ fontWeight: 'bold' }}>{cardName}</p>
        </div>

        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>매장</p>
          <p style={{ fontWeight: 'bold' }}>{storeName}</p>
        </div>

        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>상품</p>
          <p style={{ fontWeight: 'bold' }}>{product?.PRODUCT_NAME}</p>
        </div>

        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>정가</p>
          <p style={{ fontWeight: 'bold' }}>{product?.PRICE?.toLocaleString()}원</p>
        </div>

        {discountAmount > 0 && (
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
            <p style={{ color: '#666', fontSize: '14px' }}>할인</p>
            <p style={{ fontWeight: 'bold', color: '#E24B4A' }}>-{discountAmount?.toLocaleString()}원</p>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>최종 결제 금액</p>
          <p style={{ fontWeight: 'bold', fontSize: '22px', color: '#4A90E2' }}>{finalAmount?.toLocaleString()}원</p>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{ width: '100%', padding: '14px', backgroundColor: '#FAE100', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
          {loading ? '처리 중...' : '카카오페이로 결제'}
        </button>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '100%', padding: '14px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>
          취소
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;