import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PendaftaranUlang({ user, submitted, setSubmitted }) {
  const [members, setMembers] = useState([{ name: '', phone: '', email: '' }]);
  const [existingMembers, setExistingMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const token = localStorage.getItem('token');

  // Ambil anggota yang sudah ada saat komponen dimount
  useEffect(() => {
    const fetchExistingMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/anggota/by-komunitas/${user.id_komunitas}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExistingMembers(res.data);
      } catch (err) {
        console.error('Gagal mengambil data anggota:', err);
        setExistingMembers([]);
      }
    };

    if (user?.id_komunitas) fetchExistingMembers();
  }, [token, user.id_komunitas]);

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const addMemberField = () => {
    setMembers([...members, { name: '', phone: '', email: '' }]);
  };

  const removeMemberField = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const anggotaList = members.filter((m) => m.name && m.phone && m.email);

    try {
      for (const anggota of anggotaList) {
        await axios.post(
          'http://localhost:8000/api/anggota',
          {
            nama: anggota.name,
            no_telepon: anggota.phone,
            email: anggota.email,
            id_komunitas: user.id_komunitas,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      setSubmitted(true);
      setMembers([{ name: '', phone: '', email: '' }]);
      setLoading(false);

      // Refresh anggota yang sudah ada
      const refreshed = await axios.get(
        `http://localhost:8000/api/anggota/by-komunitas/${user.id_komunitas}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingMembers(refreshed.data);
    } catch (err) {
      console.error(err);
      setLoading(false);
      if (err.response?.status === 422) {
        setErrors(err.response.data);
      } else {
        setErrors(['Terjadi kesalahan saat mengirim data.']);
      }
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pendaftaran Ulang</h2>

      {user && (
        <>
          {/* Info Komunitas */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
            <p><strong>Koordinator:</strong> {user.koordinator}</p>
            <p><strong>Komunitas:</strong> {user.nama_komunitas}</p>
            <p><strong>Email:</strong> {user.email_komunitas}</p>
            <p><strong>No. Telepon:</strong> {user.telepon}</p>
          </div>

          {/* Daftar Anggota yang Sudah Ada */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Anggota Terdaftar</h3>
            {existingMembers.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada anggota terdaftar.</p>
            ) : (
              <ul className="text-sm space-y-1">
                {existingMembers.map((anggota) => (
                  <li key={anggota.id} className="border-b py-1">
                    <span className="font-medium">{anggota.nama}</span> – {anggota.no_telepon} – {anggota.email}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Form Tambah Anggota */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Tambah Anggota Baru</label>
              {members.map((member, index) => (
                <div key={index} className="space-y-2 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder={`Nama anggota ${index + 1}`}
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      required
                    />
                    {members.length > 1 && (
                      <button
                        type="button"
                        className="p-2 text-red-600 hover:text-red-800"
                        onClick={() => removeMemberField(index)}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder={`Nomor HP anggota ${index + 1}`}
                    value={member.phone}
                    onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder={`Email anggota ${index + 1}`}
                    value={member.email}
                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={addMemberField}
              >
                + Tambah Anggota
              </button>
            </div>

            {errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {Object.entries(errors).map(([field, messages]) => (
                  <div key={field}>{field}: {Array.isArray(messages) ? messages.join(', ') : messages}</div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              {loading ? 'Mengirim...' : 'Kirim Pendaftaran'}
            </button>

            {submitted && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                <p className="text-green-800 font-medium">Pendaftaran berhasil dikirim!</p>
                <p className="text-green-700 text-sm">Status: <strong>Menunggu persetujuan</strong></p>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}

PendaftaranUlang.propTypes = {
  user: PropTypes.object.isRequired,
  submitted: PropTypes.bool.isRequired,
  setSubmitted: PropTypes.func.isRequired,
};
