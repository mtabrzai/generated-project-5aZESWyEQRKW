import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import PostForm from '../components/PostForm';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';

const PostCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPost, loading } = usePosts();
  const [error, setError] = useState(null);

  const handleSubmit = async (postData) => {
    try {
      setError(null);
      const newPost = {
        ...postData,
        authorId: user.id
      };
      await createPost(newPost);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create post');
    }
  };

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
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <PostForm
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostCreatePage;