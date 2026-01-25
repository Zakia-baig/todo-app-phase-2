'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskApi } from '@/services/api';

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{type: string, message: string} | null>(null);
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();

  // Check for user authentication and initialize
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    if (!storedUserId || !token) {
      // No user ID or token found, redirect to login
      router.push('/login');
      return;
    }

    setUserId(storedUserId);
    fetchTasks(storedUserId);
  }, [router]);

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchTasks = async (currentUserId: string) => {
    try {
      setLoading(true);
      const response = await taskApi.getTasks(currentUserId);
      setTasks(response.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      showNotification('error', 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !userId) {
      showNotification('error', 'Missing task title or user ID');
      return;
    }

    try {
      console.log('Sending data:', { title: newTask, description: newDescription, user_id: userId }); // Added for debugging
      const response = await taskApi.createTask(userId, {
        title: newTask,
        description: newDescription,
        user_id: userId
      });
      console.log('Server responded:', response.data); // Added for debugging

      setNewTask('');
      setNewDescription('');

      // Optimistically update UI instead of fetching all tasks again
      setTasks(prevTasks => [...prevTasks, response.data]);
      showNotification('success', 'Task added successfully');
    } catch (err: any) {
      console.error("Error adding task:", err);

      // Provide more specific error messages
      if (err.response?.status === 401) {
        showNotification('error', 'Authentication error. Please log in again.');
        // Redirect to login after a delay
        setTimeout(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_id');
          router.push('/login');
        }, 2000);
      } else if (err.response?.status === 403) {
        showNotification('error', 'Access denied. You can only create tasks for yourself.');
      } else if (err.response?.status === 404) {
        showNotification('error', 'User not found. Please log in again.');
      } else if (err.response?.status === 405) {
        showNotification('error', 'Method not allowed. Please refresh the page and try again.');
      } else if (err.message === 'Network Error') {
        showNotification('error', 'Cannot connect to server. Is the backend running?');
      } else {
        showNotification('error', 'Failed to add task: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleToggleComplete = async (task: any) => {
    if (!userId) return;

    // Optimistically update the UI
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      await taskApi.updateTask(userId, task.id, {
        completed: !task.completed
      });
      showNotification('success', `Task marked as ${task.completed ? 'incomplete' : 'complete'}`);
    } catch (err) {
      console.error("Error updating task:", err);
      // Revert the optimistic update on error
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === task.id ? { ...t, completed: task.completed } : t
        )
      );
      showNotification('error', 'Failed to update task status');
    }
  };

  const startEditing = (task: any) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
    setEditingTaskDescription(task.description || '');
  };

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [editingTaskDescription, setEditingTaskDescription] = useState('');

  const saveEdit = async (taskId: string) => {
    if ((!editingTaskTitle.trim() && !editingTaskDescription.trim()) || !userId) {
      setEditingTaskId(null);
      return;
    }

    // Optimistically update the UI
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === taskId ? { ...t, title: editingTaskTitle, description: editingTaskDescription } : t
      )
    );

    try {
      await taskApi.updateTask(userId, taskId, {
        title: editingTaskTitle,
        description: editingTaskDescription
      });
      setEditingTaskId(null);
      setEditingTaskTitle('');
      setEditingTaskDescription('');
      showNotification('success', 'Task updated successfully');
    } catch (err) {
      console.error("Error updating task:", err);
      // Revert the optimistic update on error
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, title: t.title, description: t.description } : t
        )
      );
      showNotification('error', 'Failed to update task');
    }
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTaskTitle('');
    setEditingTaskDescription('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === 'Enter') {
      saveEdit(taskId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const mainStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)'
  };

  const containerStyle = {
    maxWidth: '56rem', // max-w-4xl
    margin: '0 auto', // mx-auto
    padding: '2rem 1rem' // px-4 py-8
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white/10
    backdropFilter: 'blur(24px)', // backdrop-blur-xl
    borderRadius: '1.5rem', // rounded-3xl
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
    border: '1px solid rgba(255, 255, 255, 0.2)', // border border-white/20
    overflow: 'hidden' as const
  };

  const headerStyle = {
    background: 'linear-gradient(to right, #7c3aed, #9333ea, #6366f1)', // bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600
    padding: '2rem 2rem', // px-8 py-8
    color: 'white',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const headerOverlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(124, 58, 237, 0.2), rgba(147, 51, 234, 0.2), rgba(99, 102, 241, 0.2))', // bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20
    backdropFilter: 'blur(12px)', // backdrop-blur-sm
    zIndex: 0
  };

  const headerContentStyle = {
    position: 'relative' as const,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const headerTitleStyle = {
    fontSize: '2.25rem', // text-4xl
    fontWeight: 'bold',
    marginBottom: '0.5rem', // mb-2
    background: 'linear-gradient(to right, white, rgba(179, 193, 255, 0.5))', // bg-gradient-to-r from-white to-blue-100
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent'
  };

  const headerSubtitleStyle = {
    color: 'rgba(255, 255, 255, 0.9)', // text-white/90
    fontSize: '1.125rem' // text-lg
  };

  const iconBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    backdropFilter: 'blur(12px)', // backdrop-blur-md
    borderRadius: '1rem', // rounded-2xl
    padding: '1rem', // p-4
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', // shadow-inner
    border: '1px solid rgba(255, 255, 255, 0.3)' // border border-white/30
  };

  const contentPaddingStyle = {
    padding: '2rem' // p-8
  };

  const formStyle = {
    marginBottom: '2rem' // mb-8
  };

  const inputGroupStyle = {
    position: 'relative' as const,
    marginBottom: '1.5rem' // space-y-6
  };

  const inputStyle = {
    width: '100%',
    padding: '1.5rem 1.5rem 1.5rem 4rem', // px-6 py-5 pl-16 pr-6
    border: 'none',
    borderRadius: '1rem', // rounded-2xl
    background: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    backdropFilter: 'blur(12px)', // backdrop-blur-md
    color: 'white',
    fontSize: '1.125rem', // text-lg
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    border: '1px solid rgba(255, 255, 255, 0.3)', // border border-white/30
    transition: 'all 0.3s ease', // transition-all duration-300
    boxSizing: 'border-box' as const
  };

  const textareaStyle = {
    width: '100%',
    padding: '1.5rem 1.5rem 1.5rem 4rem', // px-6 py-5 pl-16 pr-6
    border: 'none',
    borderRadius: '1rem', // rounded-2xl
    background: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    backdropFilter: 'blur(12px)', // backdrop-blur-md
    color: 'white',
    fontSize: '1rem', // text-base
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    border: '1px solid rgba(255, 255, 255, 0.3)', // border border-white/30
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const
  };

  const iconStyle = {
    position: 'absolute' as const,
    left: '1.5rem', // left-6
    top: '50%',
    transform: 'translateY(-50%)', // transform -translate-y-1/2
    color: 'rgba(255, 255, 255, 0.7)', // text-white/70
    transition: 'color 0.3s ease' // transition-colors duration-300
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #7c3aed, #9333ea)', // bg-gradient-to-r from-violet-600 to-purple-600
    color: 'white',
    fontWeight: '600', // font-semibold
    padding: '1rem 1.5rem', // py-4 px-6
    borderRadius: '1rem', // rounded-2xl
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease', // transition-all duration-300
    transform: 'scale(1)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem' // space-x-3
  };

  const statsGridStyle = {
    display: 'grid', // grid
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', // grid-cols-1
    gap: '1.5rem', // gap-6
    marginBottom: '2rem' // mb-8
  };

  const statCardStyle = {
    background: 'linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.2))', // bg-gradient-to-br from-violet-500/20 to-violet-600/20
    padding: '1.5rem', // p-6
    textAlign: 'center' as const,
    border: '1px solid rgba(139, 92, 246, 0.3)', // border border-violet-500/30
    backdropFilter: 'blur(12px)', // backdrop-blur-md
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
    transition: 'all 0.3s ease', // transition-all duration-300
    transform: 'translateY(0)' // transform hover:-translate-y-1
  };

  const taskListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem' // space-y-5
  };

  const taskItemStyle = {
    background: 'rgba(255, 255, 255, 0.1)', // bg-white/10
    backdropFilter: 'blur(24px)', // backdrop-blur-xl
    border: '2px solid rgba(255, 255, 255, 0.2)', // border border-white/20
    borderRadius: '1rem', // rounded-2xl
    padding: '1.75rem', // p-7
    transition: 'all 0.5s ease', // transition-all duration-500
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    cursor: 'pointer'
  };

  const taskItemCompletedStyle = {
    ...taskItemStyle,
    borderColor: 'rgba(16, 185, 129, 0.5)', // border-emerald-400/50
    backgroundColor: 'rgba(16, 185, 129, 0.1)' // bg-emerald-500/10
  };

  const checkboxStyle = {
    flexShrink: 0, // flex-shrink-0
    width: '2rem', // w-8
    height: '2rem', // h-8
    borderRadius: '9999px', // rounded-full
    border: '2px solid rgba(255, 255, 255, 0.5)', // border border-white/50
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease', // transition-all duration-300
    cursor: 'pointer'
  };

  const checkboxCheckedStyle = {
    ...checkboxStyle,
    background: 'linear-gradient(to right, #10b981, #22c55e)', // bg-gradient-to-r from-emerald-500 to-green-500
    borderColor: '#10b981', // border-emerald-500
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    transform: 'scale(1.1)' // scale-110
  };

  const taskContentStyle = {
    flex: 1, // flex-1
    minWidth: 0 // min-w-0
  };

  const taskTitleStyle = {
    fontWeight: 'bold',
    fontSize: '1.25rem', // text-xl
    lineHeight: 1.25, // leading-tight
    color: 'white'
  };

  const taskTitleCompletedStyle = {
    ...taskTitleStyle,
    color: 'rgba(255, 255, 255, 0.6)', // text-white/60
    textDecoration: 'line-through' // line-through
  };

  const taskDescriptionStyle = {
    fontSize: '1rem', // text-base
    lineHeight: 1.625, // leading-relaxed
    color: 'rgba(255, 255, 255, 0.8)' // text-white/80
  };

  const taskDescriptionCompletedStyle = {
    ...taskDescriptionStyle,
    color: 'rgba(255, 255, 255, 0.5)' // text-white/50
  };

  const taskFooterStyle = {
    paddingTop: '0.75rem', // pt-3
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5rem 1rem', // px-4 py-2
    borderRadius: '9999px', // rounded-full
    fontSize: '0.75rem', // text-xs
    fontWeight: '500', // font-medium
    background: 'rgba(255, 255, 255, 0.1)', // bg-white/10
    backdropFilter: 'blur(12px)', // backdrop-blur-sm
    color: 'rgba(255, 255, 255, 0.8)', // text-white/80
    border: '1px solid rgba(255, 255, 255, 0.2)' // border border-white/20
  };

  const badgeCompletedStyle = {
    ...badgeStyle,
    background: 'rgba(16, 185, 129, 0.2)', // bg-emerald-500/20
    color: '#a7f3d0', // text-emerald-200
    border: '1px solid rgba(16, 185, 129, 0.3)' // border border-emerald-500/30
  };

  const badgePendingStyle = {
    ...badgeStyle,
    background: 'rgba(139, 92, 246, 0.2)', // bg-violet-500/20
    color: '#ddd6fe', // text-violet-200
    border: '1px solid rgba(139, 92, 246, 0.3)' // border border-violet-500/30
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '0.75rem', // gap-3
    opacity: 0.6, // opacity-60
    transition: 'all 0.3s ease' // transition-all duration-300
  };

  const actionButtonStyle = {
    padding: '0.75rem', // p-3
    color: 'rgba(255, 255, 255, 0.7)', // text-white/70
    transition: 'all 0.3s ease', // transition-all duration-300
    borderRadius: '0.75rem', // rounded-xl
    backdropFilter: 'blur(12px)', // backdrop-blur-sm
    border: '1px solid rgba(255, 255, 255, 0.2)', // border border-white/20,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    cursor: 'pointer'
  };

  const footerStyle = {
    background: 'rgba(255, 255, 255, 0.1)', // bg-white/10
    backdropFilter: 'blur(12px)', // backdrop-blur-md
    padding: '1.5rem 2rem', // px-8 py-6
    borderTop: '1px solid rgba(255, 255, 255, 0.2)' // border-t border-white/20
  };

  const footerContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem' // gap-4
  };

  const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem', // gap-3
    padding: '0.75rem 1.5rem', // px-6 py-3
    color: '#fca5a5', // text-red-300
    transition: 'all 0.3s ease', // transition-all
    fontWeight: '600', // font-semibold
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '0.75rem', // rounded-xl
    backdropFilter: 'blur(12px)', // backdrop-blur-sm
    border: '1px solid rgba(255, 255, 255, 0.2)', // border border-white/20
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' // shadow-lg
  };

  const notificationStyle = {
    position: 'fixed' as const,
    top: '1rem', // top-4
    right: '1rem', // right-4
    zIndex: 50, // z-50
    padding: '1rem', // p-4
    borderRadius: '1rem', // rounded-2xl
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
    maxWidth: '24rem', // max-w-sm
    transform: 'translateY(0)', // transform
    transition: 'all 0.3s ease', // transition-all duration-300
    backdropFilter: 'blur(12px)', // backdrop-blur-md
    display: 'flex',
    alignItems: 'center'
  };

  const notificationErrorStyle = {
    ...notificationStyle,
    background: 'rgba(239, 68, 68, 0.2)', // bg-red-500/20
    border: '1px solid rgba(239, 68, 68, 0.3)', // border border-red-500/30
    color: '#fde047' // text-red-100
  };

  const notificationSuccessStyle = {
    ...notificationStyle,
    background: 'rgba(16, 185, 129, 0.2)', // bg-emerald-500/20
    border: '1px solid rgba(16, 185, 129, 0.3)', // border border-emerald-500/30
    color: '#a7f3d0' // text-emerald-100
  };

  const notificationIconBoxStyle = {
    marginRight: '0.75rem', // mr-3
    padding: '0.5rem', // p-2
    borderRadius: '9999px', // rounded-full
    backdropFilter: 'blur(12px)' // backdrop-blur-sm
  };

  const notificationErrorIconBoxStyle = {
    ...notificationIconBoxStyle,
    background: 'rgba(239, 68, 68, 0.3)' // bg-red-500/30
  };

  const notificationSuccessIconBoxStyle = {
    ...notificationIconBoxStyle,
    background: 'rgba(16, 185, 129, 0.3)' // bg-emerald-500/30
  };

  const notificationMessageStyle = {
    fontWeight: '500', // font-medium
    fontSize: '0.875rem' // text-sm
  };

  // Media query for larger screens
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    if (mediaQuery.matches) {
      Object.assign(statsGridStyle, {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' // md:grid-cols-3
      });

      Object.assign(actionButtonsStyle, {
        opacity: 1 // group-hover:opacity-100
      });

      Object.assign(footerContentStyle, {
        flexDirection: 'row' // sm:flex-row
      });
    }
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    </div>
  );

  return (
    <main style={mainStyle}>
      {/* Notification Toast */}
      {notification && (
        <div style={notification.type === 'error' ? notificationErrorStyle : notificationSuccessStyle}>
          <div style={notification.type === 'error' ? notificationErrorIconBoxStyle : notificationSuccessIconBoxStyle}>
            {notification.type === 'error' ? (
              <svg style={{width: '1.25rem', height: '1.25rem', color: '#fca5a5'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg style={{width: '1.25rem', height: '1.25rem', color: '#6ee7b7'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span style={notificationMessageStyle}>{notification.message}</span>
        </div>
      )}

      <div style={containerStyle}>
        <div style={cardStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={headerOverlayStyle}></div>
            <div style={headerContentStyle}>
              <div>
                <h1 style={headerTitleStyle}>
                  Todo-Mind Dashboard
                </h1>
                <p style={{...headerSubtitleStyle, fontSize: '1.5rem', fontWeight: 'bold'}}>
                  {userId && `Welcome back`} • {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>
              <div style={iconBoxStyle}>
                <svg style={{width: '2.5rem', height: '2.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div style={contentPaddingStyle}>
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} style={formStyle}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}> {/* space-y-6 */}
                <div style={inputGroupStyle}>
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 4px rgba(139, 92, 246, 0.3)'; // focus:ring-4 focus:ring-violet-500/30 focus:shadow-xl
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // focus:bg-white/90
                      e.target.style.color = '#1f2937'; // group-focus-within:text-gray-900
                      e.target.style.placeholder = 'gray'; // group-focus-within:placeholder:text-gray-400
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // shadow-lg
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // bg-white/20
                      e.target.style.color = 'white'; // text-white
                    }}
                  />
                  <div style={iconStyle}>
                    <svg style={{width: '1.5rem', height: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>

                <div style={inputGroupStyle}>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Add details (optional)..."
                    rows={3}
                    style={textareaStyle}
                    onFocus={(e) => {
                      e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 4px rgba(139, 92, 246, 0.3)'; // focus:ring-4 focus:ring-violet-500/30 focus:shadow-xl
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // focus:bg-white/90
                      e.target.style.color = '#1f2937'; // group-focus-within:text-gray-900
                      e.target.style.placeholder = 'gray'; // group-focus-within:placeholder:text-gray-400
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // shadow-lg
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // bg-white/20
                      e.target.style.color = 'white'; // text-white
                    }}
                  />
                  <div style={iconStyle}>
                    <svg style={{width: '1.5rem', height: '1.5rem', top: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newTask.trim()}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    if (!newTask.trim()) return;
                    (e.target as HTMLElement).style.background = 'linear-gradient(to right, #6d28d9, #7e22ce)'; // hover:from-violet-700 hover:to-purple-700
                    (e.target as HTMLElement).style.transform = 'scale(1.02)'; // hover:scale-[1.02]
                    (e.target as HTMLElement).style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'; // hover:shadow-2xl
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'linear-gradient(to right, #7c3aed, #9333ea)'; // from-violet-600 to-purple-600
                    (e.target as HTMLElement).style.transform = 'scale(1)';
                    (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; // shadow-xl
                  }}
                >
                  <svg style={{width: '1.5rem', height: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span style={{fontSize: '1.125rem', fontWeight: '600'}}>Add New Task</span>
                </button>
              </div>
            </form>

            {/* Stats Bar */}
            {tasks.length > 0 && (
              <div style={statsGridStyle}>
                <div style={statCardStyle}>
                  <div style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#ede9fe', marginBottom: '0.5rem'}}>{tasks.length}</div>
                  <div style={{textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '600', color: '#ddd6fe', letterSpacing: '0.025em'}}>Total Tasks</div>
                </div>
                <div style={statCardStyle}>
                  <div style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#a7f3d0', marginBottom: '0.5rem'}}>
                    {tasks.filter((t: any) => t.completed).length}
                  </div>
                  <div style={{textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '600', color: '#a7f3d0', letterSpacing: '0.025em'}}>Completed</div>
                </div>
                <div style={statCardStyle}>
                  <div style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#fde68a', marginBottom: '0.5rem'}}>
                    {tasks.filter((t: any) => !t.completed).length}
                  </div>
                  <div style={{textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '600', color: '#fde68a', letterSpacing: '0.025em'}}>Pending</div>
                </div>
              </div>
            )}

            {/* Task List */}
            <div style={taskListStyle}>
              {tasks.length === 0 ? (
                <div style={{textAlign: 'center', padding: '5rem 0'}}> {/* py-20 */}
                  <div style={{
                    margin: '0 auto 2rem', // mx-auto mb-8
                    width: '8rem', // w-32
                    height: '8rem', // h-32
                    background: 'linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.2))', // bg-gradient-to-br from-violet-500/20 to-purple-600/20
                    borderRadius: '1.5rem', // rounded-3xl
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
                    backdropFilter: 'blur(12px)', // backdrop-blur-md
                    border: '1px solid rgba(255, 255, 255, 0.3)' // border border-white/30
                  }}>
                    <svg style={{width: '4rem', height: '4rem', color: '#c4b5fd'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 style={{fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem'}}>No tasks yet</h3>
                  <p style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.125rem', maxWidth: '28rem', margin: '0 auto'}}>Add your first task to get started and boost your productivity!</p>
                </div>
              ) : (
                <div style={taskListStyle}>
                  {tasks.map((task: any) => (
                    <div
                      key={task.id}
                      style={task.completed ? taskItemCompletedStyle : taskItemStyle}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'; // hover:shadow-2xl
                        (e.currentTarget as HTMLElement).style.borderColor = task.completed ? 'rgba(16, 185, 129, 0.5)' : 'rgba(139, 92, 246, 0.5)'; // hover:border-violet-400/50
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; // hover:scale-[1.02]
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // shadow-lg
                        (e.currentTarget as HTMLElement).style.borderColor = task.completed ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.2)'; // border border-white/20
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                      }}
                    >
                      <div style={{display: 'flex', alignItems: 'flex-start', gap: '1.5rem'}}> {/* flex items-start gap-6 */}
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleComplete(task)}
                          style={task.completed ? checkboxCheckedStyle : checkboxStyle}
                          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {task.completed && (
                            <svg style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        {/* Task Content */}
                        <div style={taskContentStyle}>
                          {editingTaskId === task.id ? (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}> {/* space-y-5 */}
                              <input
                                type="text"
                                value={editingTaskTitle}
                                onChange={(e) => setEditingTaskTitle(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '1.25rem', // px-5 py-4
                                  border: '2px solid rgba(139, 92, 246, 0.5)', // border-2 border-violet-400/50
                                  borderRadius: '0.75rem', // rounded-xl
                                  background: 'rgba(255, 255, 255, 0.2)', // bg-white/20
                                  backdropFilter: 'blur(12px)', // backdrop-blur-md
                                  color: 'white',
                                  fontSize: '1.125rem', // text-lg
                                  fontWeight: '500', // font-medium
                                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
                                  boxSizing: 'border-box' as const
                                }}
                                autoFocus
                              />
                              <textarea
                                value={editingTaskDescription}
                                onChange={(e) => setEditingTaskDescription(e.target.value)}
                                rows={3}
                                style={{
                                  width: '100%',
                                  padding: '1.25rem', // px-5 py-4
                                  border: '2px solid rgba(139, 92, 246, 0.5)', // border-2 border-violet-400/50
                                  borderRadius: '0.75rem', // rounded-xl
                                  background: 'rgba(255, 255, 255, 0.2)', // bg-white/20
                                  backdropFilter: 'blur(12px)', // backdrop-blur-md
                                  color: 'white',
                                  fontSize: '1rem', // text-base
                                  resize: 'vertical' as const,
                                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
                                  boxSizing: 'border-box' as const
                                }}
                              />
                              <div style={{display: 'flex', gap: '1rem'}}> {/* flex gap-4 */}
                                <button
                                  onClick={() => saveEdit(task.id)}
                                  style={{
                                    padding: '0.75rem 1.75rem', // px-7 py-3
                                    background: 'linear-gradient(to right, #059669, #059669)', // bg-gradient-to-r from-emerald-600 to-green-600
                                    color: 'white',
                                    borderRadius: '0.75rem', // rounded-xl
                                    fontSize: '0.875rem', // text-sm
                                    fontWeight: '600', // font-semibold
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease', // transition-all
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
                                  }}
                                  onMouseEnter={(e) => {
                                    (e.target as HTMLElement).style.background = 'linear-gradient(to right, #047857, #047857)'; // hover:from-emerald-700 hover:to-green-700
                                    (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; // hover:shadow-xl
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.target as HTMLElement).style.background = 'linear-gradient(to right, #059669, #059669)'; // from-emerald-600 to-green-600
                                    (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // shadow-lg
                                  }}
                                >
                                  Save Changes
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  style={{
                                    padding: '0.75rem 1.75rem', // px-7 py-3
                                    background: 'linear-gradient(to right, #78716c, #57534e)', // bg-gradient-to-r from-gray-500 to-gray-600
                                    color: 'white',
                                    borderRadius: '0.75rem', // rounded-xl
                                    fontSize: '0.875rem', // text-sm
                                    fontWeight: '600', // font-semibold
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease', // transition-all
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
                                  }}
                                  onMouseEnter={(e) => {
                                    (e.target as HTMLElement).style.background = 'linear-gradient(to right, #57534e, #44403c)'; // hover:from-gray-600 hover:to-gray-700
                                    (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; // hover:shadow-xl
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.target as HTMLElement).style.background = 'linear-gradient(to right, #78716c, #57534e)'; // from-gray-500 to-gray-600
                                    (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // shadow-lg
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}> {/* space-y-4 */}
                              <h3 style={task.completed ? taskTitleCompletedStyle : taskTitleStyle}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p style={task.completed ? taskDescriptionCompletedStyle : taskDescriptionStyle}>
                                  {task.description}
                                </p>
                              )}
                              <div style={taskFooterStyle}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}> {/* flex items-center gap-4 */}
                                  <span style={badgeStyle}>
                                    <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(task.updated_at || task.created_at).toLocaleDateString()}
                                  </span>
                                  <span style={task.completed ? badgeCompletedStyle : badgePendingStyle}>
                                    {task.completed ? (
                                      <>
                                        <svg style={{width: '0.75rem', height: '0.75rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Completed
                                      </>
                                    ) : (
                                      <>
                                        <svg style={{width: '0.75rem', height: '0.75rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Pending
                                      </>
                                    )}
                                  </span>
                                </div>

                                {/* Action Buttons */}
                                <div style={actionButtonsStyle}>
                                  <button
                                    onClick={() => startEditing(task)}
                                    style={actionButtonStyle}
                                    onMouseEnter={(e) => {
                                      (e.target as HTMLElement).style.color = '#c4b5fd'; // hover:text-violet-300
                                      (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // hover:bg-white/20
                                      (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; // hover:shadow-xl
                                    }}
                                    onMouseLeave={(e) => {
                                      (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.7)'; // text-white/70
                                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                                      (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // shadow-lg
                                    }}
                                    aria-label="Edit task"
                                  >
                                    <svg style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={async () => {
                                      // Optimistically remove the task from UI
                                      setTasks(prevTasks => prevTasks.filter((t: any) => t.id !== task.id));

                                      try {
                                        await taskApi.deleteTask(userId, task.id);
                                        showNotification('success', 'Task deleted successfully');
                                      } catch (err) {
                                        console.error("Error deleting task:", err);
                                        // Revert the optimistic update on error
                                        setTasks(prevTasks => [...prevTasks, task]);
                                        showNotification('error', 'Failed to delete task');
                                      }
                                    }}
                                    style={actionButtonStyle}
                                    onMouseEnter={(e) => {
                                      (e.target as HTMLElement).style.color = '#fca5a5'; // hover:text-red-300
                                      (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // hover:bg-white/20
                                      (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; // hover:shadow-xl
                                    }}
                                    onMouseLeave={(e) => {
                                      (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.7)'; // text-white/70
                                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                                      (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // shadow-lg
                                    }}
                                    aria-label="Delete task"
                                  >
                                    <svg style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={footerStyle}>
            <div style={footerContentStyle}>
              <div style={{fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)'}}> {/* text-sm text-white/80 */}
                {tasks.length > 0 && (
                  <span style={{display: 'flex', alignItems: 'center', gap: '1rem'}}> {/* flex items-center gap-4 */}
                    <span style={{display: 'flex', alignItems: 'center'}}> {/* flex items-center */}
                      <span style={{width: '0.75rem', height: '0.75rem', backgroundColor: '#10b981', borderRadius: '9999px', marginRight: '0.5rem'}}></span> {/* w-3 h-3 bg-emerald-400 rounded-full mr-2 */}
                      {tasks.filter((t: any) => t.completed).length} completed
                    </span>
                    <span style={{color: 'rgba(255, 255, 255, 0.5)'}}>•</span> {/* text-white/50 */}
                    <span style={{display: 'flex', alignItems: 'center'}}> {/* flex items-center */}
                      <span style={{width: '0.75rem', height: '0.75rem', backgroundColor: '#8b5cf6', borderRadius: '9999px', marginRight: '0.5rem'}}></span> {/* w-3 h-3 bg-violet-400 rounded-full mr-2 */}
                      {tasks.filter((t: any) => !t.completed).length} pending
                    </span>
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                style={logoutButtonStyle}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = '#fecaca'; // hover:text-red-200
                  (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // hover:bg-white/20
                  (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; // hover:shadow-xl
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = '#fca5a5'; // text-red-300
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // shadow-lg
                }}
              >
                <svg style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span style={{fontWeight: '500'}}>Sign Out</span> {/* font-medium */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}