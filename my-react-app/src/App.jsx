import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ParticipantDashboard from './pages/peserta/ParticipantDashboard';

function App() {
  const [user, setUser] = useState(null);

  // Cek status login saat pertama kali load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/participant" element={
          user?.role === "participant" ? <ParticipantDashboard /> : <Navigate to="/login" />
        } />

        <Route path="/admin-login" element={
          user?.role === "admin" ? <Navigate to="/admin" /> : <AdminLogin setUser={setUser} />
        } />
        
        <Route path="/admin" element={
          user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/admin-login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;