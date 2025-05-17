import { Request, Response } from 'express';
import taskService from '../services/task.service';
import { TaskStatus } from '../models/task.model';
import Joi from 'joi';

class TaskController {
  // Create a new task
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        user: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const task = await taskService.createTask(req.body);
      res.status(201).json({
        message: 'Task created successfully',
        task,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all tasks for a user
  async getTasksByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }

      const tasks = await taskService.getTasksByUser(userId);
      res.status(200).json({ tasks });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update task status
  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.id;
      
      // Validate request body
      const schema = Joi.object({
        status: Joi.string().valid(...Object.values(TaskStatus)).required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const status = req.body.status as TaskStatus;
      const task = await taskService.updateTaskStatus(taskId, status);
      
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.status(200).json({
        message: 'Task status updated successfully',
        task,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a task
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.id;
      const deleted = await taskService.deleteTask(taskId);
      
      if (!deleted) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new TaskController();