import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2, FiUser, FiCalendar, FiTag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import Button from '../components/Button';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Navbar from '../components/Navbar';
import { formatDate } from '../utils';
import clsx from 'clsx';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, loading, error, deletePost, fetchPosts } = usePosts();
  const [post, setPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPost = posts.find(p => p.id === id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        fetchPosts().then(() => {
          const updatedPost = posts.find(p => p.id === id);
          if (updatedPost) {
            setPost(updatedPost);
          }
        });
      }
    }
  }, [id, posts, fetchPosts]);

  const handleDelete = async () => {
    if (!post) return;
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete post:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthor = user?.id === post?.author?.id;
  const isAdmin = user?.role === 'admin';

  if (loading && !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="animate-pulse">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="filled" className="text-center py-8">
            <p className="text-red-500 mb-4">Failed to load post: {error}</p>
            <Button onClick={() => navigate('/')}>Go Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="filled" className="text-center py-8">
            <p className="text-gray-500 mb-4">Post not found</p>
            <Button onClick={() => navigate('/')}>Go Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            Back to Posts
          </Button>
        </div>

        <Card>
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <Avatar user={post.author} size="sm" className="mr-2" />
                <span className="flex items-center mr-4">
                  <FiUser className="mr-1" />
                  {post.author?.name || 'Unknown Author'}
                </span>
                <span className="flex items-center">
                  <FiCalendar className="mr-1" />
                  {formatDate(post.createdAt)}
                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <span className="ml-1">(edited)</span>
                  )}
                </span>
              </div>
            </div>
            {(isAuthor || isAdmin) && (
              <div className="flex space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                  aria-label="Edit post"
                >
                  <FiEdit className="text-blue-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  aria-label="Delete post"
                >
                  <FiTrash2 className="text-red-600" />
                </Button>
              </div>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <p className="whitespace-pre-line text-gray-700">{post.content}</p>
          </div>

          {post.excerpt && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Excerpt</h3>
              <p className="text-gray-600">{post.excerpt}</p>
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full flex items-center"
                >
                  <FiTag className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PostDetailPage;