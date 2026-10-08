import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import Card from './Card';
import Button from './Button';
import Avatar from './Avatar';
import { FiEdit, FiTrash2, FiUser, FiUsers } from 'react-icons/fi';
import { formatDate } from '../utils';
import clsx from 'clsx';

const UserList = ({ onEdit }) => {
  const { user } = useAuth();
  const { users, loading, error, deleteUser } = useUsers();

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="filled" className="text-center py-8">
        <p className="text-red-500 mb-4">Failed to load users: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card variant="filled" className="text-center py-8">
        <div className="flex flex-col items-center">
          <FiUsers className="text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">No users found</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((userItem) => {
        const isCurrentUser = user?.id === userItem.id;
        const isAdmin = user?.role === 'admin';

        return (
          <Card key={userItem.id} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Avatar user={userItem} size="md" className="mr-4" />
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {userItem.name}
                      {isCurrentUser && (
                        <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                          You
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {userItem.email} • {userItem.role} • Member since {formatDate(userItem.createdAt)}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(userItem)}
                    aria-label="Edit user"
                  >
                    <FiEdit className="text-blue-600" />
                  </Button>
                  {!isCurrentUser && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(userItem.id)}
                      aria-label="Delete user"
                    >
                      <FiTrash2 className="text-red-600" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

UserList.propTypes = {
  onEdit: PropTypes.func.isRequired
};

export default UserList;