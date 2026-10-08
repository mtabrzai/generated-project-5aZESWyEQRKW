import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FiUser, FiCrown } from 'react-icons/fi';

const Avatar = ({ user, size = 'md', className = '' }) => {
  if (!user) {
    return (
      <div
        className={clsx(
          'inline-flex items-center justify-center bg-gray-200 rounded-full text-gray-500',
          size === 'sm' && 'w-8 h-8 text-sm',
          size === 'md' && 'w-10 h-10 text-base',
          size === 'lg' && 'w-12 h-12 text-lg',
          className
        )}
      >
        <FiUser />
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center relative bg-indigo-100 rounded-full text-indigo-600',
        size === 'sm' && 'w-8 h-8 text-sm',
        size === 'md' && 'w-10 h-10 text-base',
        size === 'lg' && 'w-12 h-12 text-lg',
        className
      )}
    >
      {isAdmin && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
          <FiCrown className="text-xs text-white" />
        </div>
      )}
      {user.name ? (
        <span className="font-medium">
          {user.name.charAt(0).toUpperCase()}
        </span>
      ) : (
        <FiUser />
      )}
    </div>
  );
};

Avatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  }),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default Avatar;