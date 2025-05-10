import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import batikImage from '../assets/batik.jpg';
import gamelanAudio from '../assets/gamelan.mp3'; // Import the gamelan audio file

// Section Component
const Section = ({ children, delay = 0, className = '', id }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start({ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }
      });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 80 }}
      animate={controls}
      className={`relative ${className}`}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, color }) => {
  return (
    <motion.div 
      className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm bg-white/90 border border-white/20 hover:shadow-xl transition-all duration-300 ${color}`}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Running Text Component
const RunningText = () => {
  return (
    <div className="bg-amber-600 text-white py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <span className="mx-4">Selamat datang di Indigo Space SDK - Nikmati fasilitas premium dengan nuansa budaya Indonesia!</span>
        <span className="mx-4">Bergabunglah dengan komunitas digital dan UMKM terbesar di Semarang!</span>
        <span className="mx-4">Daftar sekarang dan rasakan pengalaman kolaborasi tanpa batas!</span>
      </div>
    </div>
  );
};

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef(null);

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect for hero section
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Audio playback control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set initial volume to 30%
      audioRef.current.play().catch(error => console.log("Audio play failed:", error));
    }
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const facilities = [
    { icon: "💻", title: "Coworking Space", description: "Ruang kerja nyaman dengan meja ergonomis dan kursi premium" },
    { icon: "📶", title: "Internet Cepat", description: "Koneksi fiber optic 1Gbps untuk kebutuhan digital Anda" },
    { icon: "👥", title: "Ruang Meeting", description: "Ruang rapat profesional dengan peralatan presentasi lengkap" },
    { icon: "☕", title: "Area Istirahat", description: "Lounge nyaman dengan coffee bar dan snack sehat" },
    { icon: "🖨️", title: "Fasilitas Cetak", description: "Printer high-quality dan scanner dokumen" },
    { icon: "🎤", title: "Event Space", description: "Area untuk workshop, seminar, dan networking event" }
  ];

  return (
    <div className="font-sans bg-gradient-to-br from-amber-50 to-red-50 overflow-x-hidden">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
            display: inline-block;
          }
          .batik-pattern {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path fill="rgba(139, 69, 19, 0.2)" d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C28.5 90 10 71.5 10 50S28.5 10 50 10s40 18.5 40 40-18.5 40-40 40z"/><path fill="rgba(255, 215, 0, 0.3)" d="M50 20c-16.6 0-30 13.4-30 30s13.4 30 30 30 30-13.4 30-30-13.4-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"/></svg>');
            background-repeat: repeat;
          }
        `}
      </style>

      {/* Floating Background Elements with Batik Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none batik-pattern">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-200/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              opacity: 0.1
            }}
            animate={{
              x: [null, Math.random() * 200 - 100],
              y: [null, Math.random() * 200 - 100],
              transition: {
                duration: Math.random() * 30 + 20,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>

      {/* Audio Element (hidden) */}
      <audio ref={audioRef} loop src={gamelanAudio} />

      {/* Header with Batik Theme and Mute Button */}
      <motion.header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-amber-800/90 shadow-lg backdrop-blur-md' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.6, 0.05, -0.01, 0.9] }}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                IS
              </div>
              <span className={`text-xl font-bold ${isScrolled ? 'text-white' : 'text-white'}`}>
                Indigo Space
              </span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {['tentang', 'fasilitas', 'komunitas', 'bergabung'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <button
                  onClick={() => scrollToSection(item)}
                  className={`relative group ${isScrolled ? 'text-white' : 'text-white'}`}
                >
                  <span className="font-medium">
                    {item.charAt(0).toUpperCase() + item.slice(1).replace('bergabung', 'Bergabung')}
                  </span>
                  <span className="absolute left-0 bottom-0 h-0.5 bg-amber-400 w-0 group-hover:w-full transition-all duration-300"></span>
                </button>
              </motion.div>
            ))}
          </nav>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={toggleMute}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isScrolled 
                  ? 'text-amber-300 hover:bg-amber-900/50' 
                  : 'text-white hover:bg-amber-900/20'
              }`}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isScrolled 
                  ? 'text-amber-300 hover:bg-amber-900/50' 
                  : 'text-white hover:bg-amber-900/20'
              }`}
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isScrolled
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              Daftar
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section with Local Batik Image Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-red-900/80 z-0"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`
          }}
        />
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-30"
          style={{
            backgroundImage: `url(${batikImage})`,
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) scale(1.1)`
          }}
        />
        
        <motion.div 
          className="relative z-10 text-center px-6 max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-white">
              Kolaborasi Tanpa Batas di
            </span><br />
            <span className="text-white">Indigo Space SDK</span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Ruang kolaboratif eksklusif dengan nuansa budaya Indonesia untuk komunitas digital dan UMKM Kota Semarang.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              to="/register"
              className="px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              whileHover={{ y: -4 }}
            >
              <span>Mulai Sekarang</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <button
              onClick={() => scrollToSection('fasilitas')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Lihat Fasilitas</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <button onClick={() => scrollToSection('tentang')} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </motion.div>
      </section>

      {/* Running Text */}
      <RunningText />

      {/* Tentang Kami */}
      <Section delay={0.2} id="tentang" className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1596702874057-720d663ef937" 
                  alt="Batik Workshop" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent"></div>
              </div>
            </motion.div>
            
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-red-600">
                  Tentang Indigo Space
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Indigo Space SDK adalah pusat inovasi dan kolaborasi dengan sentuhan budaya Indonesia, khususnya batik, yang mempertemukan komunitas digital, kreator konten, dan pelaku UMKM Semarang.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { number: "50+", label: "Komunitas" },
                  { number: "300+", label: "Anggota" },
                  { number: "100+", label: "Event/Tahun" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-md border border-amber-100"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-2xl font-bold text-amber-600">{stat.number}</div>
                    <div className="text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Fasilitas */}
      <Section delay={0.4} id="fasilitas" className="py-20 bg-gradient-to-br from-amber-50 to-red-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Fasilitas <span className="text-amber-600">Premium</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nikmati fasilitas berkualitas tinggi dengan nuansa budaya Indonesia untuk mendukung produktivitas Anda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <FeatureCard
                key={index}
                icon={facility.icon}
                title={facility.title}
                description={facility.description}
                color={index % 2 === 0 ? "bg-gradient-to-br from-white to-amber-50" : "bg-white"}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Komunitas */}
      <Section delay={0.6} id="komunitas" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Komunitas <span className="text-red-600">Kreatif</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bergabunglah dengan jaringan profesional dan kreatif terbesar di Semarang dengan nuansa budaya lokal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Indigo Space memberikan wadah yang sempurna untuk bertemu dengan sesama kreator digital.",
                author: "Sarah Wijaya",
                role: "Founder CreativeHub Semarang",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "Sejak bergabung, bisnis batik saya berkembang melalui kolaborasi dengan UMKM lainnya.",
                author: "Budi Santoso",
                role: "Pemilik Batik Semar",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: "Event networking dengan tema budaya membantu saya menemukan klien dan mitra bisnis.",
                author: "Rina Dewi",
                role: "Digital Marketer",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-amber-400 text-2xl mb-4">"</div>
                <p className="text-gray-600 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-bold text-gray-800">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Cara Bergabung */}
      <Section delay={0.8} id="bergabung" className="py-20 bg-gradient-to-br from-red-50 to-amber-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Cara <span className="text-amber-600">Bergabung</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mulai perjalanan kolaboratif Anda dalam 3 langkah mudah.
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-200 to-red-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
              {[
                {
                  step: "1",
                  title: "Daftar Online",
                  description: "Isi formulir pendaftaran online dengan data diri dan informasi bisnis Anda.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )
                },
                {
                  step: "2",
                  title: "Verifikasi",
                  description: "Tim kami akan menghubungi Anda untuk verifikasi data dan proses seleksi.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  step: "3",
                  title: "Akses Fasilitas",
                  description: "Setelah disetujui, Anda bisa langsung menggunakan semua fasilitas dan mengikuti event.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative bg-white p-8 rounded-2xl shadow-lg border border-amber-100"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 lg:left-8 lg:translate-x-0 w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.step}
                  </div>
                  <div className="mt-6 mb-4 text-amber-600">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Daftar Sekarang - Gratis!
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 bg-gradient-to-r from-amber-900 to-red-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Bergabung dengan Komunitas Kami?
          </h2>
          <p className="text-xl text-amber-200 mb-10 max-w-2xl mx-auto">
            Jadilah bagian dari ekosistem digital dan UMKM terbesar di Semarang dengan nuansa budaya Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-amber-700 font-semibold rounded-lg hover:bg-amber-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Daftar Sekarang
            </Link>
            <button
              onClick={() => scrollToSection('fasilitas')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Lihat Fasilitas
            </button>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  IS
                </div>
                <span className="text-xl font-bold">Indigo Space</span>
              </div>
              <p className="text-amber-200 mb-4">
                Ruang kolaborasi dengan nuansa budaya Indonesia untuk komunitas digital dan UMKM Kota Semarang.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="text-amber-200 hover:text-white transition-colors duration-300"
                  >
                    <span className="sr-only">{social}</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <use xlinkHref={`#${social}-icon`} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
              <ul className="space-y-2">
                {['tentang', 'fasilitas', 'komunitas', 'bergabung'].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => scrollToSection(item)}
                      className="text-amber-200 hover:text-white transition-colors duration-300"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <address className="not-italic text-amber-200 space-y-2">
                <p>Jl. Empu Tantular No. 2</p>
                <p>Bandarharjo, Kota Semarang</p>
                <p>Email: info@indigospace.id</p>
                <p>Telp: (024) 123-4567</p>
              </address>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Jam Operasional</h4>
              <ul className="text-amber-200 space-y-2">
                <li>Senin-Jumat: 08.00 - 22.00</li>
                <li>Sabtu: 09.00 - 17.00</li>
                <li>Minggu: Tutup</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-amber-800 mt-12 pt-8 text-center text-amber-200">
            <p>© {new Date().getFullYear()} Indigo Space SDK. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Social Media Icons */}
      <svg xmlns="http://www.w3.org/2000/svg" className="hidden">
        <symbol id="facebook-icon" viewBox="0 0 24 24">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.068 4.388 22.954 10.125 24v-8.437H7.078V12.073h3.047V9.428c0-3.007 1.792-4.669 4.532-4.669 1.312 0 2.686.234 2.686.234v2.953h-1.512c-1.488 0-1.947.927-1.947 1.874v2.253h3.328l-.531 3.461h-2.797V24C19.612 22.954 24 18.068 24 12.073z"/>
        </symbol>
        <symbol id="twitter-icon" viewBox="0 0 24 24">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878a4.65 4.65 0 01-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568a4.68 4.68 0 01-2.102.08c.592 1.846 2.31 3.192 4.344 3.23a9.342 9.342 0 01-5.786 1.995c-.375 0-.745-.022-1.112-.066a13.19 13.19 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.603a9.47 9.47 0 002.331-2.414z"/>
        </symbol>
        <symbol id="instagram-icon" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.265.058-1.645.069-4.849.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.265-.058 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-1.405.064-2.806.367-3.952 1.513S1.654 4.222 1.59 5.627c-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.064 1.405.367 2.806 1.513 3.952s2.547 1.449 3.952 1.513c1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.405-.064 2.806-.367 3.952-1.513s1.449-2.547 1.513-3.952c.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.064-1.405-.367-2.806-1.513-3.952S19.405.79 18 .726c-1.28-.058-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
        </symbol>
        <symbol id="linkedin-icon" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </symbol>
      </svg>
    </div>
  );
}

export default LandingPage;