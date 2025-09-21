import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextDef';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Check if backend server is accessible
  const checkServerConnection = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch (error) {
      console.log('Server connection check failed:', error);
      return false;
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        // Parse the stored user to check if it's valid JSON
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        console.error('Invalid user data in localStorage, clearing...', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data and token
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (fullName, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store user data and token
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Handle authentication errors (expired/invalid tokens)
  const handleAuthError = useCallback(() => {
    console.log('AuthContext: Handling auth error - clearing user session');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  // Get auth headers for API calls
  const getAuthHeaders = useCallback(() => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, [token]);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      console.log('AuthContext: Starting fetchProfile, token:', !!token);
      
      // Check if token exists
      if (!token) {
        console.log('AuthContext: No token available');
        return { success: false, error: 'No authentication token found. Please login.' };
      }
      
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('AuthContext: Response status:', response.status);
      
      // Handle authentication errors (401/403)
      if (response.status === 401 || response.status === 403) {
        console.log('AuthContext: Authentication failed, clearing session');
        handleAuthError();
        return { 
          success: false, 
          error: 'Your session has expired. Please login again.',
          authError: true 
        };
      }

      const data = await response.json();
      console.log('AuthContext: Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      // Update user data in state and localStorage
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, data: data.user };
    } catch (error) {
      console.log('AuthContext: Error in fetchProfile:', error);
      
      // If it's a network error and we have stored user data, use that temporarily
      if (error.name === 'TypeError' && user) {
        return { 
          success: false, 
          error: 'Unable to connect to server. Showing cached profile data.',
          networkError: true 
        };
      }
      
      return { success: false, error: error.message };
    }
  }, [token, handleAuthError, user]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user data in state and localStorage
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, data: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [getAuthHeaders]);

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    getAuthHeaders,
    fetchProfile,
    updateProfile,
    changePassword,
    handleAuthError,
    checkServerConnection,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
