import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // Tetap relatif ke struktur proyek
import Sidebar from '../peserta/Sidebar';
import Header from '../peserta/Header';
import PendaftaranUlang from '../peserta/PendaftaranUlang';
import BookingRuangan from '../peserta/BookingRuangan';
import RiwayatPendaftaran from '../peserta/RiwayatPendaftaran';

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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        handleLogout={handleLogout}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-6">
            {activeTab === 'pendaftaran' && (
              <PendaftaranUlang user={user} handleSubmit={handleSubmit} submitted={submitted} />
            )}
            {activeTab === 'booking' && (
              <BookingRuangan
                user={user}
                rooms={rooms}
                loadingRooms={loading.rooms}
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
                bookingData={bookingData}
                handleBookingChange={handleBookingChange}
                handleBooking={handleBooking}
                bookingSuccess={bookingSuccess}
              />
            )}
            {activeTab === 'riwayat' && (
              <RiwayatPendaftaran
                loadingHistory={loading.history}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredHistory={filteredHistory}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}