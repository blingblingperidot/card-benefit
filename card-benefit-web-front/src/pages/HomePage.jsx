import { useNavigate } from 'react-router-dom';

function HomePage({ setToken }) {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const navigate = useNavigate();
  const usrTpCd = localStorage.getItem('usrTpCd');

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('usrTpCd');
    setToken(null);
    navigate('/login');
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>홈</h2>
      <p>카드 혜택 위치기반 알림 시스템</p>
      <button
        onClick={() => navigate('/card/list')}
        style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '200px' }}>
        내 카드 목록
      </button>
      {usrTpCd === 'ADMIN' && (
        <button
          onClick={() => navigate('/admin')}
          style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#9B59B6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '200px' }}>
          관리자 페이지
        </button>
      )}
      <button
        onClick={handleLogout}
        style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '200px' }}>
        로그아웃
      </button>
    </div>
  );
}

export default HomePage;