import { useState } from 'react';
import { FiCheck, FiTrash2, FiEdit2, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ConfirmationModal from '../Shared/ConfirmModal';

const TodoCard = ({ todo, onEdit, onDelete, onToggleComplete, onAddTask, onDeleteTask }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeleteTask = (e, taskIndex) => {
    e.stopPropagation();
    onDeleteTask(todo.id, taskIndex);
  };
  
  const confirmDelete = () => {
    onDelete(todo.id);
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
      return '#000000', console.error("Erro ao calcular cor de contraste:", e);
    }
  };

  const handleAddTask = (e) => {
    e.stopPropagation();
    if (newTaskText.trim()) {
      onAddTask(todo.id, newTaskText);
      setNewTaskText('');
    }
  };

  return (
    <>
      <div 
        className={`relative bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-700 transition-all duration-200 ${isExpanded ? 'ring-2 ring-purple-500' : 'hover:shadow-md'}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          backgroundColor: todo.cardColor && !isExpanded ? `${todo.cardColor}20` : undefined,
          borderColor: todo.cardColor && !isExpanded ? `${todo.cardColor}30` : undefined
        }}
      >
        <div 
          className="p-4 cursor-pointer flex items-center"
          onClick={toggleExpand}
        >
          <div 
            className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: todo.cardColor || '#10b981',
              color: getContrastColor(todo.cardColor || '#10b981')
            }}
          >
            <span className="text-sm font-medium">
              {todo.tasks?.filter(t => t.completed).length || 0}/{todo.tasks?.length || 0}
            </span>
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{todo.title || 'Lista de Tarefas'}</p>
            <p className="text-sm text-gray-400 truncate">
              {todo.description || 'Sem descrição'}
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
              backgroundColor: todo.cardColor ? `${todo.cardColor}10` : undefined
            }}
          >
            <div className="mt-3">
              {todo.description && (
                <p className="text-sm text-gray-300 mb-3">{todo.description}</p>
              )}
              
              <div className="flex flex-col gap-3 mb-4">
                {todo.tasks?.map((task, index) => (
                <div key={index} className="flex items-center group">
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(todo.id, index, !task.completed);
                    }}
                    className={`cursor-pointer flex-shrink-0 h-5 w-5 rounded-full border ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-600'} flex items-center justify-center mr-3`}
                    >
                    {task.completed && <FiCheck className="text-white" />}
                    </button>
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-300'}`}>
                    {task.text}
                    </span>
                    <button
                    onClick={(e) => handleDeleteTask(e, index)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-2 transition-opacity"
                    >
                    <FiTrash2 className="w-4 h-4 cursor-pointer" />
                    </button>
                </div>
                ))}
              </div>
              
              <div className="flex items-center mt-8 mb-6 gap-1">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(e)}
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-700 text-gray-100 placeholder-gray-500 transition-all duration-200 shadow-sm"
                    placeholder="Adicionar nova tarefa..."
                />
                </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(todo);
                  }}
                  className="cursor-pointer p-2 text-gray-500 hover:text-green-400 hover:bg-green-900/20 rounded-full transition-colors"
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
          <div className="absolute top-2 right-2 flex space-x-5">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(todo);
              }}
              className="cursor-pointer p-1 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded transition-colors"
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
        message="Tem certeza que deseja excluir esta lista de tarefas? Esta ação não pode ser desfeita."
      />
    </>
  );
};

export default TodoCard;