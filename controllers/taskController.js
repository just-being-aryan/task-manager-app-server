import asyncHandler from 'express-async-handler';
import pool from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

//    Get all tasks for logged-in user

export const getAllTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [tasks] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);

  res.status(200).json({
    success: true,
    tasks,
  });
});

//   Create a new task

export const createTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { title, description, due_date, priority } = req.body;

  if (!title || !due_date || !priority) {
    throw new ApiError(400, 'Title, due date, and priority are required');
  }

  await pool.query(
    'INSERT INTO tasks (user_id, title, description, due_date, priority, is_complete) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, title, description || '', due_date, priority, false]
  );

  res.status(201).json({ success: true, message: 'Task created successfully' });
});

//Update a task

export const updateTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, description, due_date, priority, is_complete } = req.body;

  console.log('UpdateTask received:', {
    userId,
    taskId: id,
    body: req.body
  });

  // Validate required fields
  if (!title || !due_date || !priority) {
    console.log('Validation failed:', { title, due_date, priority });
    throw new ApiError(400, 'Title, due date, and priority are required');
  }

  // Handle boolean conversion for MySQL
  const isCompleteValue = is_complete === true || is_complete === 1 || is_complete === '1' ? 1 : 0;

  console.log('About to execute query with values:', {
    title,
    description: description || '',
    due_date,
    priority,
    isCompleteValue,
    id,
    userId
  });

  const [result] = await pool.query(
    'UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, is_complete = ? WHERE id = ? AND user_id = ?',
    [title, description || '', due_date, priority, isCompleteValue, id, userId]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, 'Task not found or unauthorized');
  }

  res.status(200).json({ success: true, message: 'Task updated successfully' });
});

// delete a task

export const deleteTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const [result] = await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

  if (result.affectedRows === 0) {
    throw new ApiError(404, 'Task not found or unauthorized');
  }

  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});


//filter task by **priority** and **completion status**
//sort by due datr


export const filterTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { priority, completed } = req.query;

  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const values = [userId];

  if (priority) {
    query += ' AND priority = ?';
    values.push(priority);
  }

  if (completed !== undefined) {
    query += ' AND is_complete = ?';
    values.push(completed === 'true');
  }

  query += ' ORDER BY due_date ASC';

  const [tasks] = await pool.query(query, values);

  res.status(200).json({ success: true, tasks });
});
