import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ParticipantDashboard from './pages/ParticipantDashboard';

function App() {
  const [user, setUser] = useState(null); // <- Tambahkan ini

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} />} /> {/* <-- Perbaikan di sini */}
        <Route path="/register" element={<Register />} />
        <Route path="/participant" element={<ParticipantDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
