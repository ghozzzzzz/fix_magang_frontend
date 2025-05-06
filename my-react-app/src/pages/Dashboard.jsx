import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dasbor Pendaftaran</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Peserta Terdaftar</h3>
          <p className="text-4xl font-bold mt-2">150</p>
        </div>
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Menunggu Pendaftaran Ulang</h3>
          <p className="text-4xl font-bold mt-2">20</p>
        </div>
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Pendaftaran Bulan Ini</h3>
          <p className="text-4xl font-bold mt-2">30</p>
        </div>
      </div>
    </div>
  );
}