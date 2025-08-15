// src/index.ts

import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import { secrets } from './config/secrets';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes'; // New import

const app: Application = express();
const PORT: number = 5000;

// Connect to MongoDB
mongoose.connect(secrets.mongoUri)
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); // New route

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running and operational! 🎉');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});