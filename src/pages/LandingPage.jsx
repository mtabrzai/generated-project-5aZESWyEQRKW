import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiUsers, FiCode } from 'react-icons/fi';
import Button from '../components/Button';
import Card from '../components/Card';
import PostList from '../components/PostList';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const { posts, loading, error } = usePosts();

  const samplePosts = posts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Generated Project
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            A modern platform for sharing ideas, connecting with others, and building amazing things together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!user ? (
              <>
                <Link to="/register">
                  <Button variant="secondary" size="lg" className="text-indigo-600">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-600">
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/">
                <Button variant="secondary" size="lg" className="text-indigo-600">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Generated Project?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiBookOpen className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Content</h3>
              <p className="text-gray-600">
                Share your ideas with the world through rich posts and articles.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect with Others</h3>
              <p className="text-gray-600">
                Join a community of creators, developers, and thinkers.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiCode className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Built for Developers</h3>
              <p className="text-gray-600">
                Modern tech stack with React, Vite, and Tailwind CSS.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Posts Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Posts
            </h2>
            <Link to={user ? "/" : "/login"}>
              <Button variant="link" className="text-indigo-600">
                View All <FiArrowRight className="ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
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
              <p className="text-red-500 mb-4">Failed to load posts</p>
            </Card>
          ) : samplePosts.length > 0 ? (
            <PostList
              posts={samplePosts}
              onEdit={() => {}}
              onView={() => {}}
            />
          ) : (
            <Card variant="filled" className="text-center py-8">
              <p className="text-gray-500">No posts available</p>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already creating and sharing amazing content.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!user ? (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Create Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/">
                <Button variant="primary" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;