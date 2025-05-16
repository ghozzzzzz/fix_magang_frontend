import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

export default function AdminLogin({ setUser }) {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/auth/admin/login", { email, password });
      
      // Verifikasi response
      if (!response.data.access_token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      // Simpan data
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Update state
      setUser(response.data.user);
      
      // Redirect dengan timeout minimal untuk memastikan state terupdate
      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 50);

    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-yellow-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-red-600">Login Admin</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email Admin"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            required
            defaultValue="admin@gmail.com"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            required
            defaultValue="1234567890"
          />

          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-red-600"
            />
            <span>Ingat saya sebagai admin</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Memproses...' : 'Login sebagai Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}