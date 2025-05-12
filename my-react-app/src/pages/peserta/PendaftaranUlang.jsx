import PropTypes from 'prop-types';

export default function PendaftaranUlang({ user, handleSubmit, submitted }) {
  return (
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
  );
}

PendaftaranUlang.propTypes = {
  user: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
};