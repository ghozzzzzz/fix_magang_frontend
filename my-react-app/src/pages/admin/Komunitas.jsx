import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Komunitas() {
  const [search, setSearch] = useState('');
  const [komunitas, setKomunitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentKomunitas, setCurrentKomunitas] = useState(null);
  const [anggota, setAnggota] = useState([]);
  const [formData, setFormData] = useState({
    nama_komunitas: '',
    koordinator: '',
    telepon: '',
    email_komunitas: '',
    jumlah_anggota: '',
    password: '',
    password_confirmation: ''
  });
  const navigate = useNavigate();

  // Fetch data komunitas
  useEffect(() => {
    fetchKomunitas();
  }, []);

  const fetchKomunitas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/admin-login');
        return;
      }

      const response = await api.get('/komunitas');
      setKomunitas(response.data.data || []);
      setError(null);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data anggota komunitas
  const fetchAnggota = async (idKomunitas) => {
    try {
      setLoading(true);
      const response = await api.get(`/anggota?komunitas_id=${idKomunitas}`);
      setAnggota(response.data.data || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err) => {
    console.error('Error:', err);
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/admin-login');
      return;
    }
    setError(err.response?.data?.message || 'Terjadi kesalahan');
    alert(err.response?.data?.message || 'Terjadi kesalahan');
  };

  // Filter data
  const filteredKomunitas = komunitas.filter(kom => 
    kom.nama_komunitas.toLowerCase().includes(search.toLowerCase()) ||
    kom.koordinator.toLowerCase().includes(search.toLowerCase())
  );

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open modal for add/edit
  const openModal = (komunitas = null) => {
    setCurrentKomunitas(komunitas);
    if (komunitas) {
      setFormData({
        nama_komunitas: komunitas.nama_komunitas,
        koordinator: komunitas.koordinator,
        telepon: komunitas.telepon,
        email_komunitas: komunitas.email_komunitas,
        jumlah_anggota: komunitas.jumlah_anggota,
        password: '',
        password_confirmation: ''
      });
    } else {
      setFormData({
        nama_komunitas: '',
        koordinator: '',
        telepon: '',
        email_komunitas: '',
        jumlah_anggota: '',
        password: '',
        password_confirmation: ''
      });
    }
    setShowModal(true);
  };

  // Open detail modal
  const openDetailModal = async (komunitas) => {
    setCurrentKomunitas(komunitas);
    await fetchAnggota(komunitas.id_komunitas);
    setShowDetailModal(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (currentKomunitas) {
        // Update
        const response = await api.put(`/komunitas/${currentKomunitas.id_komunitas}`, formData);
        setKomunitas(komunitas.map(k => 
          k.id_komunitas === currentKomunitas.id_komunitas ? response.data.data : k
        ));
        alert('Data berhasil diperbarui');
      } else {
        // Create
        const response = await api.post('/komunitas', formData);
        setKomunitas([...komunitas, response.data.data]);
        alert('Data berhasil ditambahkan');
      }
      
      setShowModal(false);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      setLoading(true);
      await api.delete(`/komunitas/${id}`);
      setKomunitas(komunitas.filter(k => k.id_komunitas !== id));
      alert('Data berhasil dihapus');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Komunitas', 'Koordinator', 'Telepon', 'Email', 'Jumlah Anggota'];
    const rows = filteredKomunitas.map(k => [
      k.id_komunitas,
      `"${k.nama_komunitas}"`,
      `"${k.koordinator}"`,
      k.telepon,
      k.email_komunitas,
      k.jumlah_anggota
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'komunitas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header dan Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Daftar Komunitas</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cari komunitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => openModal()}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Tambah</span>
            </button>
            
            <button
              onClick={fetchKomunitas}
              className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors shadow hover:shadow-md"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
              disabled={loading || komunitas.length === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Gagal memuat data</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchKomunitas}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      )}
      
      {/* Data table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          {filteredKomunitas.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Komunitas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Koordinator</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Anggota</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKomunitas.map(kom => (
                  <tr 
                    key={kom.id_komunitas} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openDetailModal(kom)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{kom.id_komunitas}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{kom.nama_komunitas}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{kom.koordinator}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{kom.telepon}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {kom.jumlah_anggota}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal(kom)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(kom.id_komunitas)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Hapus"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search ? 'Tidak ditemukan hasil pencarian' : 'Belum ada data komunitas'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentKomunitas ? 'Edit Komunitas' : 'Tambah Komunitas Baru'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Komunitas</label>
                    <input
                      type="text"
                      name="nama_komunitas"
                      value={formData.nama_komunitas}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Koordinator</label>
                    <input
                      type="text"
                      name="koordinator"
                      value={formData.koordinator}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telepon</label>
                    <input
                      type="tel"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email_komunitas"
                      value={formData.email_komunitas}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Jumlah Anggota</label>
                    <input
                      type="number"
                      name="jumlah_anggota"
                      value={formData.jumlah_anggota}
                      onChange={handleInputChange}
                      min="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={currentKomunitas ? 'Kosongkan jika tidak ingin mengubah' : ''}
                      required={!currentKomunitas}
                      minLength="8"
                    />
                  </div>
                  
                  {formData.password && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required={!!formData.password}
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    {loading ? 'Memproses...' : currentKomunitas ? 'Simpan Perubahan' : 'Tambah'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && currentKomunitas && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detail Komunitas</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nama Komunitas</h4>
                  <p className="mt-1 text-sm text-gray-900">{currentKomunitas.nama_komunitas}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Koordinator</h4>
                  <p className="mt-1 text-sm text-gray-900">{currentKomunitas.koordinator}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Telepon</h4>
                  <p className="mt-1 text-sm text-gray-900">{currentKomunitas.telepon}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="mt-1 text-sm text-blue-600">
                    <a href={`mailto:${currentKomunitas.email_komunitas}`}>{currentKomunitas.email_komunitas}</a>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Jumlah Anggota</h4>
                  <p className="mt-1 text-sm text-gray-900">{currentKomunitas.jumlah_anggota}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Daftar Anggota</h4>
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : anggota.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {anggota.map(agt => (
  <tr key={agt.id_anggota}>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agt.nama}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
      <a href={`mailto:${agt.email}`}>{agt.email}</a>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <a href={`tel:${agt.phone}`}>{agt.no_telepon}</a>
    </td>
  </tr>
))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Belum ada anggota terdaftar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}