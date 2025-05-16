import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Layout({ activeSection, setActiveSection, children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminSession');
    console.log('Logged out');
    navigate('/admin-login'); // Redirect to admin-login route
  };

  const getButtonClass = (section) => `
    w-full text-left px-4 py-3 rounded-lg flex items-center transition-all
    ${activeSection === section 
      ? 'bg-blue-600 text-white shadow-md' 
      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'}
    ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'}
  `;

  const navItems = [
    { key: 'dashboard', icon: '📊', label: 'Dasbor Pendaftaran' },
    { key: 'komunitas', icon: '👥', label: 'Komunitas' },
    { key: 'booking', icon: '🏢', label: 'Booking Ruangan' },
    { key: 'peserta', icon: '🧑‍💼', label: 'Manajemen Peserta' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white shadow-xl transition-all duration-300 p-6 flex flex-col justify-between relative`}>
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-6 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-colors"
        >
          {isSidebarCollapsed ? '→' : '←'}
        </button>

        <div>
          <h2 className={`text-xl font-bold mb-6 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map(item => (
              <button
                key={item.key}
                className={getButtonClass(item.key)}
                onClick={() => setActiveSection(item.key)}
              >
                <span className={`${isSidebarCollapsed ? 'text-xl' : 'text-base'}`}>{item.icon}</span>
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className={`w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md flex items-center justify-center transition-colors ${
            isSidebarCollapsed ? 'p-2' : ''
          }`}
        >
          {isSidebarCollapsed ? '🚪' : 'Logout'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}