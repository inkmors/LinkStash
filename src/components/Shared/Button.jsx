import { FiLoader } from 'react-icons/fi'

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  className = '',
  icon: Icon,
  iconPosition = 'left'
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }
  
  const variantStyles = {
    primary: 'bg-purple-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md',
    secondary: 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-purple-400 hover:bg-purple-900/20',
    link: 'text-purple-400 hover:underline'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
        cursor-pointer
      `}
    >
      {loading ? (
        <>
          <FiLoader className="animate-spin mr-2" />
          Processando...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="mr-2" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="ml-2" />}
        </>
      )}
    </button>
  )
}

export default Button