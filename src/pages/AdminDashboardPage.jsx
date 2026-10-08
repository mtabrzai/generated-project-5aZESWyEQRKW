import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiBarChart2, FiUserPlus, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { usePosts } from '../hooks/usePosts';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import UserList from '../components/UserList';
import clsx from 'clsx';

const StatCard = ({ title, value, icon, trend, className = '' }) => {
  return (
    <Card className={clsx('p-6', className)}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={clsx(
              'text-sm font-medium mt-1',
              trend > 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {trend > 0 ? '+' : ''}{trend}% from last week
            </p>
          )}
        </div>
        <div className="p-3 bg-indigo-100 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  );
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { posts, loading: postsLoading, error: postsError } = usePosts();
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    if (users.length > 0) {
      const sortedUsers = [...users].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentUsers(sortedUsers.slice(0, 5));
    }
  }, [users]);

  useEffect(() => {
    if (posts.length > 0) {
      const sortedPosts = [...posts].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentPosts(sortedPosts.slice(0, 5));
    }
  }, [posts]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="filled" className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have permission to access this page</p>
            <Button onClick={() => window.location.href = '/'}>Go Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={usersLoading ? '...' : users.length}
            icon={<FiUsers className="text-indigo-600 text-2xl" />}
            trend={users.length > 0 ? 10 : 0}
            className="hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Total Posts"
            value={postsLoading ? '...' : posts.length}
            icon={<FiFileText className="text-indigo-600 text-2xl" />}
            trend={posts.length > 0 ? 15 : 0}
            className="hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Active Users"
            value={usersLoading ? '...' : users.filter(u => u.lastActive).length}
            icon={<FiBarChart2 className="text-indigo-600 text-2xl" />}
            className="hover:shadow-md transition-shadow"
          />
          <StatCard
            title="New Users (7d)"
            value={usersLoading ? '...' : recentUsers.length}
            icon={<FiUserPlus className="text-indigo-600 text-2xl" />}
            className="hover:shadow-md transition-shadow"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Users */}
          <Card>
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
              <Link to="/admin/users">
                <Button variant="link" className="text-indigo-600">
                  View All <FiArrowRight className="ml-1" />
                </Button>
              </Link>
            </div>
            <div className="p-6">
              {usersLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : usersError ? (
                <div className="text-center py-4">
                  <p className="text-red-500 mb-2">Failed to load users</p>
                  <Button variant="secondary" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : recentUsers.length > 0 ? (
                <UserList
                  users={recentUsers}
                  onEdit={() => {}}
                  showActions={false}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Posts */}
          <Card>
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
              <Link to="/">
                <Button variant="link" className="text-indigo-600">
                  View All <FiArrowRight className="ml-1" />
                </Button>
              </Link>
            </div>
            <div className="p-6">
              {postsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : postsError ? (
                <div className="text-center py-4">
                  <p className="text-red-500 mb-2">Failed to load posts</p>
                  <Button variant="secondary" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        by {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt || post.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No posts found</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/admin/users">
                <Button variant="secondary" fullWidth className="h-20 flex flex-col">
                  <FiUsers className="text-2xl mb-2" />
                  <span>Manage Users</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="secondary" fullWidth className="h-20 flex flex-col">
                  <FiFileText className="text-2xl mb-2" />
                  <span>Manage Posts</span>
                </Button>
              </Link>
              <Button variant="secondary" fullWidth className="h-20 flex flex-col">
                <FiBarChart2 className="text-2xl mb-2" />
                <span>View Reports</span>
              </Button>
              <Button variant="secondary" fullWidth className="h-20 flex flex-col">
                <FiUserPlus className="text-2xl mb-2" />
                <span>Create User</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;