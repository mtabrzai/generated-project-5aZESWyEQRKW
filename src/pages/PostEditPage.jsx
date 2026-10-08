import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import PostForm from '../components/PostForm';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';

const PostEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, loading, error, updatePost, fetchPosts } = usePosts();
  const [post, setPost] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  const handleSubmit = async (postData) => {
    if (!post) return;
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await updatePost(post.id, postData);
      navigate(`/posts/${post.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
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
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-40 bg-gray-200 rounded w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
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

  if (!isAuthor && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="filled" className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have permission to edit this post</p>
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
            onClick={() => navigate(`/posts/${post.id}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            Back to Post
          </Button>
        </div>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
          </div>
          <div className="p-6">
            {submitError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {submitError}
              </div>
            )}
            <PostForm
              post={post}
              onSubmit={handleSubmit}
              loading={isSubmitting}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostEditPage;