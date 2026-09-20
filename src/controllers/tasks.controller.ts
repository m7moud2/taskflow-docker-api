import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/client';
import { redisClient } from '../redis/client';

const CACHE_KEY = 'tasks:all';
const CACHE_TTL = 60; // 60 seconds

export async function getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (redisClient.isOpen) {
      const cached = await redisClient.get(CACHE_KEY);
      if (cached) {
        res.json({
          status: 'success',
          source: 'cache',
          data: JSON.parse(cached)
        });
        return;
      }
    }

    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');

    if (redisClient.isOpen) {
      await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(rows));
    }

    res.json({
      status: 'success',
      source: 'database',
      data: rows
    });
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (rows.length === 0) {
      res.status(404).json({ status: 'error', message: 'Task not found' });
      return;
    }

    res.json({ status: 'success', data: rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { title, description, status, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ status: 'error', message: 'Title is required' });
    return;
  }

  try {
    const query = `
      INSERT INTO tasks (title, description, status, priority)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      title.trim(),
      description || '',
      status || 'pending',
      priority || 'medium'
    ];

    const { rows } = await pool.query(query, values);

    if (redisClient.isOpen) {
      await redisClient.del(CACHE_KEY);
    }

    res.status(201).json({ status: 'success', data: rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ status: 'error', message: 'Task not found' });
      return;
    }

    const current = existing.rows[0];
    const query = `
      UPDATE tasks
      SET title = $1, description = $2, status = $3, priority = $4
      WHERE id = $5
      RETURNING *
    `;
    const values = [
      title !== undefined ? title : current.title,
      description !== undefined ? description : current.description,
      status !== undefined ? status : current.status,
      priority !== undefined ? priority : current.priority,
      id
    ];

    const { rows } = await pool.query(query, values);

    if (redisClient.isOpen) {
      await redisClient.del(CACHE_KEY);
    }

    res.json({ status: 'success', data: rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.status(404).json({ status: 'error', message: 'Task not found' });
      return;
    }

    if (redisClient.isOpen) {
      await redisClient.del(CACHE_KEY);
    }

    res.json({ status: 'success', message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
}
