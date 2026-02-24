import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // UI State
    const [activeTab, setActiveTab] = useState('projects');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Data State
    const [projects, setProjects] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);

    // Forms State
    const [projectData, setProjectData] = useState({
        title: '', description: '', techStack: '', category: 'AI/ML', imageUrl: '', githubLink: '', liveLink: ''
    });
    const [editingProject, setEditingProject] = useState(null);

    const [blogData, setBlogData] = useState({
        title: '', content: '', tags: '', published: true
    });

    const [profileData, setProfileData] = useState({
        bio: '', resumeUrl: '', githubUrl: '', linkedinUrl: '', mediumUrl: '', publicEmail: '', location: ''
    });

    const [expForm, setExpForm] = useState({ company: '', role: '', startDate: '', endDate: '', description: '', certificationUrl: '', current: false });
    const [editingExp, setEditingExp] = useState(null);
    const [eduForm, setEduForm] = useState({ institution: '', degree: '', startDate: '', endDate: '', description: '', current: false });


    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            fetchAllData();
        } else if (!loading) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const fetchAllData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const results = await Promise.allSettled([
                axios.get('/api/projects'),
                axios.get('/api/blogs'),
                axios.get('/api/contact/messages', config),
                axios.get('/api/profile', config),
                axios.get('/api/experience', config),
                axios.get('/api/education', config)
            ]);

            const [projRes, blogRes, msgRes, profileRes, expRes, eduRes] = results;

            if (projRes.status === 'fulfilled') setProjects(projRes.value.data);
            if (blogRes.status === 'fulfilled') setBlogs(blogRes.value.data);
            if (msgRes.status === 'fulfilled') setMessages(msgRes.value.data);
            if (profileRes.status === 'fulfilled' && profileRes.value.data) setProfileData(profileRes.value.data);
            if (expRes.status === 'fulfilled') setExperience(expRes.value.data);
            if (eduRes.status === 'fulfilled') setEducation(eduRes.value.data);

        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response && error.response.status === 401) {
                logout();
                navigate('/login');
            }
            setMessage('Error connecting to server. Please check console.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- PROJECT HANDLERS ---
    const handleProjectChange = (e) => setProjectData({ ...projectData, [e.target.name]: e.target.value });

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingProject) {
                await axios.put(`/api/projects/${editingProject.id}`, projectData, config);
                setMessage('Project updated successfully!');
            } else {
                await axios.post('/api/projects', projectData, config);
                setMessage('Project added successfully!');
            }
            resetProjectForm();
            const { data } = await axios.get('/api/projects');
            setProjects(data);
        } catch (error) {
            setMessage('Error saving project');
            console.error(error);
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Delete this project?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/projects/${id}`, config);
                setMessage('Project deleted');
                const { data } = await axios.get('/api/projects');
                setProjects(data);
            } catch (error) {
                setMessage('Error deleting project');
            }
        }
    };

    const handleEditClick = (project) => {
        setEditingProject(project);
        setProjectData({
            title: project.title,
            description: project.description,
            techStack: project.techStack,
            category: project.category,
            imageUrl: project.imageUrl || '',
            githubLink: project.githubLink || '',
            liveLink: project.liveLink || ''
        });
        window.scrollTo(0, 0);
    };

    const resetProjectForm = () => {
        setEditingProject(null);
        setProjectData({ title: '', description: '', techStack: '', category: 'AI/ML', imageUrl: '', githubLink: '', liveLink: '' });
    };

    // --- BLOG HANDLERS ---
    const handleBlogChange = (e) => {
        const value = e.target.name === 'published' ? e.target.checked : e.target.value;
        setBlogData({ ...blogData, [e.target.name]: value });
    };

    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/blogs', blogData, config);
            setMessage('Blog post added!');
            setBlogData({ title: '', content: '', tags: '', published: true });
            const { data } = await axios.get('/api/blogs');
            setBlogs(data);
        } catch (error) {
            setMessage('Error adding blog');
        }
    };

    // --- PROFILE HANDLERS ---
    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put('/api/profile', profileData, config);
            setMessage('Profile updated!');
        } catch (error) {
            setMessage('Error updating profile');
        }
    };

    // --- EXPERIENCE HANDLERS ---
    const handleAddExperience = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingExp) {
                await axios.put(`/api/experience/${editingExp.id}`, expForm, config);
                setMessage('Experience updated!');
                setEditingExp(null);
            } else {
                await axios.post('/api/experience', expForm, config);
                setMessage('Experience added!');
            }
            setExpForm({ company: '', role: '', startDate: '', endDate: '', description: '', certificationUrl: '', current: false });
            const { data } = await axios.get('/api/experience', config);
            setExperience(data);
        } catch (error) { setMessage('Error saving experience'); }
    };

    const handleEditExperience = (exp) => {
        setEditingExp(exp);
        setExpForm({
            company: exp.company,
            role: exp.role,
            startDate: exp.startDate,
            endDate: exp.endDate || '',
            description: exp.description || '',
            certificationUrl: exp.certificationUrl || '',
            current: exp.current
        });
        window.scrollTo(0, 0);
    };

    const handleDeleteExperience = async (id) => {
        if (!window.confirm('Delete this experience?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/experience/${id}`, config);
            setMessage('Experience removed');
            const { data } = await axios.get('/api/experience', config);
            setExperience(data);
        } catch (error) { setMessage('Error deleting experience'); }
    };

    // --- EDUCATION HANDLERS ---
    const handleAddEducation = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/education', eduForm, config);
            setMessage('Education added!');
            setEduForm({ institution: '', degree: '', startDate: '', endDate: '', description: '', current: false });
            const { data } = await axios.get('/api/education', config);
            setEducation(data);
        } catch (error) { setMessage('Error adding education'); }
    };

    const handleDeleteEducation = async (id) => {
        if (!window.confirm('Delete this education?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/education/${id}`, config);
            setMessage('Education removed');
            const { data } = await axios.get('/api/education', config);
            setEducation(data);
        } catch (error) { setMessage('Error deleting education'); }
    };


    if (loading || isLoading) return <div className="container" style={{ padding: '4rem' }}>Loading Dashboard...</div>;
    if (!user || user.role !== 'ADMIN') return null;

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h2>Admin Dashboard</h2>
                    <p>Welcome, {user.email}</p>
                </div>
                <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Logout</button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['projects', 'blogs', 'experience', 'education', 'messages', 'profile'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {message && <div style={{ padding: '10px', background: message.includes('Error') ? '#fee2e2' : '#d1fae5', color: message.includes('Error') ? '#dc2626' : '#065f46', marginBottom: '1rem', borderRadius: '4px' }}>{message}</div>}

            {activeTab === 'projects' && (
                <div>
                    <div className="card" style={{ maxWidth: '800px', marginBottom: '2rem' }}>
                        <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                        <form onSubmit={handleProjectSubmit}>
                            <div className="form-group"><label>Title</label><input name="title" value={projectData.title} onChange={handleProjectChange} required /></div>
                            <div className="form-group"><label>Description</label><textarea name="description" value={projectData.description} onChange={handleProjectChange} required rows="3"></textarea></div>
                            <div className="form-group">
                                <label>Category</label>
                                <select name="category" value={projectData.category} onChange={handleProjectChange} style={{ width: '100%', padding: '10px' }}>
                                    <option value="AI/ML">AI/ML</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="Research">Research</option>
                                    <option value="Data Science">Data Science</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Tech Stack</label><input name="techStack" value={projectData.techStack} onChange={handleProjectChange} placeholder="e.g. Python, PyTorch" /></div>
                            <div className="form-group"><label>Image URL</label><input name="imageUrl" value={projectData.imageUrl} onChange={handleProjectChange} placeholder="https://..." /></div>
                            <div className="form-group"><label>GitHub Link</label><input name="githubLink" value={projectData.githubLink} onChange={handleProjectChange} /></div>
                            <div className="form-group"><label>Live Link</label><input name="liveLink" value={projectData.liveLink} onChange={handleProjectChange} /></div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary">{editingProject ? 'Update' : 'Add'}</button>
                                {editingProject && <button type="button" onClick={resetProjectForm} className="btn btn-outline">Cancel</button>}
                            </div>
                        </form>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem', maxWidth: '800px' }}>
                        {projects.map(p => (
                            <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div><strong>{p.title}</strong> <span style={{ color: '#666', fontSize: '0.9rem' }}>{p.category}</span></div>
                                <div>
                                    <button onClick={() => handleEditClick(p)} className="btn btn-outline" style={{ marginRight: '0.5rem', padding: '0.3rem 0.8rem' }}>Edit</button>
                                    <button onClick={() => handleDeleteProject(p.id)} className="btn" style={{ background: '#fee2e2', color: '#dc2626', padding: '0.3rem 0.8rem' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'experience' && (
                <div className="card" style={{ maxWidth: '800px' }}>
                    <h3>{editingExp ? 'Edit Experience' : 'Add Experience'}</h3>
                    <form onSubmit={handleAddExperience} style={{ marginBottom: '2rem' }}>
                        <div className="form-group"><label>Company</label><input value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })} required /></div>
                        <div className="form-group"><label>Role</label><input value={expForm.role} onChange={e => setExpForm({ ...expForm, role: e.target.value })} required /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group"><label>Start Date (YYYY-MM)</label><input value={expForm.startDate} onChange={e => setExpForm({ ...expForm, startDate: e.target.value })} required placeholder="2023-01" /></div>
                            <div className="form-group"><label>End Date (or blank if current)</label><input value={expForm.endDate || ''} onChange={e => setExpForm({ ...expForm, endDate: e.target.value })} placeholder="2024-01" /></div>
                        </div>
                        <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="checkbox" checked={expForm.current} onChange={e => setExpForm({ ...expForm, current: e.target.checked })} style={{ width: 'auto' }} />
                            <label style={{ margin: 0 }}>I currently work here</label>
                        </div>
                        <div className="form-group"><label>Description</label><textarea value={expForm.description || ''} onChange={e => setExpForm({ ...expForm, description: e.target.value })} rows="3" /></div>
                        <div className="form-group"><label>Certificate URL (image or PDF link)</label><input value={expForm.certificationUrl || ''} onChange={e => setExpForm({ ...expForm, certificationUrl: e.target.value })} placeholder="https://..." /></div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">{editingExp ? 'Update Experience' : 'Add Experience'}</button>
                            {editingExp && <button type="button" className="btn btn-outline" onClick={() => { setEditingExp(null); setExpForm({ company: '', role: '', startDate: '', endDate: '', description: '', certificationUrl: '', current: false }); }}>Cancel</button>}
                        </div>
                    </form>
                    <h4>History</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {experience.map(exp => (
                            <li key={exp.id} style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{exp.role}</strong> at {exp.company} <br />
                                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                    {exp.certificationUrl && <span style={{ display: 'block', fontSize: '0.8rem', color: '#f59e0b', marginTop: '2px' }}>🏅 Certificate linked</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEditExperience(exp)} className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>Edit</button>
                                    <button onClick={() => handleDeleteExperience(exp.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'education' && (
                <div className="card" style={{ maxWidth: '800px' }}>
                    <h3>Add Education</h3>
                    <form onSubmit={handleAddEducation} style={{ marginBottom: '2rem' }}>
                        <div className="form-group"><label>Institution</label><input value={eduForm.institution} onChange={e => setEduForm({ ...eduForm, institution: e.target.value })} required /></div>
                        <div className="form-group"><label>Degree</label><input value={eduForm.degree} onChange={e => setEduForm({ ...eduForm, degree: e.target.value })} required /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group"><label>Start Date (YYYY-MM)</label><input value={eduForm.startDate} onChange={e => setEduForm({ ...eduForm, startDate: e.target.value })} required placeholder="2019-09" /></div>
                            <div className="form-group"><label>End Date (or blank if current)</label><input value={eduForm.endDate || ''} onChange={e => setEduForm({ ...eduForm, endDate: e.target.value })} placeholder="2023-05" /></div>
                        </div>
                        <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="checkbox" checked={eduForm.current} onChange={e => setEduForm({ ...eduForm, current: e.target.checked })} style={{ width: 'auto' }} />
                            <label style={{ margin: 0 }}>I currently study here</label>
                        </div>
                        <div className="form-group"><label>Description</label><textarea value={eduForm.description || ''} onChange={e => setEduForm({ ...eduForm, description: e.target.value })} rows="3" /></div>
                        <button type="submit" className="btn btn-primary">Add Education</button>
                    </form>
                    <h4>History</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {education.map(edu => (
                            <li key={edu.id} style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <strong>{edu.degree}</strong> at {edu.institution} <br />
                                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                                </div>
                                <button onClick={() => handleDeleteEducation(edu.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'blogs' && (
                <div className="card" style={{ maxWidth: '800px' }}>
                    <h3>Add Blog Post</h3>
                    <form onSubmit={handleBlogSubmit}>
                        <div className="form-group"><label>Title</label><input name="title" value={blogData.title} onChange={handleBlogChange} required /></div>
                        <div className="form-group"><label>Content (Markdown)</label><textarea name="content" value={blogData.content} onChange={handleBlogChange} required rows="8" /></div>
                        <div className="form-group"><label>Tags</label><input name="tags" value={blogData.tags} onChange={handleBlogChange} placeholder="AI, Tech" /></div>
                        <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="checkbox" name="published" checked={blogData.published} onChange={handleBlogChange} style={{ width: 'auto' }} />
                            <label style={{ margin: 0 }}>Published</label>
                        </div>
                        <button type="submit" className="btn btn-primary">Publish</button>
                    </form>
                    <h4>Existing Blogs</h4>
                    <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
                        {blogs.map(b => <li key={b.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>{b.title} ({b.published ? 'Published' : 'Draft'})</li>)}
                    </ul>
                </div>
            )}

            {activeTab === 'messages' && (
                <div style={{ maxWidth: '800px' }}>
                    <h3>Messages</h3>
                    {messages.length === 0 ? <p>No messages.</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.map(msg => (
                                <div key={msg.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <strong>{msg.name}</strong>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ color: 'var(--primary-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{msg.email}</div>
                                    <p>{msg.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="card" style={{ maxWidth: '800px' }}>
                    <h3>Edit Profile</h3>
                    <form onSubmit={handleProfileSubmit}>
                        <div className="form-group"><label>Bio</label><textarea name="bio" value={profileData.bio || ''} onChange={handleProfileChange} rows="5" /></div>
                        <div className="form-group"><label>GitHub URL</label><input name="githubUrl" value={profileData.githubUrl || ''} onChange={handleProfileChange} /></div>
                        <div className="form-group"><label>LinkedIn URL</label><input name="linkedinUrl" value={profileData.linkedinUrl || ''} onChange={handleProfileChange} /></div>
                        <div className="form-group"><label>Resume URL</label><input name="resumeUrl" value={profileData.resumeUrl || ''} onChange={handleProfileChange} /></div>
                        <div className="form-group"><label>Public Email</label><input name="publicEmail" value={profileData.publicEmail || ''} onChange={handleProfileChange} /></div>
                        <div className="form-group"><label>Location</label><input name="location" value={profileData.location || ''} onChange={handleProfileChange} /></div>
                        <div className="form-group"><label>Medium URL</label><input name="mediumUrl" value={profileData.mediumUrl || ''} onChange={handleProfileChange} /></div>
                        <button type="submit" className="btn btn-primary">Update Profile</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
