import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../constants';
import { useAuth } from './useAuth';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });
  const { getLocalStorageItem, LOCAL_STORAGE_KEYS } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);
      const params = {
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: filters.page,
        limit: filters.limit
      };

      const response = await axios.get(API_ENDPOINTS.BASE_URL + '/posts', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      });

      setPosts(response.data.posts);
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

  const createPost = useCallback(async (postData) => {
    try {
      setLoading(true);
      setError(null);
      const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);

      const response = await axios.post(
        API_ENDPOINTS.BASE_URL + '/posts',
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPosts(prevPosts => [response.data.post, ...prevPosts]);
      return response.data.post;
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Failed to create post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getLocalStorageItem, LOCAL_STORAGE_KEYS.TOKEN]);

  const updatePost = useCallback(async (postId, postData) => {
    try {
      setLoading(true);
      setError(null);
      const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);

      const response = await axios.put(
        `${API_ENDPOINTS.BASE_URL}/posts/${postId}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? response.data.post : post
        )
      );
      return response.data.post;
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Failed to update post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getLocalStorageItem, LOCAL_STORAGE_KEYS.TOKEN]);

  const deletePost = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);
      const token = getLocalStorageItem(LOCAL_STORAGE_KEYS.TOKEN);

      await axios.delete(
        `${API_ENDPOINTS.BASE_URL}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPosts(prevPosts =>
        prevPosts.filter(post => post.id !== postId)
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Failed to delete post';
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
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    filters,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    updateFilters,
    resetFilters
  };
};