import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import userControllers from './controllers/user.controllers'; 
import taskControllers from './controllers/task.controllers'; 
import { authenticate } from './middleware/auth.middleware';
import { initCronJobs } from './utils/cron.utils'; 
import fs from 'fs';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
// User routes
app.post('/users', userControllers.registerUser);

// Task routes (with JWT auth for the bonus requirement)
app.post('/tasks', authenticate, taskControllers.createTask);
app.get('/tasks', authenticate, taskControllers.getTasksByUser);
app.patch('/tasks/:id/status', authenticate, taskControllers.updateTaskStatus);
app.delete('/tasks/:id', authenticate, taskControllers.deleteTask);

// Initialize cron jobs
initCronJobs();

export default app;
