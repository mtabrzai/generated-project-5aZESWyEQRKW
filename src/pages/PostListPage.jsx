import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';
import clsx from 'clsx';

const PostListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { posts, loading, error, filters, updateFilters, resetFilters, createPost, updatePost } = usePosts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCreatePost = async (postData) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, postData);
      } else {
        await createPost(postData);
      }
      setIsFormOpen(false);
      setEditingPost(null);
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleViewPost = (post) => {
    navigate(`/posts/${post.id}`);
  };

  const handleSearch = () => {
    updateFilters({ search: searchQuery });
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setSearchQuery('');
    resetFilters();
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <Button
            variant="primary"
            onClick={() => {
              setEditingPost(null);
              setIsFormOpen(true);
            }}
          >
            <FiPlus className="mr-2" />
            Create Post
          </Button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FiFilter className="mr-2" />
              Filters
            </Button>
            <Button
              variant="secondary"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>

        {isFilterOpen && (
          <Card className="mb-6 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsFilterOpen(false)}
              >
                <FiX />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="updatedAt">Updated Date</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <select
                  id="sortOrder"
                  value={filters.sortOrder}
                  onChange={(e) => updateFilters({ sortOrder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={handleReset}
              >
                Reset Filters
              </Button>
            </div>
          </Card>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPost ? 'Edit Post' : 'Create Post'}
                </h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingPost(null);
                  }}
                >
                  <FiX />
                </Button>
              </div>
              <div className="p-4">
                <PostForm
                  post={editingPost}
                  onSubmit={handleCreatePost}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}

        {loading && !posts.length ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full ml-4"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card variant="filled" className="text-center py-8">
            <p className="text-red-500 mb-4">Failed to load posts: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        ) : posts.length > 0 ? (
          <PostList
            onEdit={handleEditPost}
            onView={handleViewPost}
          />
        ) : (
          <Card variant="filled" className="text-center py-8">
            <p className="text-gray-500 mb-4">No posts found</p>
            <Button
              variant="primary"
              onClick={() => {
                setEditingPost(null);
                setIsFormOpen(true);
              }}
            >
              <FiPlus className="mr-2" />
              Create Your First Post
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PostListPage;