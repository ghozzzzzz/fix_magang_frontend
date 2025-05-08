import React, { useState } from 'react';
import Layout from '../admin/Layout';
import Dashboard from '../admin/Dashboard';
import Komunitas from '../admin/Komunitas';
import Booking from '../admin/Booking';
import Peserta from '../admin/Peserta';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
    {activeSection === 'dashboard' && <Dashboard />}
    {activeSection === 'komunitas' && <Komunitas />}
    {activeSection === 'booking' && <Booking />}
    {activeSection === 'peserta' && <Peserta />}
  </Layout>
  );
}