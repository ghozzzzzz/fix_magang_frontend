import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    bookingId: null,
    action: null, // 'approve' or 'reject'
    note: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get('/user');
        setUserRole(userResponse.data.role);
        
        const bookingsResponse = await api.get('/pemesanan');
        setBookings(bookingsResponse.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal mengambil data booking');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (bookingId, action) => {
    setModalData({
      bookingId,
      action,
      note: ''
    });
    setShowModal(true);
  };

  const handleStatusChange = async () => {
    try {
      await api.put(`/pemesanan/${modalData.bookingId}/status`, { 
        status: modalData.action === 'approve' ? 'approved' : 'rejected',
        catatan_admin: modalData.note
      });
      
      setBookings(bookings.map(booking => 
        booking.id === modalData.bookingId ? { 
          ...booking, 
          status: modalData.action === 'approve' ? 'approved' : 'rejected',
          catatan_admin: modalData.note
        } : booking
      ));
      
      setShowModal(false);
      setModalData({
        bookingId: null,
        action: null,
        note: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengupdate status');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat data booking...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Daftar Booking Ruangan / Aula</h2>
      
      {/* Modal untuk catatan admin */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              {modalData.action === 'approve' ? 'Approve Booking' : 'Reject Booking'}
            </h3>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Catatan Admin (Wajib)
              </label>
              <textarea
                value={modalData.note}
                onChange={(e) => setModalData({...modalData, note: e.target.value})}
                className="w-full p-2 border rounded"
                rows="4"
                placeholder={`Masukkan catatan untuk ${modalData.action === 'approve' ? 'approval' : 'penolakan'}...`}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Batal
              </button>
              <button
                onClick={handleStatusChange}
                disabled={!modalData.note.trim()}
                className={`px-4 py-2 rounded text-white ${
                  modalData.action === 'approve' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                } ${
                  !modalData.note.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {modalData.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-gray-500">Belum ada booking yang masuk.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
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
                  <td className="border p-2">{booking.ruangan?.nama_ruangan || '-'}</td>
                  <td className="border p-2 text-center">
                    {new Date(booking.waktu_mulai).toLocaleString()}
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(booking.waktu_selesai).toLocaleString()}
                  </td>
                  <td className="border p-2 text-center">{booking.jumlah_peserta}</td>
                  <td className={`border p-2 text-center ${
                    booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  } rounded-full text-xs font-medium`}>
                    {booking.status}
                  </td>
                  <td className="border p-2 text-sm">
                    {booking.catatan_admin || '-'}
                  </td>
                  {userRole === 'admin' && booking.status === 'pending' && (
                    <td className="border p-2 text-center space-x-2">
                      <button
                        onClick={() => openModal(booking.id, 'approve')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openModal(booking.id, 'reject')}
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
      )}
    </div>
  );
}