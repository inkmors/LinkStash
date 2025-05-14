import { useEffect } from 'react'

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Confirmar',
  confirmColor = 'bg-red-500 hover:bg-red-600'
  }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium text-white ${confirmColor} transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}