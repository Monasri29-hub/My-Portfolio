import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageWrapper from './components/PageWrapper';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import About from './pages/About';
import Experience from './pages/Experience';
import Footer from './components/Footer';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <ParticleBackground />
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin" element={user ? <Navigate to="/admin/dashboard" /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/login" element={user ? <Navigate to="/admin/dashboard" /> : <Login />} />
          <Route path="/admin/dashboard" element={user && user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/admin/login" />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
