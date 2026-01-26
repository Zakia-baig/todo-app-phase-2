'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';

// Set API base URL to point directly to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and redirects
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });

    // Handle unauthorized access
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Authentication error - clearing tokens');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      // Redirect to login (if we were in a component context)
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// API endpoints for tasks
export const taskApi = {
  // Get all tasks for a user
  getTasks: (userId: string) => {
    console.log('Fetching tasks for user:', userId); // Added for debugging
    return apiClient.get(`/api/${userId}/tasks`)
      .then(response => {
        console.log('Server responded:', response.data); // Added for debugging
        return response;
      })
      .catch(error => {
        console.log('Error fetching tasks:', error.response?.data || error.message);
        throw error;
      });
  },

  // Create a new task
  createTask: (userId: string, taskData: { title: string; description?: string; user_id: string; due_date?: string }) => {
    console.log('Creating task for user:', userId, 'with data:', taskData); // Enhanced logging
    return apiClient.post(`/api/${userId}/tasks`, taskData)
      .then(response => {
        console.log('Task created successfully:', response.data); // Enhanced logging
        return response;
      })
      .catch(error => {
        console.error('Error creating task:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          userId: userId,
          taskData: taskData
        });
        throw error;
      });
  },

  // Get a specific task
  getTask: (userId: string, taskId: string) => {
    console.log('Fetching task:', taskId, 'for user:', userId); // Added for debugging
    return apiClient.get(`/api/${userId}/tasks/${taskId}`)
      .then(response => {
        console.log('Server responded:', response.data); // Added for debugging
        return response;
      })
      .catch(error => {
        console.log('Error fetching task:', error.response?.data || error.message);
        throw error;
      });
  },

  // Update a task
  updateTask: (userId: string, taskId: string, taskData: { title?: string; description?: string; completed?: boolean; due_date?: string }) => {
    console.log('Sending data:', taskData); // Added for debugging
    return apiClient.put(`/api/${userId}/tasks/${taskId}`, taskData)
      .then(response => {
        console.log('Server responded:', response.data); // Added for debugging
        return response;
      })
      .catch(error => {
        console.log('Error updating task:', error.response?.data || error.message);
        throw error;
      });
  },

  // Delete a task
  deleteTask: (userId: string, taskId: string) => {
    console.log('Deleting task:', taskId, 'for user:', userId); // Added for debugging
    return apiClient.delete(`/api/${userId}/tasks/${taskId}`)
      .then(response => {
        console.log('Server responded:', response.data); // Added for debugging
        return response;
      })
      .catch(error => {
        console.log('Error deleting task:', error.response?.data || error.message);
        throw error;
      });
  },
};

// API endpoints for authentication
export const authApi = {
  login: (email: string, password: string) => {
    // Send request as JSON with configurable URL
    return axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      // Handle successful login response
      console.log('Login successful:', response.data);
      return response;
    }).catch(error => {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    });
  },

  logout: () => {
    return apiClient.post('/api/auth/logout')
      .then(response => {
        return response;
      })
      .catch(error => {
        console.log('Logout error:', error.response?.data || error.message);
        throw error;
      });
  },

  signup: (email: string, password: string, username?: string) => {
    return axios.post(`${API_BASE_URL}/api/auth/signup`, {
      email,
      password,
      username
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      console.log('Signup successful:', response.data);
      return response;
    }).catch(error => {
      console.error('Signup error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    });
  },

  getCurrentUser: () => {
    return apiClient.get('/api/auth/me')
      .then(response => {
        console.log('Get user successful:', response.data);
        return response;
      })
      .catch(error => {
        console.log('Get user error:', error.response?.data || error.message);
        throw error;
      });
  }
};