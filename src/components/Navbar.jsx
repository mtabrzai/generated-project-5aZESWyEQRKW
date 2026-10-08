import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FiHome, FiUsers, FiLogIn, FiLogOut, FiSettings, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: <FiHome />,
      show: true
    },
    {
      path: '/admin',
      label: 'Admin',
      icon: <FiUsers />,
      show: user?.role === 'admin'
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <FiUser />,
      show: !!user
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <FiSettings />,
      show: !!user
    }
  ];

  const authItem = {
    path: user ? '#' : '/login',
    label: user ? 'Logout' : 'Login',
    icon: user ? <FiLogOut /> : <FiLogIn />,
    onClick: user ? logout : undefined,
    show: true
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">
                GP
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">Generated Project</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) =>
                item.show && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                      location.pathname === item.path
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                )
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to={authItem.path}
              onClick={authItem.onClick}
              className={clsx(
                'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white',
                user
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              )}
            >
              {authItem.icon}
              <span className="ml-2">{authItem.label}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  className: PropTypes.string
};

export default Navbar;