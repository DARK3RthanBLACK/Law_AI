import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    const storedToken = localStorage.getItem('lawai_token');
    const storedUser = localStorage.getItem('lawai_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        // Clear corrupt data
        localStorage.removeItem('lawai_token');
        localStorage.removeItem('lawai_user');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Secure storage strategy:
      // We store the token in localStorage here for client simplicity.
      // In production, setting an 'httpOnly' cookie from the backend response is more secure
      // as it mitigates Cross-Site Scripting (XSS) risks. 
      // If using httpOnly cookies, you would omit storing the token here, and use 
      // 'credentials: "include"' on all fetch calls to let the browser automatically send the cookie.
      localStorage.setItem('lawai_token', data.token);
      localStorage.setItem('lawai_user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Login service error:', err);
      throw err;
    }
  };

  // Registration handler
  const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('lawai_token', data.token);
      localStorage.setItem('lawai_user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Registration service error:', err);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('lawai_token');
    localStorage.removeItem('lawai_user');
    setToken(null);
    setUser(null);
  };

  // Helper fetch function that automatically appends the Authorization header
  const authFetch = async (url, options = {}) => {
    const headers = options.headers || {};
    
    // Add Authorization header if token is present
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Default to JSON body if not otherwise specified
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const mergedOptions = {
      ...options,
      headers,
    };

    const response = await fetch(url, mergedOptions);
    
    // Auto-logout if token is expired/invalid (401)
    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please log in again.');
    }

    return response;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    authFetch,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
