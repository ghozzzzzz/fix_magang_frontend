import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ParticipantDashboard() {
  const navigate = useNavigate();

  // State management
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('pendaftaran');
  const [submitted, setSubmitted] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState({
    user: true,
    rooms: false,
    bookings: false,
    history: false,
  });

  // Booking form data
  const [bookingData, setBookingData] = useState({
    ruangan_id: '',
    tanggal: '',
    waktu_mulai: '',
    durasi: '1',
    jumlah_peserta: '',
    kebutuhan_khusus: '',
  });

  // Load user data when component mounts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const komunitas = localStorage.getItem('komunitas');

        if (token && komunitas) {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          setUser(JSON.parse(komunitas));
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Gagal memuat pengguna:', err);
        navigate('/login');
      } finally {
        setLoading((prev) => ({ ...prev, user: false }));
      }
    };

    loadUser();
  }, [navigate]);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'riwayat' && bookings.length === 0) {
      fetchBookings();
    } else if (activeTab === 'booking' && rooms.length === 0) {
      fetchRooms();
    }
  }, [activeTab, bookings.length, rooms.length]);

  // Fetch available rooms
  const fetchRooms = async () => {
    try {
      setLoading((prev) => ({ ...prev, rooms: true }));
      const response = await api.get('/ruangan');
      setRooms(response.data.data);
    } catch (err) {
      console.error('Gagal mengambil data ruangan:', err);
    } finally {
      setLoading((prev) => ({ ...prev, rooms: false }));
    }
  };

  // Fetch booking history
  const fetchBookings = async () => {
    try {
      setLoading((prev) => ({ ...prev, history: true }));
      const response = await api.get('/pemesanan');
      setBookings(response.data.data);
    } catch (err) {
      console.error('Gagal mengambil riwayat pemesanan:', err);
    } finally {
      setLoading((prev) => ({ ...prev, history: false }));
    }
  };

  // Handle registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const formData = {
        nama: e.target[0].value,
        komunitas: e.target[1].value,
        email: e.target[2].value,
        noHP: e.target[3].value,
        tanggal: new Date().toISOString().split('T')[0],
        status: 'pending',
      };

      const response = await api.post('/pemesanan', formData);
      setBookings([...bookings, response.data.data]);
    } catch (err) {
      console.error('Gagal mengirim pendaftaran:', err);
      alert(err.response?.data?.message || 'Gagal mengirim pendaftaran');
    }
  };

  // Handle booking form changes
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });

    if (name === 'ruangan_id') {
      const roomId = parseInt(value);
      const room = rooms.find((room) => room.id === roomId);
      setSelectedRoom(room);
    }
  };

  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      const startDateTime = `${bookingData.tanggal} ${bookingData.waktu_mulai}:00`;
      const startDate = new Date(startDateTime);
      const endDate = new Date(startDate.getTime() + parseInt(bookingData.durasi) * 60 * 60 * 1000);

      const bookingInfo = {
        ruangan_id: parseInt(bookingData.ruangan_id),
        waktu_mulai: startDateTime,
        waktu_selesai: endDate.toISOString(),
        jumlah_peserta: parseInt(bookingData.jumlah_peserta),
        kebutuhan_khusus: bookingData.kebutuhan_khusus,
      };

      const response = await api.post('/pemesanan', bookingInfo);
      setBookingSuccess(true);
      setBookingData({
        ruangan_id: '',
        tanggal: '',
        waktu_mulai: '',
        durasi: '1',
        jumlah_peserta: '',
        kebutuhan_khusus: '',
      });
      setSelectedRoom(null);
      fetchBookings();
    } catch (err) {
      console.error('Gagal membuat booking:', err);
      alert(err.response?.data?.message || 'Gagal membuat booking');
    }
  };

  // Filter booking history based on search query
  const filteredHistory = bookings.filter((booking) =>
    booking.komunitas?.nama_komunitas?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle logout
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('komunitas');
      delete api.defaults.headers.Authorization;
      navigate('/login');
    } catch (err) {
      console.error('Gagal logout:', err);
      alert('Gagal logout. Silakan coba lagi.');
    }
  };

  // Show loading screen while user data is being fetched
  if (loading.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-xl">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
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
              {!isSidebarCollapsed && 'Riwayat Pendaftaran'}
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with animated tab indicators */}
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
          <div className="p-6">
            {/* Pendaftaran Ulang Content */}
            {activeTab === 'pendaftaran' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Pendaftaran Ulang</h2>
                {user && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <input
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Masukkan nama lengkap"
                        defaultValue={user.koordinator}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Asal Komunitas</label>
                      <input
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Masukkan asal komunitas"
                        defaultValue={user.nama_komunitas}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Email Aktif</label>
                      <input
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Masukkan email aktif"
                        defaultValue={user.email_komunitas}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor HP</label>
                      <input
                        type="tel"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Masalnya nomor HP"
                        defaultValue={user.telepon}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 shadow-md transition-all duration-300 font-medium"
                    >
                      Kirim Pendaftaran
                    </button>
                    {submitted && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">Pendaftaran berhasil dikirim!</p>
                            <p className="text-sm text-green-700 mt-1">
                              Status: <span className="font-semibold">Menunggu persetujuan</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* Booking Ruangan Content */}
            {activeTab === 'booking' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking Ruangan</h2>

                {loading.rooms ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data ruangan...</p>
                  </div>
                ) : (
                  <>
                    {/* Pemilihan Ruangan */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rooms.map((room) => (
                        <div
                          key={room.id}
                          onClick={() => {
                            setSelectedRoom(room);
                            setBookingData({ ...bookingData, ruangan_id: room.id });
                          }}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedRoom?.id === room.id
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          <h3 className="font-bold text-lg mb-2 text-gray-800">{room.nama_ruangan}</h3>
                          <p className="text-sm text-gray-600 mb-2">{room.deskripsi}</p>
                          <div className="text-sm text-gray-700">
                            <p>Kapasitas: {room.kapasitas_min}-{room.kapasitas_max} orang</p>
                            <div className="mt-2">
                              <strong className="text-xs text-gray-500">Fasilitas:</strong>
                              <ul className="list-disc list-inside text-xs mt-1 text-gray-600">
                                {(() => {
                                  if (Array.isArray(room.fasilitas)) {
                                    return room.fasilitas.map((fasilitas, index) => (
                                      <li key={index}>{fasilitas}</li>
                                    ));
                                  }
                                  if (typeof room.fasilitas === 'string') {
                                    return room.fasilitas.split(',').map((fasilitas, index) => (
                                      <li key={index}>{fasilitas.trim()}</li>
                                    ));
                                  }
                                  return <li>Tidak ada fasilitas</li>;
                                })()}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleBooking} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Nama Komunitas</label>
                        <input
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          placeholder="Masukkan nama komunitas"
                          value={user?.nama_komunitas || ''}
                          readOnly
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Tanggal Booking</label>
                        <input
                          type="date"
                          name="tanggal"
                          value={bookingData.tanggal}
                          onChange={handleBookingChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Jam Mulai</label>
                        <input
                          type="time"
                          name="waktu_mulai"
                          value={bookingData.waktu_mulai}
                          onChange={handleBookingChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Durasi (jam)</label>
                        <input
                          type="number"
                          name="durasi"
                          value={bookingData.durasi}
                          onChange={handleBookingChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          min="1"
                          max="8"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Jumlah Peserta</label>
                        <input
                          type="number"
                          name="jumlah_peserta"
                          value={bookingData.jumlah_peserta}
                          onChange={handleBookingChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          placeholder="Masukkan jumlah peserta"
                          min={selectedRoom ? selectedRoom.kapasitas_min : '1'}
                          max={selectedRoom ? selectedRoom.kapasitas_max : '50'}
                          required
                        />
                        {selectedRoom && (
                          <p className="text-xs text-gray-500 mt-1">
                            Kapasitas ruangan: {selectedRoom.kapasitas_min}-{selectedRoom.kapasitas_max} orang
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Kebutuhan Khusus</label>
                        <textarea
                          name="kebutuhan_khusus"
                          value={bookingData.kebutuhan_khusus}
                          onChange={handleBookingChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          placeholder="Masukkan kebutuhan khusus (opsional)"
                          rows="3"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!selectedRoom}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-600 shadow-md transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {!selectedRoom ? 'Pilih Ruangan Terlebih Dahulu' : 'Ajukan Booking'}
                      </button>

                      {bookingSuccess && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-green-800">Booking ruangan berhasil diajukan!</p>
                              <p className="text-sm text-green-700 mt-1">
                                Ruangan: <span className="font-semibold">{selectedRoom?.nama_ruangan}</span>
                              </p>
                              <p className="text-sm text-green-700">
                                Status: <span className="font-semibold">Menunggu persetujuan admin</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </form>
                  </>
                )}
              </div>
            )}

            {/* Riwayat Pendaftaran Content */}
            {activeTab === 'riwayat' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Riwayat Pendaftaran</h2>

                {loading.history ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat riwayat pendaftaran...</p>
                  </div>
                ) : (
                  <>
                    {/* Search and filter section */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cari Berdasarkan Komunitas</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          placeholder="Masukkan nama komunitas..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                          onClick={() => setSearchQuery('')}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Tabel Riwayat Pendaftaran */}
                    {filteredHistory.length === 0 ? (
                      <div className="text-center py-10">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada riwayat pendaftaran</h3>
                        <p className="mt-1 text-sm text-gray-500">Silakan lakukan pendaftaran terlebih dahulu.</p>
                      </div>
                    ) : (
                      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                ID
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Komunitas
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Koordinator
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Email
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Telepon
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Tanggal
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredHistory.map((booking) => (
                              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {booking.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {booking.komunitas?.nama_komunitas || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {booking.komunitas?.koordinator || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {booking.komunitas?.email_komunitas || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {booking.komunitas?.telepon || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {booking.waktu_mulai
                                    ? new Date(booking.waktu_mulai).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                      })
                                    : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      booking.status === 'approved'
                                        ? 'bg-green-100 text-green-800'
                                        : booking.status === 'rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                  >
                                    {booking.status === 'approved'
                                      ? 'Disetujui'
                                      : booking.status === 'rejected'
                                      ? 'Ditolak'
                                      : 'Menunggu'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}