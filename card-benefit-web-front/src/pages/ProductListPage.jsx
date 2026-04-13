import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

function ProductListPage() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const location = useLocation();
  const { storeName, benefit, cardId, cardType, cardName } = location.state || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/benefits/getProducts?storeName=${storeName}`);
      setProducts(response.data);
    } catch (err) {
      setError('상품 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        할인 계산
  // ==============================================================
  const calcDiscount = (price) => {
    if (!benefit) return { discountAmount: 0, finalAmount: price };
    if (benefit.DISCOUNT_TYPE === 'RATE') {
      const discountAmount = Math.floor(price * (benefit.DISCOUNT_RATE / 100));
      return { discountAmount, finalAmount: price - discountAmount };
    }
    if (benefit.DISCOUNT_TYPE === 'AMOUNT') {
      const discountAmount = benefit.DISCOUNT_PRICE;
      return { discountAmount, finalAmount: price - discountAmount };
    }
    return { discountAmount: 0, finalAmount: price };
  };

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handlePayment = (product) => {
    const { discountAmount, finalAmount } = calcDiscount(product.PRICE);
    navigate('/payment', {
      state: {
        product,
        benefit,
        cardId,
        cardType,
        cardName,
        storeName,
        discountAmount,
        finalAmount,
      }
    });
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>{storeName} 상품 목록</h2>
      {benefit && (
        <p style={{ color: '#4A90E2', fontWeight: 'bold', marginBottom: '16px' }}>
          {benefit.DISCOUNT_TYPE === 'RATE'   && `${benefit.DISCOUNT_RATE}% 할인 적용`}
          {benefit.DISCOUNT_TYPE === 'AMOUNT' && `${benefit.DISCOUNT_PRICE}원 할인 적용`}
          {benefit.DISCOUNT_TYPE === 'POINT'  && `${benefit.POINT_AMOUNT}P 적립`}
        </p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>로딩 중...</p>
      ) : products.length === 0 ? (
        <p>등록된 상품이 없습니다.</p>
      ) : (
        products.map((product) => {
          const { discountAmount, finalAmount } = calcDiscount(product.PRICE);
          return (
            <div key={product.PRODUCT_ID} style={{
              width: '350px', border: '1px solid #ccc', borderRadius: '8px',
              padding: '16px', margin: '8px'
            }}>
              <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{product.PRODUCT_NAME}</p>
              <p style={{ color: '#666', fontSize: '13px' }}>{product.DESCRIPTION}</p>
              <p style={{ fontSize: '14px' }}>
                정가: <span style={{ textDecoration: discountAmount > 0 ? 'line-through' : 'none', color: '#999' }}>
                  {product.PRICE.toLocaleString()}원
                </span>
              </p>
              {discountAmount > 0 && (
                <p style={{ fontSize: '14px', color: '#E24B4A' }}>
                  할인: -{discountAmount.toLocaleString()}원
                </p>
              )}
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                최종: {finalAmount.toLocaleString()}원
              </p>
              <button
                onClick={() => handlePayment(product)}
                style={{ marginTop: '8px', width: '100%', padding: '10px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                결제하기
              </button>
            </div>
          );
        })
      )}
      <button
        onClick={() => navigate('/benefit/list', { state: { cardType, cardName, cardId } })}
        style={{ marginTop: '16px', padding: '10px 24px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '8px' }}>
        뒤로
      </button>
      <button
        onClick={() => navigate('/home')}
        style={{ marginTop: '8px', padding: '10px 24px', backgroundColor: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        홈으로
      </button>
    </div>
  );
}

export default ProductListPage;