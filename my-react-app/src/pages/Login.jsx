import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [role, setRole] = useState("participant");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === "admin") {
      setUser("admin");
      navigate("/admin");
    } else {
      setUser("participant");
      navigate("/participant");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">Login ke Sistem SDK</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Peran:</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="participant">Peserta</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
