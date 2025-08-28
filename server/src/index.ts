import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { secrets } from './config/secrets';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import resumeRoutes from './routes/resumeRoutes';
import jobFitRoutes from './routes/jobFitRoutes'; // New import

const app: Application = express();
const PORT: number = 5000;

// Connect to MongoDB
mongoose.connect(secrets.mongoUri)
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cors());

// Create the 'uploads' directory if it doesn't exist
import fs from 'fs';
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobfit', jobFitRoutes); // New route

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running and operational! 🎉');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});