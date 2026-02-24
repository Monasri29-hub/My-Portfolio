import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Calendar, X, Award, ExternalLink } from 'lucide-react';

const typeColors = {
    'Internship': { bg: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', border: 'rgba(139, 92, 246, 0.3)' },
    'Self-employed': { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
    'Full-time': { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
    'Part-time': { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
};

const getTypeStyle = (desc = '') => {
    for (const key of Object.keys(typeColors)) {
        if (desc.toLowerCase().includes(key.toLowerCase())) return typeColors[key];
    }
    return { bg: 'rgba(100, 116, 139, 0.12)', color: '#64748b', border: 'rgba(100, 116, 139, 0.3)' };
};

const extractType = (desc = '', company = '') => {
    const types = ['Internship', 'Self-employed', 'Full-time', 'Part-time', 'Freelance'];
    return types.find(t => desc.toLowerCase().includes(t.toLowerCase())) || 'Experience';
};

const formatDate = (dateStr) => {
    if (!dateStr) return '?';
    const [year, month] = dateStr.split('-');
    return new Date(year, parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const CertModal = ({ item, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}
    >
        <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            style={{
                background: 'var(--card-bg)',
                borderRadius: '20px',
                padding: '2rem',
                maxWidth: '680px',
                width: '100%',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 25px 60px rgba(139, 92, 246, 0.2)',
                position: 'relative'
            }}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'rgba(255,255,255,0.08)', border: 'none',
                    borderRadius: '50%', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-primary)'
                }}
            >
                <X size={18} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
                <h2 style={{ margin: '0 0 0.3rem', fontSize: '1.4rem', color: 'var(--text-primary)' }}>{item.role}</h2>
                <div style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '1rem', marginBottom: '0.5rem' }}>{item.company}</div>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} />
                        {formatDate(item.startDate)} — {item.current ? <span style={{ color: '#10b981', fontWeight: '600' }}>Present</span> : formatDate(item.endDate)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} /> Remote
                    </span>
                </div>
            </div>

            {/* Description */}
            {item.description && (
                <p style={{
                    color: 'var(--text-secondary)', lineHeight: '1.8', margin: '0 0 1.5rem',
                    borderLeft: '3px solid #8b5cf6', paddingLeft: '1rem', fontSize: '0.95rem'
                }}>
                    {item.description}
                </p>
            )}

            {/* Certificate section */}
            <div style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1.5rem'
            }}>
                {item.certificationUrl ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f59e0b', fontWeight: '600' }}>
                            <Award size={18} /> Certificate
                        </div>
                        {/* If it's an image URL, show image; else show link */}
                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(item.certificationUrl) ? (
                            <img
                                src={item.certificationUrl}
                                alt="Certificate"
                                style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                                onError={e => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <a
                                href={item.certificationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                    color: '#f59e0b', borderRadius: '10px',
                                    padding: '0.6rem 1.2rem', textDecoration: 'none',
                                    fontWeight: '600', fontSize: '0.9rem'
                                }}
                            >
                                <ExternalLink size={15} /> View Certificate
                            </a>
                        )}
                    </>
                ) : (
                    <div style={{
                        textAlign: 'center', padding: '2rem',
                        background: 'rgba(100, 116, 139, 0.05)',
                        borderRadius: '12px',
                        border: '1px dashed var(--border-color)',
                        color: 'var(--text-secondary)'
                    }}>
                        <Award size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>No certificate added yet.<br />Add one via the Admin Dashboard.</p>
                    </div>
                )}
            </div>
        </motion.div>
    </motion.div>
);

const Experience = () => {
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        axios.get('/api/experience')
            .then(({ data }) => setExperience(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: '3px solid var(--border-color)',
                    borderTopColor: '#8b5cf6',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 1rem'
                }} />
                <p style={{ color: 'var(--text-secondary)' }}>Loading experience...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <>
            <div style={{ padding: '5rem 20px', maxWidth: '860px', margin: '0 auto' }}>
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', marginBottom: '5rem' }}
                >
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '30px', padding: '0.4rem 1.2rem',
                        marginBottom: '1.5rem', fontSize: '0.85rem',
                        color: '#8b5cf6', fontWeight: '500',
                        letterSpacing: '0.05em', textTransform: 'uppercase'
                    }}>
                        <Briefcase size={14} /> Professional Journey
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '700',
                        margin: '0 0 1rem',
                        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        lineHeight: '1.2'
                    }}>
                        Work Experience
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto', lineHeight: '1.7' }}>
                        Click on any card to view details and certification
                    </p>
                </motion.div>

                {/* Timeline */}
                {experience.length > 0 ? (
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute', left: '1.5rem', top: 0, bottom: 0,
                            width: '2px',
                            background: 'linear-gradient(to bottom, #8b5cf6, #ec4899, transparent)',
                            opacity: 0.4
                        }} />

                        {experience.map((item, index) => {
                            const typeStyle = getTypeStyle(item.description || '');
                            const empType = extractType(item.description || '', item.company);

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.08, duration: 0.4 }}
                                    style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', paddingLeft: '1rem' }}
                                >
                                    {/* Dot */}
                                    <div style={{ flexShrink: 0, zIndex: 1 }}>
                                        <div style={{
                                            width: '1rem', height: '1rem', borderRadius: '50%',
                                            background: '#8b5cf6',
                                            boxShadow: '0 0 0 4px rgba(139,92,246,0.2), 0 0 16px rgba(139,92,246,0.4)',
                                            marginTop: '1.3rem'
                                        }} />
                                    </div>

                                    {/* Card — clickable */}
                                    <div
                                        onClick={() => setSelected(item)}
                                        style={{
                                            flex: 1,
                                            background: 'var(--card-bg)',
                                            borderRadius: '16px',
                                            padding: '1.25rem 1.75rem',
                                            border: '1px solid var(--border-color)',
                                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(139,92,246,0.18)';
                                            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                                {item.role}
                                            </h3>
                                            <span style={{
                                                background: typeStyle.bg, color: typeStyle.color,
                                                border: `1px solid ${typeStyle.border}`,
                                                borderRadius: '20px', padding: '0.15rem 0.75rem',
                                                fontSize: '0.72rem', fontWeight: '600',
                                                textTransform: 'uppercase', letterSpacing: '0.05em'
                                            }}>
                                                {empType}
                                            </span>
                                        </div>

                                        <div style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.6rem' }}>
                                            {item.company}
                                        </div>

                                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                                <Calendar size={12} />
                                                {formatDate(item.startDate)} — {item.current ? <span style={{ color: '#10b981', fontWeight: '600' }}>Present</span> : formatDate(item.endDate)}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                                <MapPin size={12} /> Remote
                                            </span>
                                            {item.certificationUrl && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#f59e0b' }}>
                                                    <Award size={12} /> Certificate available
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem' }}>
                        <Briefcase size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>No experience entries yet.</p>
                    </div>
                )}
            </div>

            {/* Certification Modal */}
            <AnimatePresence>
                {selected && <CertModal item={selected} onClose={() => setSelected(null)} />}
            </AnimatePresence>
        </>
    );
};

export default Experience;
