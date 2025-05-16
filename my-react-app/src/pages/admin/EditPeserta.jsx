import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditPeserta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    no_telepon: '',
    email: '',
    id_komunitas: ''
  });
  const [komunitasList, setKomunitasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anggotaRes, komunitasRes] = await Promise.all([
          api.get(`/anggota/${id}`),
          api.get('/komunitas')
        ]);
        
        setFormData({
          nama: anggotaRes.data.data.nama,
          no_telepon: anggotaRes.data.data.no_telepon,
          email: anggotaRes.data.data.email,
          id_komunitas: anggotaRes.data.data.id_komunitas
        });
        setKomunitasList(komunitasRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.put(`/anggota/${id}`, formData);
      navigate('/peserta');
    } catch (err) {
      if (err.response?.status === 422) {
        setFormErrors(err.response.data.errors || {});
      } else {
        setError(err.response?.data?.message || 'Gagal memperbarui data');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Peserta</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            {formErrors.nama && <p className="text-red-500 text-sm">{formErrors.nama}</p>}
          </div>

          <div>
            <label className="block mb-1">Nomor Telepon</label>
            <input
              type="tel"
              name="no_telepon"
              value={formData.no_telepon}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            {formErrors.no_telepon && <p className="text-red-500 text-sm">{formErrors.no_telepon}</p>}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block mb-1">Komunitas</label>
            <select
              name="id_komunitas"
              value={formData.id_komunitas}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Komunitas</option>
              {komunitasList.map(komunitas => (
                <option key={komunitas.id_komunitas} value={komunitas.id_komunitas}>
                  {komunitas.nama_komunitas}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/peserta')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}