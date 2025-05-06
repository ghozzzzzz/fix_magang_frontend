import React, { useState } from 'react';
import { dummyParticipants } from './Data';

export default function Peserta() {
  const [participants, setParticipants] = useState(dummyParticipants);

  const handleStatusChange = (id) => {
    setParticipants(participants.map(p =>
      p.id === id
        ? { ...p, status: p.status === 'pending' ? 'approved' : 'pending' }
        : p
    ));
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Manajemen Peserta</h2>
      {participants.length === 0 ? (
        <p className="text-gray-500">Belum ada data peserta.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nama Peserta</th>
              <th className="border p-2">Komunitas</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="border p-2 text-center">{p.id}</td>
                <td className="border p-2">{p.nama}</td>
                <td className="border p-2">{p.komunitas}</td>
                <td className="border p-2">{p.email}</td>
                <td className="border p-2 text-center">{p.status}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleStatusChange(p.id)}
                    className={`px-3 py-1 rounded text-white ${
                      p.status === 'pending' ? 'bg-blue-600' : 'bg-yellow-600'
                    }`}
                  >
                    {p.status === 'pending' ? 'Setujui' : 'Batalkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}