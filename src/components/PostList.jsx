import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import Card from './Card';
import Button from './Button';
import Avatar from './Avatar';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { formatDate } from '../utils';
import clsx from 'clsx';

const PostList = ({ onEdit, onView }) => {
  const { user } = useAuth();
  const { posts, loading, error, deletePost } = usePosts();

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Card variant="filled" className="text-center py-8">
        <p className="text-red-500 mb-4">Failed to load posts: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card variant="filled" className="text-center py-8">
        <p className="text-gray-500">No posts found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const isAuthor = user?.id === post.author?.id;
        const isAdmin = user?.role === 'admin';

        return (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                  {(isAuthor || isAdmin) && (
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(post)}
                        aria-label="Edit post"
                      >
                        <FiEdit className="text-blue-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(post.id)}
                        aria-label="Delete post"
                      >
                        <FiTrash2 className="text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Avatar user={post.author} size="sm" className="mr-2" />
                  <span>
                    {post.author?.name || 'Unknown Author'} • {formatDate(post.createdAt)}
                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                      <span className="ml-1">(edited)</span>
                    )}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{post.excerpt || post.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="link"
                    onClick={() => onView(post)}
                    className="text-indigo-600"
                  >
                    <FiEye className="mr-1" />
                    Read more
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

PostList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired
};

export default PostList;