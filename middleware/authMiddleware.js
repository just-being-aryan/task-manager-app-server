import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/apiError.js';
import pool from '../config/db.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [decoded.id]);

      if (!rows.length) {
        throw new ApiError(401, 'User not found');
      }

      req.user = rows[0]; 
      next();
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  } else {
    throw new ApiError(401, 'No token provided');
  }
});
