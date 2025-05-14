import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi'
// import { ThemeContext } from '../../contexts/ThemeContext'
import { AuthContext } from '../../contexts/AuthContext'

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  // const { theme, toggleTheme } = useContext(ThemeContext)
  const { currentUser, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center gap-3 focus:outline-none"
      >
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="hidden md:inline text-sm font-medium text-gray-300">
          {currentUser.name}
        </span>
        <FiChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="cursor-pointer fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />

          
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-30 border border-gray-700">
            {currentUser?.isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <FiSettings className="mr-2" />
                Painel Admin
              </Link>
            )}
            <Link
              to="/profile"
              className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <FiUser className="mr-2" />
              Perfil
            </Link>
            
            <Link
              to="/settings"
              className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <FiSettings className="mr-2" />
              Configurações
            </Link>
            
            {/* <button
              onClick={toggleTheme}
              className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <span className="mr-2">🌓</span>
              {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </button> */}
            
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 flex items-center"
            >
              <FiLogOut className="mr-2" />
              Deslogar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default UserMenu