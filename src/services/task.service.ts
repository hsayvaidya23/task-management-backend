import Task, { ITask, TaskStatus } from '../models/task.model';
import User from '../models/user.model';
import mongoose from 'mongoose';

export class TaskService {
  // Create a new task
  async createTask(taskData: {
    title: string;
    description: string;
    user: string;
  }): Promise<ITask> {
    // Check if user exists
    const user = await User.findById(taskData.user);
    if (!user) {
      throw new Error('User not found');
    }

    try {
      const task = new Task({
        ...taskData,
        status: TaskStatus.PENDING,
      });
      await task.save();
      return task;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Task with this title already exists for this user');
      }
      throw error;
    }
  }

  // Get all tasks for a user
  async getTasksByUser(userId: string): Promise<ITask[]> {
    return Task.find({ user: userId });
  }

  // Update task status
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<ITask | null> {
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Additional logic based on the status
    if (status === TaskStatus.IN_PROGRESS && task.status !== TaskStatus.IN_PROGRESS) {
      task.startedAt = new Date();
    } else if (status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
      task.completedAt = new Date();
    }

    task.status = status;
    await task.save();
    return task;
  }

  // Delete a task
  async deleteTask(taskId: string): Promise<boolean> {
    const result = await Task.deleteOne({ _id: taskId });
    return result.deletedCount === 1;
  }

  // Auto-close tasks that are in progress for more than 2 hours
  async autoCloseTasks(): Promise<void> {
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    await Task.updateMany(
      {
        status: TaskStatus.IN_PROGRESS,
        startedAt: { $lt: twoHoursAgo },
      },
      {
        $set: {
          status: TaskStatus.DONE,
          completedAt: new Date(),
        },
      }
    );
  }
}

export default new TaskService();