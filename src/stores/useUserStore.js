import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { LOCAL_STORAGE_KEYS, API_ENDPOINTS, ERROR_MESSAGES } from '../constants';
import { getLocalStorageItem } from '../utils';

const useUserStore = create(
  persist(
    (set, get) => ({
      users: [],
      loading: false,
      error: null,
      filters: {
        search: '',
        role: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        page: 1,
        limit: 10
      },

      initializeUsers: async () => {
        try {
          set({ loading: true, error: null });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (!token) return;

          const params = {
            search: get().filters.search,
            role: get().filters.role,
            sortBy: get().filters.sortBy,
            sortOrder: get().filters.sortOrder,
            page: get().filters.page,
            limit: get().filters.limit
          };

          const response = await axios.get(API_ENDPOINTS.BASE_URL + API_ENDPOINTS.USERS, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params
          });

          set({ users: response.data.users });
          return response.data;
        } catch (err) {
          const errorMessage = err.response?.data?.message ||
                              err.message ||
                              ERROR_MESSAGES.NETWORK_ERROR;
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      fetchUsers: async () => {
        try {
          set({ loading: true, error: null });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (!token) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

          const params = {
            search: get().filters.search,
            role: get().filters.role,
            sortBy: get().filters.sortBy,
            sortOrder: get().filters.sortOrder,
            page: get().filters.page,
            limit: get().filters.limit
          };

          const response = await axios.get(API_ENDPOINTS.BASE_URL + API_ENDPOINTS.USERS, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params
          });

          set({ users: response.data.users });
          return response.data;
        } catch (err) {
          const errorMessage = err.response?.data?.message ||
                              err.message ||
                              ERROR_MESSAGES.NETWORK_ERROR;
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      createUser: async (userData) => {
        try {
          set({ loading: true, error: null });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (!token) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

          const response = await axios.post(
            API_ENDPOINTS.BASE_URL + API_ENDPOINTS.USERS,
            userData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          set(state => ({ users: [response.data.user, ...state.users] }));
          return response.data.user;
        } catch (err) {
          const errorMessage = err.response?.data?.message ||
                              err.message ||
                              'Failed to create user';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      updateUser: async (userId, userData) => {
        try {
          set({ loading: true, error: null });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (!token) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

          const response = await axios.put(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USERS}/${userId}`,
            userData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          set(state => ({
            users: state.users.map(user =>
              user.id === userId ? response.data.user : user
            )
          }));
          return response.data.user;
        } catch (err) {
          const errorMessage = err.response?.data?.message ||
                              err.message ||
                              'Failed to update user';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      deleteUser: async (userId) => {
        try {
          set({ loading: true, error: null });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (!token) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

          await axios.delete(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USERS}/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          set(state => ({
            users: state.users.filter(user => user.id !== userId)
          }));
        } catch (err) {
          const errorMessage = err.response?.data?.message ||
                              err.message ||
                              'Failed to delete user';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      updateFilters: (newFilters) => {
        set(state => ({
          filters: {
            ...state.filters,
            ...newFilters,
            page: newFilters.page || 1
          }
        }));
      },

      resetFilters: () => {
        set({
          filters: {
            search: '',
            role: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: 1,
            limit: 10
          }
        });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: LOCAL_STORAGE_KEYS.USERS,
      partialize: (state) => ({
        users: state.users,
        filters: state.filters
      })
    }
  )
);

export default useUserStore;