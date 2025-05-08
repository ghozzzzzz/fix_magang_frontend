import React from 'react';
import { dummyBookings } from './Data';

export default function Booking() {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Daftar Booking Ruangan / Aula</h2>
      {dummyBookings.length === 0 ? (
        <p className="text-gray-500">Belum ada booking yang masuk.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Waktu</th>
              <th className="border p-2">Nama Kegiatan</th>
              <th className="border p-2">Pemesan</th>
            </tr>
          </thead>
          <tbody>
            {dummyBookings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="border p-2 text-center">{b.id}</td>
                <td className="border p-2 text-center">{b.tanggal}</td>
                <td className="border p-2 text-center">{b.waktu}</td>
                <td className="border p-2">{b.kegiatan}</td>
                <td className="border p-2">{b.pemesan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}