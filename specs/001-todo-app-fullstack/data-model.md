# Data Model: Todo App Fullstack

## Overview
Data model definitions for the full-stack Todo Web Application with authentication and CRUD operations.

## Entity: User
Represents a registered user in the system.

### Fields:
- `id`: UUID/string - Unique identifier for the user (primary key)
- `email`: String - User's email address (unique, required)
- `username`: String - User's display name (optional)
- `password_hash`: String - Hashed password for authentication
- `created_at`: DateTime - Timestamp when the account was created
- `updated_at`: DateTime - Timestamp when the account was last updated
- `is_active`: Boolean - Whether the account is active (default: true)

### Relationships:
- One-to-many: User has many Tasks
- Foreign key: tasks.user_id references users.id

## Entity: Task
Represents a user's task with status and metadata.

### Fields:
- `id`: UUID/string - Unique identifier for the task (primary key)
- `user_id`: UUID/string - Reference to the owning user (foreign key)
- `title`: String - Task title (required, max 255 chars)
- `description`: Text - Detailed task description (optional)
- `completed`: Boolean - Task completion status (default: false)
- `created_at`: DateTime - Timestamp when the task was created
- `updated_at`: DateTime - Timestamp when the task was last updated
- `due_date`: DateTime - Optional deadline for the task (nullable)

### Relationships:
- Many-to-one: Task belongs to User (via user_id foreign key)
- User: tasks relationship to access all user's tasks

### Validation Rules:
- Title must be 1-255 characters
- User_id must reference an existing user
- Only the task owner can modify/delete the task
- Description limited to 1000 characters if provided

### State Transitions:
- New task: `completed` = false (default)
- Complete task: `completed` = true
- Uncomplete task: `completed` = false

## Database Schema

### Tables:
```sql
-- Users table (managed by Better Auth)
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tasks table
CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    due_date TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
```

## API Data Contracts

### Request/Response Objects:

#### Task Creation Request:
```json
{
  "title": "String, required",
  "description": "String, optional",
  "due_date": "DateTime string, optional"
}
```

#### Task Response Object:
```json
{
  "id": "String, unique identifier",
  "user_id": "String, owner reference",
  "title": "String",
  "description": "String or null",
  "completed": "Boolean",
  "created_at": "ISO datetime string",
  "updated_at": "ISO datetime string",
  "due_date": "ISO datetime string or null"
}
```

#### Task Update Request:
```json
{
  "title": "String, optional",
  "description": "String, optional",
  "completed": "Boolean, optional",
  "due_date": "DateTime string, optional"
}
```