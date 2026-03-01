import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './src/routes/authRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import blogRoutes from './src/routes/blogRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import experienceRoutes from './src/routes/experienceRoutes.js';
import educationRoutes from './src/routes/educationRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production' || true) { // Force for Vercel
    const clientPath = path.join(__dirname, '../client/dist');
    app.use(express.static(clientPath));

    app.get('*', (req, res, next) => {
        // Only serve index.html for non-API routes
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.resolve(clientPath, 'index.html'));
    });
}

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
