// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: ""
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const response = await api.post('/auth/komunitas/login', formData);
    
    // Simpan token dan data user
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('komunitas', JSON.stringify(response.data.komunitas));
    
    // Set header Authorization untuk semua request berikutnya
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    
    setUser({ role: "participant", ...response.data.komunitas });
localStorage.setItem("user", JSON.stringify({ role: "participant", ...response.data.komunitas }));

    navigate("/participant");
  } catch (err) {
    setError(err.response?.data?.message || 'Login gagal. Silakan coba lagi.');
    console.error("Login error:", err);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-yellow-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">Login Peserta</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="login"
            placeholder="Email atau Telepon"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.login}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-blue-600"
            />
            <span>Ingat saya</span>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Masuk
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}