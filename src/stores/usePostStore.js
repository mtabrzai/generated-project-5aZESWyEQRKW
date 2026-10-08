import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { LOCAL_STORAGE_KEYS, API_ENDPOINTS, ERROR_MESSAGES } from '../constants';
import { getLocalStorageItem } from '../utils';

const usePostStore = create(
  persist(
    (set, get) => ({
      posts: [],
      loading: false,
      error: null,
      filters: {
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        page: 1,
        limit: 10
      },

      initializePosts: async () => {
        try {
          set({ loading: true, error: null });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (!token) return;

          const params = {
            search: get().filters.search,
            sortBy: get().filters.sortBy,
            sortOrder: get().filters.sortOrder,
            page: get().filters.page,
            limit: get().filters.limit
          };

          const response = await axios.get(API_ENDPOINTS.BASE_URL + '/posts', {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params
          });

          set({ posts: response.data.posts });
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

      fetchPosts: async () => {
        try {
          set({ loading: true, error: null });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (!token) return;

          const params = {
            search: get().filters.search,
            sortBy: get().filters.sortBy,
            sortOrder: get().filters.sortOrder,
            page: get().filters.page,
            limit: get().filters.limit
          };

          const response = await axios.get(API_ENDPOINTS.BASE_URL + '/posts', {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params
          });

          set({ posts: response.data.posts });
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

      createPost: async (postData) => {
        try {
          set({ loading: true, error: null });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (!token) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

          const response = await axios.post(
            API_ENDPOINTS.BASE_URL + '/posts',
            postData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          set(state => ({ posts: [response.data.post, ...state.posts] }));
          return response.data.post;
        } catch (err) {
          const errorMessage = err.response?.data?.message ||
                              err.message ||
                              'Failed to create post';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      updatePost: async (postId, postData) => {
        try {
          set({ loading: true, error: null });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (!token) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

          const response = await axios.put(
            `${API_ENDPOINTS.BASE_URL}/posts/${postId}`,
            postData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          set(state => ({
            posts: state.posts.map(post =>
              post.id === postId ? response.data.post : post
            )
          }));
          return response.data.post;
        } catch (err) {
          const errorMessage = err.response?.data?.message ||
                              err.message ||
                              'Failed to update post';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      deletePost: async (postId) => {
        try {
          set({ loading: true, error: null });
          const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (!token) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

          await axios.delete(
            `${API_ENDPOINTS.BASE_URL}/posts/${postId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          set(state => ({
            posts: state.posts.filter(post => post.id !== postId)
          }));
        } catch (err) {
          const errorMessage = err.response?.data?.message ||
                              err.message ||
                              'Failed to delete post';
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
      name: LOCAL_STORAGE_KEYS.POSTS,
      partialize: (state) => ({
        posts: state.posts,
        filters: state.filters
      })
    }
  )
);

export default usePostStore;