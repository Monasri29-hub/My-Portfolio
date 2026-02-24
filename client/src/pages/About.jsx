import { useState, useEffect } from 'react';
import axios from 'axios';
import { Github, Linkedin, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [education, setEducation] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    axios.get('/api/profile'),
                    axios.get('/api/education')
                ]);

                const [profileRes, eduRes] = results;

                if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
                if (eduRes.status === 'fulfilled') setEducation(eduRes.value.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const ensureHttp = (url) => {
        if (!url) return url;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    if (loading) return (
        <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
            <p>Loading...</p>
        </div>
    );

    const Section = ({ title, items, type }) => (
        <div style={{ marginTop: '4rem' }}>
            <h3 style={{
                borderBottom: '2px solid var(--primary-color)',
                paddingBottom: '0.5rem',
                display: 'inline-block',
                marginBottom: '2rem',
                fontSize: '1.5rem'
            }}>
                {title}
            </h3>
            <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '2rem', position: 'relative' }}>
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{ marginBottom: '2.5rem', position: 'relative' }}
                    >
                        <div style={{
                            position: 'absolute',
                            left: '-2.6rem',
                            top: '0.3rem',
                            width: '0.9rem',
                            height: '0.9rem',
                            background: 'var(--primary-color)',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px var(--primary-color)'
                        }} />

                        <h4 style={{ fontSize: '1.2rem', margin: '0 0 0.25rem' }}>
                            {type === 'exp' ? item.role : item.degree}
                        </h4>
                        <div style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '0.25rem' }}>
                            {type === 'exp' ? item.company : item.institution}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                            {item.startDate} — {item.current ? 'Present' : (item.endDate || '?')}
                        </div>
                        {item.description && (
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
                                {item.description}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '4rem 20px', maxWidth: '900px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        About Me
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '700px',
                        margin: '0 auto 2rem',
                        lineHeight: '1.8'
                    }}>
                        {profile?.bio || "Welcome! I'm an AI/ML student passionate about building intelligent systems."}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {profile?.githubUrl && (
                            <a
                                href={ensureHttp(profile.githubUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Github size={18} /> GitHub
                            </a>
                        )}
                        {profile?.linkedinUrl && (
                            <a
                                href={ensureHttp(profile.linkedinUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0077b5', borderColor: '#0077b5' }}
                            >
                                <Linkedin size={18} /> LinkedIn
                            </a>
                        )}
                        {profile?.resumeUrl && (
                            <a
                                href={ensureHttp(profile.resumeUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e11d48', borderColor: '#e11d48' }}
                            >
                                <FileText size={18} /> Resume
                            </a>
                        )}
                    </div>
                </div>

                {/* Education Section */}
                {education.length > 0 && (
                    <Section title="🎓 Education" items={education} type="edu" />
                )}



            </motion.div>
        </div>
    );
};

export default About;
