'use client';

import React, { useState } from 'react';
import { taskApi } from '@/services/api';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
}

interface TaskCardProps {
  task: Task;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [completed, setCompleted] = useState(task.completed);
  const [loading, setLoading] = useState(false);

  const userId = task.user_id;

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const updatedTask = await taskApi.updateTask(userId, task.id, {
        ...task,
        completed: !completed
      });
      setCompleted(!completed);
      if (onUpdate) onUpdate(updatedTask.data);
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedTask = await taskApi.updateTask(userId, task.id, {
        title,
        description,
        completed
      });
      if (onUpdate) onUpdate(updatedTask.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await taskApi.deleteTask(userId, task.id);
        if (onDelete) onDelete(task.id);
      } catch (err) {
        console.error('Error deleting task:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <li className={`py-5 ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-start">
        <input
          id={`task-${task.id}`}
          name={`task-${task.id}`}
          type="checkbox"
          checked={completed}
          onChange={handleToggleComplete}
          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-white/50 rounded mt-1 bg-white/20 backdrop-blur-sm"
        />
        <div className="ml-4 min-w-0 flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border-2 border-indigo-500/50 bg-white/20 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:shadow-xl shadow-lg"
                autoFocus
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="block w-full px-4 py-3 rounded-xl border-2 border-indigo-500/50 bg-white/20 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:shadow-xl shadow-lg"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2.5 border border-white/30 text-sm font-medium rounded-xl text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p
                className={`${completed ? 'text-white/60 line-through' : 'text-white'} text-base font-medium`}
              >
                {title}
              </p>
              {task.description && (
                <p className="text-white/70 text-sm mt-2">{task.description}</p>
              )}
            </>
          )}
        </div>
        <div className="ml-6 flex-shrink-0 flex space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-indigo-200 bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-red-200 bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskCard;