export const LOCAL_STORAGE_KEYS = {
  USER: 'generatedProject:user',
  THEME: 'generatedProject:theme',
  TOKEN: 'generatedProject:token'
};

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'Admin@123!'
};

export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  USERS: '/users',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users'
  }
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected server error occurred.'
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};