import PropTypes from 'prop-types';
import clsx from 'clsx';

const Card = ({
  children,
  className = '',
  variant = 'default',
  shadow = 'md',
  padding = 'p-6',
  rounded = 'rounded-lg',
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    outline: 'bg-transparent border border-gray-200',
    filled: 'bg-gray-50'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  return (
    <div
      className={clsx(
        'w-full',
        variantClasses[variant],
        shadowClasses[shadow],
        padding,
        rounded,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'outline', 'filled']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  padding: PropTypes.string,
  rounded: PropTypes.string
};

export default Card;