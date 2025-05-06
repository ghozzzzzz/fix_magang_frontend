import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy registration history data
const dummyRegistrationHistory = [
  {
    id: 1,
    nama: 'John Doe',
    komunitas: 'SANDEC',
    email: 'john.doe@example.com',
    noHP: '81234567890',
    tanggal: '2025-04-20',
    status: 'approved',
  },
  {
    id: 2,
    nama: 'John Doe',
    komunitas: 'AIDIA Semarang',
    email: 'john.doe@example.com',
    noHP: '81234567890',
    tanggal: '2025-05-01',
    status: 'pending',
  },
];

export default function ParticipantDashboard({ setUser }) {
  const [activeTab, setActiveTab] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [statusPendaftaran, setStatusPendaftaran] = useState("pending");
  const [registrationHistory, setRegistrationHistory] = useState(dummyRegistrationHistory);
  const [searchQuery, setSearchQuery] = useState(""); // State untuk pencarian komunitas

  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setStatusPendaftaran("menunggu persetujuan");
    const newRegistration = {
      id: registrationHistory.length + 1,
      nama: e.target[0].value,
      komunitas: e.target[1].value,
      email: e.target[2].value,
      noHP: e.target[3].value,
      tanggal: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setRegistrationHistory([...registrationHistory, newRegistration]);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  // Filter riwayat pendaftaran berdasarkan pencarian komunitas
  const filteredHistory = registrationHistory.filter((reg) =>
    reg.komunitas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Dashboard Peserta</h2>
          <nav className="space-y-2">
            <button
              className={`w-full text-left px-4 py-2 rounded flex items-center ${
                activeTab === 'pendaftaran' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('pendaftaran')}
            >
              📄 Pendaftaran Ulang
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded flex items-center ${
                activeTab === 'booking' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('booking')}
            >
              🏢 Booking Ruangan
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded flex items-center ${
                activeTab === 'riwayat' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('riwayat')}
            >
              📜 Riwayat Pendaftaran
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {/* Pendaftaran Ulang Content */}
            {activeTab === 'pendaftaran' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Pendaftaran Ulang</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input className="w-full p-2 border rounded" placeholder="Nama Lengkap" required />
                  <input className="w-full p-2 border rounded" placeholder="Asal Komunitas" required />
                  <input className="w-full p-2 border rounded" placeholder="Email Aktif" required />
                  <input className="w-full p-2 border rounded" placeholder="No HP" required />
                  <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Kirim</button>
                  {submitted && (
                    <>
                      <p className="text-green-600 font-semibold">✅ Pendaftaran berhasil dikirim!</p>
                      <p className="text-sm text-gray-600">Status: <span className="font-medium">{statusPendaftaran}</span></p>
                    </>
                  )}
                </form>
              </div>
            )}

            {/* Booking Ruangan Content */}
            {activeTab === 'booking' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Booking Ruangan Rapat</h2>
                <form onSubmit={handleBooking} className="space-y-3">
                  <input className="w-full p-2 border rounded" placeholder="Nama Peserta" required />
                  <input className="w-full p-2 border rounded" placeholder="Nama Komunitas" required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Booking</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <input className="w-full p-2 border rounded" placeholder="Durasi (jam)" type="number" min="1" required />
                  <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Ajukan Booking</button>
                  {bookingSuccess && <p className="text-green-600 font-semibold">✅ Booking berhasil diajukan!</p>}
                </form>
              </div>
            )}

            {/* Riwayat Pendaftaran Content */}
            {activeTab === 'riwayat' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Riwayat Pendaftaran Ulang</h2>

                {/* Pencarian Komunitas */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cari Berdasarkan Komunitas</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Masukkan nama komunitas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Tabel Riwayat Pendaftaran */}
                {filteredHistory.length === 0 ? (
                  <p className="text-gray-500">Belum ada riwayat pendaftaran yang sesuai.</p>
                ) : (
                  <table className="w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Nama</th>
                        <th className="border p-2">Komunitas</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">No HP</th>
                        <th className="border p-2">Tanggal</th>
                        <th className="border p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((reg) => (
                        <tr key={reg.id} className="border-b hover:bg-gray-50">
                          <td className="border p-2 text-center">{reg.id}</td>
                          <td className="border p-2">{reg.nama}</td>
                          <td className="border p-2">{reg.komunitas}</td>
                          <td className="border p-2">{reg.email}</td>
                          <td className="border p-2">{reg.noHP}</td>
                          <td className="border p-2 text-center">{reg.tanggal}</td>
                          <td className="border p-2 text-center">
                            <span
                              className={`${
                                reg.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                              } font-medium`}
                            >
                              {reg.status === 'approved' ? 'Disetujui' : 'Menunggu Persetujuan'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}