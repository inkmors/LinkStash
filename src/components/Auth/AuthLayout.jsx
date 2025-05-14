import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const AuthLayout = ({ children, title, subtitle, footerText, footerLink, footerLinkText }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* <Link to="/" className="flex items-center text-purple-600 dark:text-purple-400 mb-6">
          <FiArrowLeft className="mr-2" />
          Voltar para a página inicial
        </Link> */}
        
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
              <p className="text-gray-400">{subtitle}</p>
            </div>
            
            {children}
          </div>
          
          <div className="bg-gray-700 px-8 py-4 text-center">
            <p className="text-gray-300">
              {footerText} <Link to={footerLink} className="text-purple-400 font-medium">{footerLinkText}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout