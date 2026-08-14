import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Store Rating System API is running' });
});

app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
