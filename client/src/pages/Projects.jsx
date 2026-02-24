import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Github, ExternalLink, X } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const isAdmin = user?.role === 'ADMIN';

    // Clean URL - remove embedded newlines/spaces from DB values
    const cleanUrl = (url) => url ? url.replace(/\s+/g, '').trim() : url;
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);

    const [filter, setFilter] = useState('All');
    const categories = ['All', 'AI/ML', 'Web Development', 'Research', 'Design'];

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await axios.get('/api/projects');
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this project?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/projects/${id}`, config);
                setProjects(projects.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.category === filter);

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading projects...</div>;

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>My Projects</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`btn filter-btn ${filter === cat ? 'active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {filteredProjects.map((project) => (
                    <motion.div
                        key={project.id}
                        className="card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        {project.imageUrl && (
                            <img
                                src={cleanUrl(project.imageUrl)}
                                alt={project.title}
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                        <h3 style={{ margin: '1rem 0 0.5rem' }}>{project.title}</h3>
                        <span className="project-tag">
                            {project.category}
                        </span>
                        <p className="project-desc">
                            {project.description.substring(0, 100)}...
                        </p>
                        <button
                            onClick={() => setSelectedProject(project)}
                            className="btn"
                            style={{
                                padding: '0',
                                fontSize: '0.9rem',
                                color: 'var(--accent-color)',
                                marginBottom: '1rem',
                                alignSelf: 'flex-start',
                                background: 'transparent',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                            Read Details
                        </button>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', flexWrap: 'wrap' }}>
                            {project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link">
                                    <Github size={16} /> Code
                                </a>
                            )}
                            {project.liveLink && (
                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-link">
                                    <ExternalLink size={16} /> Live Demo
                                </a>
                            )}
                        </div>

                        {isAdmin && (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="btn btn-outline"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                >
                                    Edit in Dashboard
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="btn"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#fee2e2', color: '#dc2626' }}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Project Modal */}
            {selectedProject && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    padding: '20px'
                }} onClick={() => setSelectedProject(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="card"
                        style={{
                            maxWidth: '800px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative',
                            padding: '2rem'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedProject(null)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        {selectedProject.imageUrl && (
                            <img
                                src={cleanUrl(selectedProject.imageUrl)}
                                alt={selectedProject.title}
                                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}

                        <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{selectedProject.title}</h2>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span className="project-tag">{selectedProject.category}</span>
                            {selectedProject.techStack && (
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                                    Stack: {selectedProject.techStack}
                                </span>
                            )}
                        </div>

                        <p style={{ lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
                            {selectedProject.description}
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {selectedProject.githubLink && (
                                <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Github size={18} /> View Code
                                </a>
                            )}
                            {selectedProject.liveLink && (
                                <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ExternalLink size={18} /> Live Demo
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Projects;
