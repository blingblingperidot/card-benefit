import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={token ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/home" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;