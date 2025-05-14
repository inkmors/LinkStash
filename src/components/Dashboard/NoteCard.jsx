import { useState } from 'react';
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiFileText } from 'react-icons/fi';
import ConfirmationModal from '../Shared/ConfirmModal';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    onDelete(note.id);
    setShowDeleteModal(false);
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
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
      console.error("Erro ao calcular cor de contraste:", e);
      return '#000000'; 
    }
  };

  return (
    <>
      <div 
        className={`relative bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-700 transition-all duration-200 ${isExpanded ? 'ring-2 ring-purple-500' : 'hover:shadow-md'}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          backgroundColor: note.cardColor && !isExpanded ? `${note.cardColor}20` : undefined,
          borderColor: note.cardColor && !isExpanded ? `${note.cardColor}30` : undefined
        }}
      >
        <div 
          className="p-4 cursor-pointer flex items-center"
          onClick={toggleExpand}
        >
          <div 
            className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: note.cardColor || '#7c3aed',
              color: getContrastColor(note.cardColor || '#7c3aed')
            }}
          >
            <FiFileText className="h-5 w-5" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{note.name}</p>
            <p className="text-sm text-gray-400 truncate">
              {note.content?.substring(0, 30)}{note.content?.length > 30 ? '...' : ''}
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
              backgroundColor: note.cardColor ? `${note.cardColor}10` : undefined
            }}
          >
            <div className="mt-3">
              {note.content && (
                <p className="text-sm text-gray-300 mb-3 whitespace-pre-line">
                  {note.content}
                </p>
              )}
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(note);
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
              </div>
            </div>
          </div>
        )}
        
        {isHovering && !isExpanded && (
          <div className="absolute top-2 right-2 flex space-x-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="cursor-pointer p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
            >
              <FiEdit2 className="w-3 h-3" />
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
        message="Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita."
      />
    </>
  );
};

export default NoteCard;