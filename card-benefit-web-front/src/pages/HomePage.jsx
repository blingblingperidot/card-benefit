import { useNavigate } from 'react-router-dom';

function HomePage({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>홈</h2>
      <p>카드 혜택 위치기반 알림 시스템</p>
      <button
        onClick={() => navigate('/card/list')}
        style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        내 카드 목록
      </button>
      <button
        onClick={handleLogout}
        style={{ margin: '8px', padding: '10px 24px', backgroundColor: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        로그아웃
      </button>
    </div>
  );
}

export default HomePage;