import React, { useState } from 'react';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Komunitas from './Komunitas';
import Booking from './Booking';
import Peserta from './Peserta';

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