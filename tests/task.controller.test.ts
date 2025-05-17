import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import Task from '../src/models/task.model';
import User, { IUser } from '../src/models/user.model';
import jwt from 'jsonwebtoken';

// Define a type for our mock user that matches enough of IUser for our tests
interface MockUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

// Mock user data
const mockUser: MockUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

// Mock task data
const mockTask = {
  title: 'Test Task',
  description: 'Test Description',
  user: mockUser._id.toString(),
};

// Generate a mock JWT token
const generateMockToken = (user: MockUser): string => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '1h' }
  );
};

// Mock JWT verification
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockImplementation((payload, secret, options) => 'mock_token'),
  verify: jest.fn().mockImplementation(() => ({
    userId: mockUser._id,
    email: mockUser.email,
  })),
}));

// Mock Task and User models
jest.mock('../src/models/task.model', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    deleteOne: jest.fn(),
    updateMany: jest.fn(),
  },
  TaskStatus: {
    PENDING: 'pending',
    IN_PROGRESS: 'in-progress',
    DONE: 'done',
  },
}));

jest.mock('../src/models/user.model', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

describe('Task Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Cleanup any running cron jobs
    const cron = require('node-cron');
    cron.getTasks().forEach((task: any) => task.stop());
    await new Promise(resolve => setTimeout(resolve, 100)); // Give tasks time to clean up
  });

  describe('GET /tasks', () => {
    it('should return all tasks for a user', async () => {
      // Mock implementation
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Task.find as jest.Mock).mockResolvedValue([
        {
          _id: 'task_id_1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'pending',
          user: mockUser._id,
        },
        {
          _id: 'task_id_2',
          title: 'Task 2',
          description: 'Description 2',
          status: 'in-progress',
          user: mockUser._id,
        },
      ]);

      // Make the request
      const response = await request(app)
        .get(`/tasks?userId=${mockUser._id}`)
        .set('Authorization', `Bearer ${generateMockToken(mockUser)}`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tasks');
      expect(response.body.tasks).toHaveLength(2);
      expect(Task.find).toHaveBeenCalledWith({ user: mockUser._id.toString() });
    });

    it('should return 400 if no userId is provided', async () => {
      // Make the request without userId
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${generateMockToken(mockUser)}`);

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User ID is required');
    });
  });
});