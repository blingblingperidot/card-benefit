import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>홈</h2>
      <p>카드 혜택 위치기반 알림 시스템</p>
      <button onClick={handleLogout} style={{ padding: '8px 24px' }}>
        로그아웃
      </button>
    </div>
  );
}

export default HomePage;