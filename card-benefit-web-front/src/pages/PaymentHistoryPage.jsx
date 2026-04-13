import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function PaymentHistoryPage() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchUserId, setSearchUserId] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: 'bold', backgroundColor: '#f5f5f5' };
  const tdStyle = { padding: '12px', textAlign: 'left', fontSize: '13px' };

  const columns = [
    { key: 'PAYMENT_ID',    label: '결제ID' },
    { key: 'USER_ID',       label: '사용자ID' },
    { key: 'CARD_ID',       label: '카드ID' },
    { key: 'BENEFIT_ID',    label: '혜택ID' },
    { key: 'AMOUNT',        label: '정가' },
    { key: 'DISCOUNT_AMOUNT', label: '할인금액' },
    { key: 'FINAL_AMOUNT',  label: '최종금액' },
    { key: 'STATUS',        label: '상태' },
    { key: 'ERROR_MESSAGE', label: '오류내용' },
    { key: 'CREATED_AT',    label: '결제시각' },
  ];

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchUserId.trim()) params.userId = searchUserId.trim();
      if (searchStatus)        params.status = searchStatus;
      const response = await api.get('/api/payments/list', { params });
      setLogs(response.data);
    } catch (err) {
      setError('결제 내역 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        상태 색상
  // ==============================================================
  const getStatusColor = (status) => {
    if (status === 'SUCCESS')   return '#27ae60';
    if (status === 'FAILED')    return '#E24B4A';
    if (status === 'CANCELLED') return '#999';
    if (status === 'PENDING')   return '#f39c12';
    return 'inherit';
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ padding: '40px' }}>
      <h2>결제 내역</h2>

      {/* 검색 영역 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
          placeholder="사용자 ID (미입력 시 전체조회)"
          style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', width: '220px', fontSize: '14px' }}
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }}>
          <option value="">전체 상태</option>
          <option value="PENDING">PENDING</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="FAILED">FAILED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <button
          onClick={fetchLogs}
          style={{ padding: '8px 20px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Search
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={thStyle}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                결제 내역이 없습니다.
              </td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.PAYMENT_ID} style={{ borderBottom: '1px solid #eee' }}>
                {columns.map(col => (
                  <td key={col.key} style={{
                    ...tdStyle,
                    color: col.key === 'STATUS' ? getStatusColor(log[col.key]) : 'inherit',
                    fontWeight: col.key === 'STATUS' ? 'bold' : 'normal'
                  }}>
                    {col.key === 'AMOUNT' || col.key === 'DISCOUNT_AMOUNT' || col.key === 'FINAL_AMOUNT'
                      ? log[col.key] != null ? `${Number(log[col.key]).toLocaleString()}원` : '-'
                      : log[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: 'flex', marginTop: '16px' }}>
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

export default PaymentHistoryPage;