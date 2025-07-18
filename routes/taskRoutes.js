import express from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  filterTasks,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.use(protect);

router.get('/', getAllTasks);

router.get('/filter', filterTasks);

router.post('/', createTask);

router.put('/:id', updateTask);

router.delete('/:id', deleteTask);

export default router;
