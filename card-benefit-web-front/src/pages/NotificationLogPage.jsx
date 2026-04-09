import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function NotificationLogPage() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchUserId, setSearchUserId] = useState('');

  const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: 'bold', backgroundColor: '#f5f5f5' };
  const tdStyle = { padding: '12px', textAlign: 'left', fontSize: '13px' };

  const columns = [
    { key: 'LOG_ID', label: '로그ID' },
    { key: 'USER_ID', label: '사용자ID' },
    { key: 'BENEFIT_ID', label: '혜택ID' },
    { key: 'EXPO_STATUS', label: 'Expo 상태' },
    { key: 'FCM_STATUS', label: 'FCM 상태' },
    { key: 'ERROR_MESSAGE', label: '오류내용' },
    { key: 'CREATED_AT', label: '발송시각' },
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
      const response = await api.get('/api/notifications/getNotificationList', {
        params: { userId: searchUserId.trim() }
      });
      setLogs(response.data);
    } catch (err) {
      setError('알림 이력 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handleRefreshFcmStatus = async () => {
    try {
      const ids = logs
        .filter(log => log.EXPO_MESSAGE_ID && !log.FCM_STATUS)
        .map(log => log.EXPO_MESSAGE_ID);

      if (ids.length === 0) {
        alert('갱신할 항목이 없습니다.');
        return;
      }

      await api.post('/api/notifications/refreshFcmStatus', { ids });
      await fetchLogs();
      alert('FCM 상태 갱신 완료');
    } catch (err) {
      setError('FCM 상태 갱신 실패');
    }
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ padding: '40px' }}>
      <h2>알림 이력</h2>

      {/* 검색 영역 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
          placeholder="사용자 ID"
          style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', width: '250px', fontSize: '14px' }}
        />
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
                알림 이력이 없습니다.
              </td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.LOG_ID} style={{ borderBottom: '1px solid #eee' }}>
                {columns.map(col => (
                  <td key={col.key} style={{
                    ...tdStyle,
                    color: col.key === 'EXPO_STATUS' || col.key === 'FCM_STATUS'
                      ? log[col.key] === 'OK' ? '#27ae60'
                      : log[col.key] === 'ERROR' ? '#E24B4A' : '#999'
                      : 'inherit'
                  }}>
                    {log[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: 'flex', marginTop: '16px' }}>
        <button
          onClick={handleRefreshFcmStatus}
          style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          FCM 상태 갱신
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

export default NotificationLogPage;