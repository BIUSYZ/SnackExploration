import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import snackRoutes from './routes/snacks';
import uploadRoutes from './routes/upload';
import ocrRoutes from './routes/ocr';
import configRoutes from './routes/config';
import authRoutes from './routes/auth';
import { requireAuth } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 9091;

app.use(cors());
app.use(express.json());

// Serve uploaded images as static files (Public)
app.use('/uploads', express.static(path.join(__dirname, '../data/uploads')));

// Public routes
app.use('/api/v1/auth', authRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Protected routes
app.use('/api/v1/snacks', requireAuth, snackRoutes);
app.use('/api/v1/upload', requireAuth, uploadRoutes);
app.use('/api/v1/ocr', requireAuth, ocrRoutes);
app.use('/api/v1/config', requireAuth, configRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
