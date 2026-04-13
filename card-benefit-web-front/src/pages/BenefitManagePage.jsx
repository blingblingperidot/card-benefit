import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function BenefitManagePage() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: 'bold' };
  const tdStyle = { padding: '12px', textAlign: 'left', fontSize: '13px' };

  const columns = [
    { key: 'BENEFIT_ID',     label: '혜택ID' },
    { key: 'CARD_TYPE',      label: '카드종류' },
    { key: 'STORE_NAME',     label: '매장명' },
    { key: 'DESCRIPTION',    label: '설명' },
    { key: 'LATITUDE',       label: '위도' },
    { key: 'LONGITUDE',      label: '경도' },
    { key: 'DISCOUNT_TYPE',  label: '할인유형' },
    { key: 'DISCOUNT_RATE',  label: '할인율(%)' },
    { key: 'DISCOUNT_PRICE', label: '할인금액(원)' },
    { key: 'POINT_AMOUNT',   label: '적립포인트' },
  ];

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/benefits/getAllBenefits');
      setBenefits(response.data);
    } catch (err) {
      setError('혜택 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handleDelete = async (benefitId) => {
    try {
      await api.post('/api/benefits/deletebenefit', { benefitId });
      fetchBenefits();
    } catch (err) {
      setError('혜택 삭제 실패');
    }
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ padding: '40px' }}>
      <h2>혜택 관리</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            {columns.map(col => (
              <th key={col.key} style={thStyle}>{col.label}</th>
            ))}
            <th style={thStyle}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</td>
            </tr>
          ) : benefits.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                등록된 혜택이 없습니다.
              </td>
            </tr>
          ) : (
            benefits.map(benefit => (
              <tr key={benefit.BENEFIT_ID} style={{ borderBottom: '1px solid #eee' }}>
                {columns.map(col => (
                  <td key={col.key} style={tdStyle}>{benefit[col.key] ?? '-'}</td>
                ))}
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(benefit.BENEFIT_ID)}
                    style={{ backgroundColor: '#E24B4A', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer' }}>
                    삭제
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ display: 'flex', marginTop: '16px' }}>
        <button
          onClick={() => navigate('/admin/benefit/register')}
          style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          혜택 등록
        </button>
        <button
          onClick={() => navigate('/admin')}
          style={{ margin: '8px', padding: '10px 24px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>
          뒤로
        </button>
        <button
          onClick={() => navigate('/home')}
          style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          홈으로
        </button>
      </div>
    </div>
  );
}

export default BenefitManagePage;