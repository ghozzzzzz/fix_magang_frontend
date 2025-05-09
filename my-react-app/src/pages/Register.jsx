// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [formData, setFormData] = useState({
    nama_komunitas: "",
    tipe: "",
    koordinator: "",
    telepon: "",
    email_komunitas: "",
    jumlah_anggota: "",
    password: "",
    password_confirmation: ""
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!agree) {
      setError("Anda harus menyetujui syarat dan ketentuan.");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    try {
      const response = await api.post('/auth/komunitas/register', formData);
      
      // Simpan token dan data komunitas
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('komunitas', JSON.stringify(response.data.komunitas));
      
      alert("Pendaftaran berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-yellow-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">Daftar Akun Baru</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="nama_komunitas"
            placeholder="Nama Komunitas"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.nama_komunitas}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="tipe"
            placeholder="Tipe Komunitas"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.tipe}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="koordinator"
            placeholder="Nama Koordinator"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.koordinator}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="telepon"
            placeholder="Nomor Telepon"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.telepon}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email_komunitas"
            placeholder="Email Komunitas"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.email_komunitas}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="jumlah_anggota"
            placeholder="Jumlah Anggota"
            min="1"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.jumlah_anggota}
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
          <input
            type="password"
            name="password_confirmation"
            placeholder="Konfirmasi Password"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="accent-blue-600"
            />
            <span>
              Saya setuju dengan{" "}
              <a href="#" className="text-blue-600 hover:underline">
                syarat dan ketentuan
              </a>
            </span>
          </label>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg shadow-md hover:bg-yellow-300 transition duration-300"
          >
            Daftar
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}