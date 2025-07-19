import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import './config/db.js';
import rateLimit from 'express-rate-limit';

import { ApiError } from './utils/apiError.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
const app = express();

const corsOptions = {
  origin: [
    process.env.CLIENT_URL, // Production frontend URL from env
    'http://localhost:5173', // Local development
  ].filter(Boolean), // Remove any undefined values
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.set('trust proxy', 1); 

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager API is running! 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager API v1.0 is running! 🚀',
    endpoints: {
      auth: '/api/auth (POST /login, POST /register)',
      tasks: '/api/tasks (GET, POST, PUT, DELETE)'
    },
    timestamp: new Date().toISOString()
  });
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, 
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

app.use('/api/auth', authLimiter); 


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

app.use(errorMiddleware)

export default app;
