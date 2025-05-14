import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound(){
  useEffect(() => {
    document.title = 'LinkStash | Error 404'
  })
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-purple-400 opacity-20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
              <h1 className="text-3xl font-bold text-white mb-2">Página não encontrada</h1>
              <p className="text-gray-300 mb-6">
                A página que você está procurando pode ter sido removida ou não está disponível.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <FiArrowLeft className="mr-2" />
                Voltar para a página inicial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
