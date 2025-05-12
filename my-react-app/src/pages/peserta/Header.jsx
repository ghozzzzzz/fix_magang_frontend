import PropTypes from 'prop-types';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex">
        <div
          className={`px-6 py-4 font-medium text-sm transition-all duration-300 ${
            activeTab === 'pendaftaran'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pendaftaran')}
        >
          Pendaftaran Ulang
        </div>
        <div
          className={`px-6 py-4 font-medium text-sm transition-all duration-300 ${
            activeTab === 'booking'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('booking')}
        >
          Booking Ruangan
        </div>
        <div
          className={`px-6 py-4 font-medium text-sm transition-all duration-300 ${
            activeTab === 'riwayat'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('riwayat')}
        >
          Riwayat Pendaftaran
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};