import PropTypes from 'prop-types';

export default function BookingRuangan({
  user,
  rooms,
  loadingRooms,
  selectedRoom,
  setSelectedRoom,
  bookingData,
  handleBookingChange,
  handleBooking,
  bookingSuccess,
}) {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking Ruangan</h2>

      {loadingRooms ? (
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
                  if (room.tersedia) {
                    setSelectedRoom(room);
                    handleBookingChange({ target: { name: 'ruangan_id', value: room.id } });
                  }
                }}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRoom?.id === room.id
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : room.tersedia
                    ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <h3 className="font-bold text-lg mb-2 text-gray-800">{room.nama_ruangan}</h3>
                <p className="text-sm text-gray-600 mb-2">{room.deskripsi}</p>
                <div className="text-sm text-gray-700">
                  <p>Kapasitas: {room.kapasitas_min}-{room.kapasitas_max} orang</p>
                  <p>Status: {room.tersedia ? 'Tersedia' : 'Tidak Tersedia'}</p>
                  <div className="mt-2">
                    <strong className="text-xs text-gray-500">Fasilitas:</strong>
                    <ul className="list-disc list-inside text-xs mt-1 text-gray-600">
                      {Array.isArray(room.fasilitas) && room.fasilitas.length > 0 ? (
                        room.fasilitas.map((fasilitas, index) => <li key={index}>{fasilitas}</li>)
                      ) : (
                        <li>Tidak ada fasilitas</li>
                      )}
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
  );
}

BookingRuangan.propTypes = {
  user: PropTypes.object,
  rooms: PropTypes.array.isRequired,
  loadingRooms: PropTypes.bool.isRequired,
  selectedRoom: PropTypes.object,
  setSelectedRoom: PropTypes.func.isRequired,
  bookingData: PropTypes.object.isRequired,
  handleBookingChange: PropTypes.func.isRequired,
  handleBooking: PropTypes.func.isRequired,
  bookingSuccess: PropTypes.bool.isRequired,
};