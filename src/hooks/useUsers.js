import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../constants';
import { useAuth } from './useAuth';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });
  const { getLocalStorageItem, LOCAL_STORAGE_KEYS } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
      const params = {
        search: filters.search,
        role: filters.role,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: filters.page,
        limit: filters.limit
      };

      const response = await axios.get(API_ENDPOINTS.BASE_URL + API_ENDPOINTS.USERS, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      });

      setUsers(response.data.users);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, getLocalStorageItem, LOCAL_STORAGE_KEYS.TOKEN]);

  const createUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);

      const response = await axios.post(
        API_ENDPOINTS.BASE_URL + API_ENDPOINTS.USERS,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(prevUsers => [response.data.user, ...prevUsers]);
      return response.data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Failed to create user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getLocalStorageItem, LOCAL_STORAGE_KEYS.TOKEN]);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      setLoading(true);
      setError(null);
      const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);

      const response = await axios.put(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USERS}/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? response.data.user : user
        )
      );
      return response.data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getLocalStorageItem, LOCAL_STORAGE_KEYS.TOKEN]);

  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);

      await axios.delete(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USERS}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(prevUsers =>
        prevUsers.filter(user => user.id !== userId)
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Failed to delete user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getLocalStorageItem, LOCAL_STORAGE_KEYS.TOKEN]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
      page: newFilters.page || 1
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      role: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    filters,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateFilters,
    resetFilters
  };
};