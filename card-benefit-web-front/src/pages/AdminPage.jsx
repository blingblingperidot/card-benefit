import { useNavigate } from 'react-router-dom';

function AdminPage() {

  // ==============================================================
  //                        변수 정의s
  // ==============================================================
  const navigate = useNavigate();

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>관리자 페이지</h2>
      <p>카드 혜택 위치기반 알림 시스템</p>
      <button
        onClick={() => navigate('/admin/benefit')}
        style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '200px' }}>
        혜택 관리
      </button>
      <button
        onClick={() => navigate('/admin/notification')}
        style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#9B59B6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '200px' }}>
        알림 이력
      </button>
      <button
        onClick={() => navigate('/admin/payment')}
        style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '200px' }}>
        결제 내역
      </button>
      <button
        onClick={() => navigate('/home')}
        style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '200px' }}>
        홈으로
      </button>
    </div>
  );
}

export default AdminPage;