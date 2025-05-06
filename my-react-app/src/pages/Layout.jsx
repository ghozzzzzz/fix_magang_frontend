import React from 'react';

export default function Layout({ activeSection, setActiveSection, children }) {
  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    console.log('Logged out');
    // In a real app, you might redirect to a login page, e.g.:
    // window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Dashboard Admin</h2>
          <nav className="space-y-2">
            <button
              className={`w-full text-left px-4 py-2 rounded flex items-center ${
                activeSection === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveSection('dashboard')}
            >
              📊 Dasbor Pendaftaran
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded flex items-center ${
                activeSection === 'komunitas' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveSection('komunitas')}
            >
              📋 Komunitas
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded flex items-center ${
                activeSection === 'booking' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveSection('booking')}
            >
              🏢 Booking Ruangan
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded flex items-center ${
                activeSection === 'peserta' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveSection('peserta')}
            >
              👥 Manajemen Peserta
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}