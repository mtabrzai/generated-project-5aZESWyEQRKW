import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { LOCAL_STORAGE_KEYS, API_ENDPOINTS, ERROR_MESSAGES, DEFAULT_ADMIN_CREDENTIALS } from '../constants';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem, clearAppLocalStorage } from '../utils';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      initializeAuth: async () => {
        try {
          set({ loading: true, error: null });
          const storedUser = getLocalStorageItem(LOCAL_STORAGE_KEYS.USER);
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);

          if (storedUser && token) {
            try {
              const response = await axios.get(API_ENDPOINTS.BASE_URL + API_ENDPOINTS.AUTH.ME, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              set({ user: response.data.user });
            } catch (err) {
              get().clearAuth();
            }
          }
        } catch (err) {
          console.error('Auth initialization error:', err);
          set({ error: ERROR_MESSAGES.SERVER_ERROR });
        } finally {
          set({ loading: false });
        }
      },

      login: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const response = await axios.post(
            API_ENDPOINTS.BASE_URL + API_ENDPOINTS.AUTH.LOGIN,
            credentials
          );

          const { user, token } = response.data;
          set({ user });
          setLocalStorageItem(LOCAL_STORAGE_KEYS.USER, user);
          setLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN, token);
          return user;
        } catch (err) {
          const errorMessage = err.response?.data?.message ||
                              err.message ||
                              ERROR_MESSAGES.INVALID_CREDENTIALS;
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (token) {
            await axios.post(
              API_ENDPOINTS.BASE_URL + API_ENDPOINTS.AUTH.LOGOUT,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
          }
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          get().clearAuth();
          set({ loading: false });
        }
      },

      register: async (userData) => {
        try {
          set({ loading: true, error: null });
          const response = await axios.post(
            API_ENDPOINTS.BASE_URL + '/auth/register',
            userData
          );

          const { user, token } = response.data;
          set({ user });
          setLocalStorageItem(LOCAL_STORAGE_KEYS.USER, user);
          setLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN, token);
          return user;
        } catch (err) {
          const errorMessage = err.response?.data?.message ||
                              err.message ||
                              'Registration failed';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      clearAuth: () => {
        clearAppLocalStorage();
        set({ user: null });
      },

      checkAdminCredentials: (email, password) => {
        return email === DEFAULT_ADMIN_CREDENTIALS.email &&
               password === DEFAULT_ADMIN_CREDENTIALS.password;
      }
    }),
    {
      name: LOCAL_STORAGE_KEYS.USER,
      partialize: (state) => ({
        user: state.user
      })
    }
  )
);

export default useAuthStore;