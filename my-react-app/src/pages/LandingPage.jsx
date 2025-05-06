import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer'; // Untuk mendeteksi elemen dalam viewport

// Komponen untuk animasi section
const Section = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Efek scroll untuk header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans">
      {/* Header Tetap */}
      <motion.header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-blue-700 shadow-lg bg-opacity-90' : 'bg-blue-600'
        } text-white p-4`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Indigo Space SDK
          </motion.h1>
          <nav className="flex space-x-4 items-center">
            {['tentang', 'fasilitas', 'komunitas', 'bergabung'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className="relative text-white hover:text-yellow-300 transition-colors duration-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1).replace('bergabung', 'Cara Bergabung')}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 hover:w-full"></span>
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/login" className="text-white hover:text-yellow-300 transition-colors duration-300">
                Masuk
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/register" className="text-white hover:text-yellow-300 transition-colors duration-300">
                Daftar
              </Link>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section dengan Parallax */}
      <section
        className="relative bg-cover bg-center h-[500px] text-white flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://source.unsplash.com/1600x900/?coworking,community)', // Ganti dengan gambar yang sesuai
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        }}
      >
        <motion.div
          className="bg-blue-700 bg-opacity-70 p-8 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Selamat Datang di Indigo Space SDK
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Ruang kolaboratif untuk komunitas digital dan UMKM Kota Semarang
          </motion.p>
          <motion.div
            className="space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              to="/login"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors duration-300"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors duration-300"
            >
              Daftar Sekarang
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Tentang Kami */}
      <Section>
        <section id="tentang" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold mb-6 text-blue-700">Tentang Kami</h3>
            <p className="text-lg text-gray-700">
              Indigo Space SDK adalah ruang kolaborasi bagi komunitas digital dan UMKM di Kota Semarang untuk berkreasi, berkoneksi, dan berkolaborasi antar komunitas.
            </p>
          </div>
        </section>
      </Section>

      {/* Fasilitas */}
      <Section delay={0.2}>
        <section id="fasilitas" className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold mb-6 text-blue-700">Fasilitas</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
              {['Ruang Rapat', 'Coworking Space', 'Internet Cepat', 'Area Istirahat', 'Fasilitas Presentasi'].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-blue-600">✔</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      </Section>

      {/* Komunitas */}
      <Section delay={0.4}>
        <section id="komunitas" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold mb-6 text-blue-700">Komunitas</h3>
            <p className="text-lg text-gray-700">
              Berbagai komunitas telah bergabung dengan Indigo Space SDK, termasuk komunitas teknologi, UMKM, dan kreatif. Kami mendukung kegiatan seperti workshop, seminar, dan networking event.
            </p>
          </div>
        </section>
      </Section>

      {/* Cara Bergabung */}
      <Section delay={0.6}>
        <section id="bergabung" className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold mb-6 text-blue-700">Cara Bergabung</h3>
            <ol className="space-y-4 list-decimal list-inside text-lg text-gray-700">
              <motion.li whileHover={{ x: 10 }} transition={{ duration: 0.3 }}>
                Mengisi formulir pendaftaran online.
              </motion.li>
              <motion.li whileHover={{ x: 10 }} transition={{ duration: 0.3 }}>
                Menunggu konfirmasi dari tim Indigo Space SDK.
              </motion.li>
              <motion.li whileHover={{ x: 10 }} transition={{ duration: 0.3 }}>
                Mulai berpartisipasi dalam kegiatan dan menggunakan fasilitas yang tersedia.
              </motion.li>
            </ol>
          </div>
        </section>
      </Section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-6">
        <div className="container mx-auto text-center space-y-4">
          <p>© 2025 Indigo Space SDK Semarang. All rights reserved.</p>
          <p>Jl. Empu Tantular No. 2, Bandarharjo, Kota Semarang</p>
          <p>Email: info@indigospacesdk.semarangkota.go.id | Telp: (024) 123-4567</p>
          <div className="flex justify-center space-x-4">
            <a href="https://facebook.com" className="text-white hover:text-yellow-300 transition-colors duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.068 4.388 22.954 10.125 24v-8.437H7.078V12.073h3.047V9.428c0-3.007 1.792-4.669 4.532-4.669 1.312 0 2.686.234 2.686.234v2.953h-1.512c-1.488 0-1.947.927-1.947 1.874v2.253h3.328l-.531 3.461h-2.797V24C19.612 22.954 24 18.068 24 12.073z"/>
              </svg>
            </a>
            <a href="https://twitter.com" className="text-white hover:text-yellow-300 transition-colors duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878a4.65 4.65 0 01-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568a4.68 4.68 0 01-2.102.08c.592 1.846 2.31 3.192 4.344 3.23a9.342 9.342 0 01-5.786 1.995c-.375 0-.745-.022-1.112-.066a13.19 13.19 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.603a9.47 9.47 0 002.331-2.414z"/>
              </svg>
            </a>
            <a href="https://instagram.com" className="text-white hover:text-yellow-300 transition-colors duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.265.058-1.645.069-4.849.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.265-.058 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-1.405.064-2.806.367-3.952 1.513S1.654 4.222 1.59 5.627c-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.064 1.405.367 2.806 1.513 3.952s2.547 1.449 3.952 1.513c1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.405-.064 2.806-.367 3.952-1.513s1.449-2.547 1.513-3.952c.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.064-1.405-.367-2.806-1.513-3.952S19.405.79 18 .726c-1.28-.058-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;