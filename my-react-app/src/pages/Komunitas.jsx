import React, { useState } from 'react';
import { dummyData } from './Data';

export default function Komunitas() {
  const [search, setSearch] = useState('');

  const filtered = dummyData.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Komunitas', 'Koordinator', 'Telepon', 'Email', 'Jumlah Anggota'];
    const rows = filtered.map(d => [d.id, d.nama, d.koordinator, d.telepon, d.email, d.jumlah]);
    const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'komunitas.csv';
    a.click();
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Komunitas</h2>
      <div className="flex justify-between mb-4">
        <input
          className="border p-2 rounded w-1/2"
          placeholder="Cari komunitas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleExportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nama Komunitas</th>
            <th className="border p-2">Koordinator</th>
            <th className="border p-2">Telepon</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Jumlah Anggota</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((kom) => (
            <tr key={kom.id} className="border-b hover:bg-gray-50">
              <td className="border p-2 text-center">{kom.id}</td>
              <td className="border p-2">{kom.nama}</td>
              <td className="border p-2">{kom.koordinator}</td>
              <td className="border p-2">{kom.telepon}</td>
              <td className="border p-2">{kom.email}</td>
              <td className="border p-2 text-center">{kom.jumlah}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}