import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Komunitas() {
  const [search, setSearch] = useState('');
  const [komunitas, setKomunitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKomunitas = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/komunitas', {
          headers: {
            Authorization: '3|DObpaXGVqygttKJ6rxeDnfgLSq8G1TauNSPJPamn89f4d398',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        setKomunitas(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal mengambil data komunitas');
      } finally {
        setLoading(false);
      }
    };

    fetchKomunitas();
  }, []);

  const filtered = komunitas.filter((d) =>
    d.nama_komunitas.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Komunitas', 'Koordinator', 'Telepon', 'Email', 'Jumlah Anggota'];
    const rows = filtered.map(d => [
      d.id_komunitas,
      d.nama_komunitas,
      d.koordinator,
      d.telepon,
      d.email_komunitas,
      d.jumlah_anggota,
    ]);
    const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'komunitas.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Komunitas</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
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
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
            disabled={loading || komunitas.length === 0}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data komunitas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Gagal memuat data</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      ) : (
        <div className="w-full">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">Nama Komunitas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">Koordinator</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[130px]">Telepon</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">Email</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">Jumlah Anggota</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((kom) => (
                <tr key={kom.id_komunitas} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{kom.id_komunitas}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 truncate">{kom.nama_komunitas}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate">{kom.koordinator}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{kom.telepon}</td>
                  <td className="px-4 py-3 text-sm text-blue-600 hover:underline truncate">
                    <a href={`mailto:${kom.email_komunitas}`}>{kom.email_komunitas}</a>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {kom.jumlah_anggota}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada hasil</h3>
          <p className="mt-1 text-sm text-gray-500">Tidak ditemukan komunitas dengan kata kunci "{search}"</p>
        </div>
      )}
    </div>
  );
}
