import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Code, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70px', position: 'relative' }}>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ display: 'none', color: 'var(--primary-color)', position: 'absolute', right: '1rem' }}
                    className="mobile-menu-btn"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Menu */}
                <ul style={{ display: 'flex', gap: '2rem', alignItems: 'center', margin: 0 }} className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <li><Link to="/" style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>Home</Link></li>
                    <li><Link to="/about" style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>About</Link></li>
                    <li><Link to="/experience" style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>Experience</Link></li>
                    <li><Link to="/projects" style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>Projects</Link></li>
                    <li><Link to="/blog" style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>Blog</Link></li>
                    <li><Link to="/contact" style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>Contact</Link></li>

                    <li>
                        <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-color)' }} aria-label="Toggle Theme">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </li>
                </ul>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
          .nav-links {
            position: absolute;
            top: 70px;
            left: 0;
            width: 100%;
            background: var(--card-bg);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            display: none !important;
          }
          .nav-links.open { display: flex !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
