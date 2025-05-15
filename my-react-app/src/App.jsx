import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ParticipantDashboard from './pages/peserta/ParticipantDashboard'; 

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/participant" element={
          user === "participant" ? <ParticipantDashboard /> : <Navigate to="/login" />
        } />

        <Route path="/admin-login" element={<AdminLogin setUser={setUser} />} />
        <Route path="/admin" element={
          user === "admin" ? <AdminDashboard /> : <Navigate to="/admin-login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;
