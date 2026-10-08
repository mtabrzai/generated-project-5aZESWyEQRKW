import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LOCAL_STORAGE_KEYS, API_ENDPOINTS, ERROR_MESSAGES, DEFAULT_ADMIN_CREDENTIALS } from '../constants';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem, clearAppLocalStorage } from '../utils';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getLocalStorageItem(LOCAL_STORAGE_KEYS.USER);
        const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);

        if (storedUser && token) {
          try {
            const response = await axios.get(API_ENDPOINTS.BASE_URL + API_ENDPOINTS.AUTH.ME, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUser(response.data.user);
          } catch (err) {
            clearAppLocalStorage();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        API_ENDPOINTS.BASE_URL + API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      const { user, token } = response.data;
      setUser(user);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER, user);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN, token);

      navigate('/');
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          ERROR_MESSAGES.INVALID_CREDENTIALS;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(
        API_ENDPOINTS.BASE_URL + API_ENDPOINTS.AUTH.LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN)}`
          }
        }
      );
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAppLocalStorage();
      setUser(null);
      setLoading(false);
      navigate('/login');
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        API_ENDPOINTS.BASE_URL + '/auth/register',
        userData
      );

      const { user, token } = response.data;
      setUser(user);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER, user);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN, token);

      navigate('/');
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminCredentials = (email, password) => {
    return email === DEFAULT_ADMIN_CREDENTIALS.email &&
           password === DEFAULT_ADMIN_CREDENTIALS.password;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
        error,
        checkAdminCredentials
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};