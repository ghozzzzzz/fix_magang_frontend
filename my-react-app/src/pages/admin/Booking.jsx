import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [modal, setModal] = useState({ isOpen: false, id: null, action: '' });
  const [catatanAdmin, setCatatanAdmin] = useState('');

  useEffect(() => {
    fetchUser();
    fetchBookings();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserRole(res.data.role);
    } catch (err) {
      console.error('Gagal mengambil user:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/pemesanan', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBookings(res.data.data);
    } catch (err) {
      console.error('Gagal mengambil data pemesanan:', err);
    }
  };

  const openModal = (id, action) => {
    setModal({ isOpen: true, id, action });
  };

  const closeModal = () => {
    setModal({ isOpen: false, id: null, action: '' });
    setCatatanAdmin('');
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/pemesanan/${modal.id}/status`, {
        status: modal.action,
        catatan_admin: catatanAdmin,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchBookings();
      closeModal();
    } catch (err) {
      console.error('Gagal memperbarui status:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Daftar Booking</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Komunitas</th>
              <th className="border p-2">Ruangan</th>
              <th className="border p-2">Tanggal Mulai</th>
              <th className="border p-2">Tanggal Selesai</th>
              <th className="border p-2">Jumlah Peserta</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Catatan Admin</th>
              {userRole === 'admin' && <th className="border p-2">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="border p-2 text-center">{booking.id}</td>
                <td className="border p-2">{booking.komunitas?.nama_komunitas || '-'}</td>
                <td className="border p-2">{booking.ruangan?.nama_ruangan || '-'}</td>
                <td className="border p-2 text-center">{new Date(booking.waktu_mulai).toLocaleString()}</td>
                <td className="border p-2 text-center">{new Date(booking.waktu_selesai).toLocaleString()}</td>
                <td className="border p-2 text-center">{booking.jumlah_peserta}</td>
                <td className={`border p-2 text-center ${
                  booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                  booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                } rounded-full text-xs font-medium`}>
                  {booking.status}
                </td>
                <td className="border p-2 text-sm">{booking.catatan_admin || '-'}</td>
                {userRole === 'admin' && booking.status === 'pending' && (
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => openModal(booking.id, 'approved')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openModal(booking.id, 'rejected')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Konfirmasi {modal.action === 'approved' ? 'Persetujuan' : 'Penolakan'}
            </h3>
            <textarea
              className="w-full border p-2 mb-4"
              rows="4"
              placeholder="Catatan Admin (opsional)"
              value={catatanAdmin}
              onChange={(e) => setCatatanAdmin(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded text-white ${
                  modal.action === 'approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {modal.action === 'approved' ? 'Setujui' : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
