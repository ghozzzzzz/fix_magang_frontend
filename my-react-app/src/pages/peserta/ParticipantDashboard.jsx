import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../peserta/Sidebar';
import Header from '../peserta/Header';
import PendaftaranUlang from '../peserta/PendaftaranUlang';
import BookingRuangan from '../peserta/BookingRuangan';
import RiwayatBooking from '../peserta/RiwayatBooking';
import TambahAnggota from '../peserta/TambahAnggota';


export default function ParticipantDashboard() {
  const navigate = useNavigate();

  // State management
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('pendaftaran');
  const [submitted, setSubmitted] = useState(false);
  const [memberAdded, setMemberAdded] = useState(false);
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

  // Data form untuk penambahan anggota
  const [memberData, setMemberData] = useState({
    nama: '',
    no_telepon: '',
    email: '',
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
          const parsedKomunitas = JSON.parse(komunitas);
          setUser(parsedKomunitas);
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
      alert(err.response?.data?.message || 'Gagal mengambil data ruangan');
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
      alert(err.response?.data?.message || 'Gagal mengambil riwayat pemesanan');
    } finally {
      setLoading((prev) => ({ ...prev, history: false }));
    }
  };

  // Handle registration form submission (update komunitas)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const formData = {
        nama_komunitas: e.target[0].value,
        koordinator: e.target[1].value,
        email_komunitas: e.target[2].value,
        telepon: e.target[3].value,
      };

      const response = await api.put(`/komunitas/${user.id_komunitas}`, formData);
      setUser(response.data.data);
      localStorage.setItem('komunitas', JSON.stringify(response.data.data));
      alert('Data komunitas berhasil diperbarui');
    } catch (err) {
      console.error('Gagal memperbarui data komunitas:', err);
      alert(err.response?.data?.message || 'Gagal memperbarui data komunitas');
    }
  };

  // Handle member addition (tambah anggota)
  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberAdded(true);

    try {
      const response = await api.post('/anggota', memberData);
      alert('Anggota berhasil ditambahkan');
      setMemberData({ nama: '', no_telepon: '', email: '' });
      setMemberAdded(false);
    } catch (err) {
      console.error('Gagal menambahkan anggota:', err);
      alert(err.response?.data?.message || 'Gagal menambahkan anggota');
    }
  };

  // Handle member form changes
  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setMemberData({
      ...memberData,
      [name]: value,
    });
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

const handleBooking = async (e) => {
  e.preventDefault();

  try {
    // Format waktu_mulai dan validasi
    const startDateTime = `${bookingData.tanggal} ${bookingData.waktu_mulai}:00`;
    const startDate = new Date(startDateTime);

    // Hitung waktu_selesai berdasarkan durasi
    const durasiJam = parseInt(bookingData.durasi) || 1; // Default 1 jam jika tidak ada
    const endDate = new Date(startDate.getTime() + durasiJam * 60 * 60 * 1000);

    // Debugging: Log tanggal untuk verifikasi
    console.log('Start Date:', startDate.toString());
    console.log('End Date (Object):', endDate.toString());

    // Format waktu_selesai secara manual dalam zona waktu lokal
    const pad = (num) => String(num).padStart(2, '0');
    const waktuSelesaiString = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())} ${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:${pad(endDate.getSeconds())}`;
    console.log('waktu_selesai (String):', waktuSelesaiString);

    // Validasi di frontend
    const now = new Date(); // 03:37 AM WIB, 16 Mei 2025
    if (startDate < now) {
      alert(`Waktu mulai (${startDate.toLocaleString('id-ID')}) harus setelah waktu sekarang (${now.toLocaleString('id-ID')})`);
      return;
    }
    if (endDate <= startDate) {
      alert('Waktu selesai harus setelah waktu mulai');
      return;
    }

    // Validasi kapasitas ruangan
    if (!selectedRoom) {
      alert('Silakan pilih ruangan terlebih dahulu');
      return;
    }
    const jumlahPeserta = parseInt(bookingData.jumlah_peserta);
    if (jumlahPeserta < selectedRoom.kapasitas_min || jumlahPeserta > selectedRoom.kapasitas_max) {
      alert(
        `Jumlah peserta (${jumlahPeserta}) harus antara ${selectedRoom.kapasitas_min} dan ${selectedRoom.kapasitas_max} orang`
      );
      return;
    }

    const bookingInfo = {
      ruangan_id: parseInt(bookingData.ruangan_id),
      id_komunitas: user?.id_komunitas || null,
      waktu_mulai: startDateTime,
      waktu_selesai: waktuSelesaiString, // Gunakan string yang diformat secara manual
      jumlah_peserta: jumlahPeserta,
      kebutuhan_khusus: bookingData.kebutuhan_khusus || null,
    };

    // Debugging: Log data yang akan dikirim
    console.log('Booking Info:', bookingInfo);

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
    const errorMessage = err.response?.data?.message || 'Gagal membuat booking';
    const validationErrors = err.response?.data?.errors
      ? Object.values(err.response.data.errors).flat().join(', ')
      : '';
    alert(`${errorMessage}${validationErrors ? `: ${validationErrors}` : ''}`);
    console.log('Error Response:', err.response?.data);
  }
};
  // Filter booking history based on search query
  const filteredHistory = bookings.filter((booking) =>
    booking.ruangan?.nama_ruangan?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <PendaftaranUlang
  user={user}
  handleSubmit={handleSubmit}
  submitted={submitted}
  setSubmitted={setSubmitted}
/>

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
              <RiwayatBooking
                loadingHistory={loading.history}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredHistory={filteredHistory}
              />
            )}
            {activeTab === 'anggota' && (
              <TambahAnggota
                memberData={memberData}
                handleMemberChange={handleMemberChange}
                handleAddMember={handleAddMember}
                memberAdded={memberAdded}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}