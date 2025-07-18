import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import './config/db.js';
import rateLimit from 'express-rate-limit';

import { ApiError } from './utils/apiError.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
const app = express();

// const corsOptions = {
//   origin: process.env.CLIENT_URL,
//   credentials: true,
// };


app.use(cors());

app.use(express.json());

app.set('trust proxy', 1); 



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
