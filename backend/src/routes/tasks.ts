import { Router, Request, Response } from 'express';
import pool from '../config/db';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// All routes below require authentication
router.use(verifyToken);

// Get tasks for the logged-in user
router.get('/', async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;
  try {
    // Use lowercase userid
    const tasks = await pool.query('SELECT * FROM tasks WHERE userid = $1', [userId]);
    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/', async (req: Request, res: Response) => {
  const { title, description } = req.body;
  // @ts-ignore
  const userId = req.user.id;
  try {
    // Use lowercase userid
    const newTask = await pool.query(
      'INSERT INTO tasks (title, description, userid) VALUES ($1, $2, $3) RETURNING *',
      [title, description, userId]
    );
    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task
router.put('/:id', async (req: Request, res: Response) => {
  const { title, description, isComplete } = req.body;
  const taskId = req.params.id;
  // @ts-ignore
  const userId = req.user.id;
  try {
    // Ensure task belongs to the user (use lowercase userid)
    const taskCheck = await pool.query('SELECT * FROM tasks WHERE id = $1 AND userid = $2', [taskId, userId]);
    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const updatedTask = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, "isComplete" = $3 WHERE id = $4 RETURNING *',
      [title, description, isComplete, taskId]
    );
    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error('Task update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', async (req: Request, res: Response) => {
  const taskId = req.params.id;
  // @ts-ignore
  const userId = req.user.id;
  try {
    // Ensure task belongs to the user (use lowercase userid)
    const taskCheck = await pool.query('SELECT * FROM tasks WHERE id = $1 AND userid = $2', [taskId, userId]);
    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Task deletion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
