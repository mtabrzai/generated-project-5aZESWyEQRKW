import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import { FiArrowLeft } from 'react-icons/fi';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(100, 'Email must be 100 characters or less'),
  password: z.string().min(1, 'Password is required').max(100, 'Password must be 100 characters or less')
});

const LoginPage = () => {
  const { login, loading, error, checkAdminCredentials } = useAuth();
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      // Error handled by context
    }
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
    navigate('/login?admin=true');
  };

  const handleBackToLogin = () => {
    setShowAdminLogin(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="p-8">
          {showAdminLogin ? (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBackToLogin}
                  className="mr-3 p-1 rounded-full hover:bg-gray-100"
                >
                  <FiArrowLeft className="text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={clsx(
                      'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    )}
                    placeholder="admin@example.com"
                    defaultValue="admin@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className={clsx(
                      'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    )}
                    placeholder="Admin@123!"
                    defaultValue="Admin@123!"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                {error && (
                  <div className="p-2 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login as Admin'}
                </Button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login</h2>
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={clsx(
                      'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    )}
                    placeholder="user@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className={clsx(
                      'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    )}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Register
                  </Link>
                </p>
                <button
                  onClick={handleAdminLogin}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Login as Admin
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;