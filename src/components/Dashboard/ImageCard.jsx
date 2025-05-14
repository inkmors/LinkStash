import { useState } from 'react';
import { FiTrash2, FiEdit2, FiChevronDown, FiChevronUp, FiImage, FiDownload } from 'react-icons/fi';
import ConfirmationModal from '../Shared/ConfirmModal';

const ImageCard = ({ image, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    onDelete(image.id);
    setShowDeleteModal(false);
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = image.imageData;
    link.download = image.title || 'imagem';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getContrastColor = (hexColor) => {
    if (!hexColor) return '#000000';
    const hex = hexColor.replace('#', '').toString();
    if (hex.length !== 3 && hex.length !== 6) return '#000000';
    try {
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substr(0, 2), 16);
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substr(2, 2), 16);
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? '#000000' : '#ffffff';
    } catch (e) {
      return '#000000', console.error("Erro ao calcular cor de contraste:", e);
    }
  };

  return (
    <>
      <div 
        className={`relative bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-700 transition-all duration-200 ${isExpanded ? 'ring-2 ring-purple-500' : 'hover:shadow-md'}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          backgroundColor: image.cardColor && !isExpanded ? `${image.cardColor}20` : undefined,
          borderColor: image.cardColor && !isExpanded ? `${image.cardColor}30` : undefined
        }}
      >
        <div 
          className="p-4 cursor-pointer flex items-center"
          onClick={toggleExpand}
        >
          <div 
            className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: image.cardColor || '#7c3aed',
              color: getContrastColor(image.cardColor || '#7c3aed')
            }}
          >
            <FiImage className="h-5 w-5" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{image.title || 'Sem título'}</p>
            <p className="text-sm text-gray-400 truncate">
              {image.description?.substring(0, 30) || 'Sem descrição'}
            </p>
          </div>
          <div className="text-gray-500">
            {isExpanded ? (
              <FiChevronUp className="h-5 w-5" />
            ) : (
              <FiChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div 
            className="px-4 pb-4 border-t border-gray-700"
            style={{
              backgroundColor: image.cardColor ? `${image.cardColor}10` : undefined
            }}
          >
            <div className="mt-3">
              {image.description && (
                <p className="text-sm text-gray-300 mb-3">{image.description}</p>
              )}
              
              <div className="aspect-square bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden mb-3 relative group">
                <img 
                  src={image.imageData} 
                  alt={image.title || 'Imagem'} 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={handleDownload}
                    className="p-3 bg-gray-800 rounded-full text-white hover:bg-gray-700 mr-2"
                    title="Download"
                  >
                    <FiDownload className="cursor-pointer w-7 h-7" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(image);
                  }}
                  className="cursor-pointer p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-full transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDeleteClick}
                  className="cursor-pointer p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
                <button 
                onClick={handleDownload}
                className="cursor-pointer p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded-full transition-colors"
                >
                <FiDownload className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isHovering && !isExpanded && (
            <div className="absolute top-2 right-2 flex space-x-1">
                <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(image);
                }}
                className="cursor-pointer p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
                >
                <FiEdit2 className="w-3 h-3" />
                </button>
                <button 
                onClick={handleDownload}
                className="cursor-pointer p-1 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded transition-colors"
                >
                <FiDownload className="w-3 h-3" />
                </button>
                <button 
                onClick={handleDeleteClick}
                className="cursor-pointer p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                >
                <FiTrash2 className="w-3 h-3" />
                </button>
            </div>
            )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita."
      />
    </>
  );
};

export default ImageCard;