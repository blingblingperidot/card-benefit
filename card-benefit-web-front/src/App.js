import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import CardListPage from './pages/CardListPage';
import CardRegisterPage from './pages/CardRegisterPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={token ? <HomePage setToken={setToken} /> : <Navigate to="/login" />} />
        <Route path="/card/list" element={token ? <CardListPage /> : <Navigate to="/login" />} />
        <Route path="/card/register" element={token ? <CardRegisterPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/home" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;