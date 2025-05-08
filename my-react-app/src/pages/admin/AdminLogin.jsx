import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLogin({ setUser }) {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "admin@sdk.com" && password === "admin123") {
      setUser("admin");
      if (remember) {
        localStorage.setItem("rememberAdmin", "true");
      }
      navigate("/admin");
    } else {
      alert("Email atau password admin salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-yellow-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-red-600">Login Admin</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email Admin"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            required
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
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Login sebagai Admin
          </button>
        </form>
      </div>
    </div>
  );
}
