import PropTypes from 'prop-types';

export default function Sidebar({ activeTab, setActiveTab, user, handleLogout, isSidebarCollapsed, setIsSidebarCollapsed }) {
  return (
    <div
      className={`${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      } bg-white shadow-xl transition-all duration-300 p-6 flex flex-col justify-between relative`}
    >
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute -right-3 top-6 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-colors"
      >
        {isSidebarCollapsed ? '→' : '←'}
      </button>

      <div>
        <h2 className={`text-xl font-bold mb-6 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
          {user?.nama_komunitas || 'Dashboard'}
        </h2>
        <nav className="space-y-2">
          <button
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all ${
              activeTab === 'pendaftaran'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            onClick={() => setActiveTab('pendaftaran')}
          >
            <span className={`${isSidebarCollapsed ? 'text-xl' : 'mr-3'}`}>📄</span>
            {!isSidebarCollapsed && 'Pendaftaran Ulang'}
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all ${
              activeTab === 'booking'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            onClick={() => setActiveTab('booking')}
          >
            <span className={`${isSidebarCollapsed ? 'text-xl' : 'mr-3'}`}>🏢</span>
            {!isSidebarCollapsed && 'Booking Ruangan'}
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all ${
              activeTab === 'riwayat'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            onClick={() => setActiveTab('riwayat')}
          >
            <span className={`${isSidebarCollapsed ? 'text-xl' : 'mr-3'}`}>📜</span>
            {!isSidebarCollapsed && 'Riwayat Boking'}
          </button>
          
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className={`w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-md flex items-center justify-center transition-colors ${
          isSidebarCollapsed ? 'p-2' : ''
        }`}
      >
        {isSidebarCollapsed ? '🚪' : 'Logout'}
      </button>
    </div>
  );
}

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  user: PropTypes.object,
  handleLogout: PropTypes.func.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  setIsSidebarCollapsed: PropTypes.func.isRequired,
};