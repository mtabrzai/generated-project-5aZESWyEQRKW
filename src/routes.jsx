import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './App';

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

const PublicRoute = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export const routes = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        lazy: () => import('./pages/HomePage.jsx')
      },
      {
        path: 'profile',
        lazy: () => import('./pages/ProfilePage.jsx')
      },
      {
        path: 'settings',
        lazy: () => import('./pages/SettingsPage.jsx')
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        index: true,
        lazy: () => import('./pages/admin/DashboardPage.jsx')
      },
      {
        path: 'users',
        lazy: () => import('./pages/admin/UsersPage.jsx')
      }
    ]
  },
  {
    path: '/login',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        lazy: () => import('./pages/LoginPage.jsx')
      }
    ]
  },
  {
    path: '/register',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        lazy: () => import('./pages/RegisterPage.jsx')
      }
    ]
  },
  {
    path: '*',
    lazy: () => import('./pages/NotFoundPage.jsx')
  }
];