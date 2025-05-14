import { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

const COLOR_PRESETS = [
  { name: 'Verde Esmeralda', value: '#10b981' },
  { name: 'Roxo Premium', value: '#7c3aed' },
  { name: 'Azul Profundo', value: '#3b82f6' },
  { name: 'Âmbar Quente', value: '#f59e0b' },
  { name: 'Rubi Vibrante', value: '#ef4444' },
  { name: 'Índigo Suave', value: '#6366f1' },
  { name: 'Ciano Tropical', value: '#06b6d4' },
  { name: 'Rosa Charmoso', value: '#ec4899' },
  { name: 'Lavanda Sereno', value: '#a78bfa' },
  { name: 'Menta Refrescante', value: '#34d399' }
];

const TodoForm = ({ todoToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cardColor: '#10b981',
    tasks: []
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (todoToEdit) {
      setFormData({
        title: todoToEdit.title,
        description: todoToEdit.description || '',
        cardColor: todoToEdit.cardColor || '#10b981',
        tasks: todoToEdit.tasks || []
      });
    }
  }, [todoToEdit]);

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
  
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center z-50 overflow-y-auto py-8">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 my-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {todoToEdit ? "Editar Lista de Tarefas" : "Nova Lista de Tarefas"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-300"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.title ? 'border-red-500' : 'border-gray-600'
                } bg-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Ex: Tarefas da semana"
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="resize-none w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Descrição da lista de tarefas"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cor do Card
              </label>
              
              <div 
                className="w-full h-12 rounded-lg mb-4 transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: formData.cardColor }}
              >
                <span 
                  className="text-sm font-medium px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: getContrastColor(formData.cardColor)
                  }}
                >
                  Visualização
                </span>
              </div>
            
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {COLOR_PRESETS.map((color) => (
                  <div key={color.value} className="relative">
                    <button
                      type="button"
                      className={`cursor-pointer w-full h-10 rounded-lg border-2 transition-all ${
                        formData.cardColor === color.value 
                          ? 'border-green-500 scale-105' 
                          : 'border-transparent hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        cardColor: color.value
                      }))}
                    >
                      {formData.cardColor === color.value && (
                        <FiCheck className="absolute top-1 right-1 text-white mix-blend-difference" />
                      )}
                    </button>
                    <span className="text-xs text-gray-400 block text-center mt-1 truncate">
                      {color.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 bg-gray-800 pb-4 -mx-6 px-6">
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md transition-all"
              >
                {todoToEdit ? "Atualizar" : "Salvar Lista"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TodoForm;