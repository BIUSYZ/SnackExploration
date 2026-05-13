import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import snackRoutes from './routes/snacks';
import uploadRoutes from './routes/upload';
import ocrRoutes from './routes/ocr';
import configRoutes from './routes/config';

dotenv.config();

const app = express();
const port = process.env.PORT || 9091;

app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '../data/uploads')));

app.use('/api/v1/snacks', snackRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/ocr', ocrRoutes);
app.use('/api/v1/config', configRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
