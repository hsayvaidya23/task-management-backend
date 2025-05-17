# Task Management System Backend

A robust backend system for managing tasks, built with Express.js and TypeScript, featuring user authentication, task management, and automated task closure.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with Supertest
- **Task Scheduling**: node-cron

## Features

- User registration
- Task management (create, read, update, delete)
- Task status tracking (pending, in-progress, done)
- Automatic task closure after 2 hours in "in-progress" state
- JWT-based authentication
- API documentation with Swagger
- Duplicate task prevention
- Comprehensive error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB instance
- npm or yarn package manager

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hsayvaidya23/task-management-backend.git
cd task-management-backend
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### User Management
- `POST /users` - Register a new user
  - Required fields: name, email, password

### Task Management
- `POST /tasks` - Create a new task
  - Required fields: title, description, user
- `GET /tasks?userId=` - Get all tasks for a user
- `PATCH /tasks/:id/status` - Update task status
  - Status options: pending, in-progress, done
- `DELETE /tasks/:id` - Delete a task

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Documentation

Access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## Testing

Run the test suite:
```bash
npm test
```

## Key Features Implementation

### 1. Duplicate Task Prevention
- Implemented using a compound index on title and user fields
- Ensures unique task titles per user

### 2. Auto-close Tasks
- Uses node-cron to run every 5 minutes
- Automatically marks tasks as "done" if they've been "in-progress" for over 2 hours

### 3. Task Timestamps
- Records startedAt when task moves to "in-progress"
- Records completedAt when task is marked as "done"

## Error Handling

The API implements comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- Duplicate task errors
- Not found errors

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Authentication middleware
├── models/         # Database models
├── services/       # Business logic
└── utils/          # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC
