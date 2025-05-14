import { FiX, FiLink, FiFileText, FiCheckSquare, FiImage  } from 'react-icons/fi';

const NewItemModal = ({ 
  isOpen, 
  onClose, 
  onSelectLink, 
  onSelectNote,
  onSelectTodo, 
  onSelectImage
  }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              Criar novo item
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-gray-300"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={onSelectLink}
              className="flex items-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-purple-900/30 flex items-center justify-center mr-4">
                <FiLink className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-white">Salvar Link</h3>
                <p className="text-sm text-gray-400">Salve um link com título e descrição</p>
              </div>
            </button>
            
            <button
              onClick={onSelectNote}
              className="flex items-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-900/30 flex items-center justify-center mr-4">
                <FiFileText className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-white">Salvar Bloco de Notas</h3>
                <p className="text-sm text-gray-400">Salve um texto ou anotação sem link</p>
              </div>
            </button>
            
            <button
              onClick={onSelectImage}
              className="flex items-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-900/30 flex items-center justify-center mr-4">
                <FiImage className="h-5 w-5 text-pink-400" />
              </div>

              <div className="text-left">
                <h3 className="font-medium text-white">Salvar Imagem</h3>
                <p className="text-sm text-gray-400">Salve uma imagem/foto</p>
              </div>
            </button>

            <button
              onClick={onSelectTodo}
              className="flex items-center mb-5 p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-900/30 flex items-center justify-center mr-4">
              <FiCheckSquare className="h-5 w-5 text-green-400 ml-[2px]" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-white">Lista de Tarefas</h3>
              <p className="text-sm text-gray-400">Salve uma lista de tarefas</p>
            </div>
            </button>


            {/* <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewItemModal;