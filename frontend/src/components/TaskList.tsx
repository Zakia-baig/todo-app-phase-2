'use client';

import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import { taskApi } from '@/services/api';
import { getUserIdFromToken } from '@/lib/auth';

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

interface TaskListProps {
  filter?: 'all' | 'completed' | 'incomplete';
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskCreate?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ filter = 'all', onTaskUpdate, onTaskDelete, onTaskCreate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskApi.getTasks(userId);

        // Apply filter locally
        let filteredTasks = response.data;
        if (filter === 'completed') {
          filteredTasks = response.data.filter((task: Task) => task.completed);
        } else if (filter === 'incomplete') {
          filteredTasks = response.data.filter((task: Task) => !task.completed);
        }

        setTasks(filteredTasks);
      } catch (err) {
        setError('Failed to load tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="divide-y divide-white/10">
        {tasks.length === 0 ? (
          <li className="py-8">
            <p className="text-white/70 text-center text-lg">No tasks found</p>
          </li>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;