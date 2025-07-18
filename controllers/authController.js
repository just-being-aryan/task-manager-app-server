import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { ApiError } from '../utils/apiError.js';


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};


export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new ApiError(409, 'Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
    name,
    email,
    hashedPassword,
  ]);

  const [newUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

  const token = generateToken(newUser[0].id);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
  });
});


export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = users[0];

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user.id);
  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
  });
});
