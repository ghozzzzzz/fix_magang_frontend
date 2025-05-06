import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("participant");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Pendaftaran berhasil! Silakan login.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">Daftar Akun Baru</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daftar Sebagai:</label>
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
            type="text"
            placeholder="Nama Lengkap"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
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
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}
