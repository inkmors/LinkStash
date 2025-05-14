import { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

const COLOR_PRESETS = [
  { name: 'Roxo Premium', value: '#7c3aed' },
  { name: 'Azul Profundo', value: '#3b82f6' },
  { name: 'Verde Esmeralda', value: '#10b981' },
  { name: 'Âmbar Quente', value: '#f59e0b' },
  { name: 'Rubi Vibrante', value: '#ef4444' },
  { name: 'Índigo Suave', value: '#6366f1' },
  { name: 'Ciano Tropical', value: '#06b6d4' },
  { name: 'Rosa Charmoso', value: '#ec4899' },
  { name: 'Lavanda Sereno', value: '#a78bfa' },
  { name: 'Menta Refrescante', value: '#34d399' }
];

const NoteForm = ({ noteToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    cardColor: '#7c3aed'
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (noteToEdit) {
      setFormData({
        name: noteToEdit.name,
        content: noteToEdit.content || '',
        cardColor: noteToEdit.cardColor || '#3b82f6'
      });
    } else {
      setFormData({
        name: '',
        content: '',
        cardColor: '#3b82f6'
      });
    }
  }, [noteToEdit]);

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
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O título é obrigatório';
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
              {noteToEdit ? 'Editar bloco de notas' : 'Novo bloco de notas'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-300"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="Ex: Minhas anotações"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
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
                          ? 'border-purple-500 scale-105' 
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
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                Conteúdo
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="8"
                className="resize-none w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Digite seu texto aqui..."
              />
            </div>
            
            <div className="flex justify-end gap-5 pt-4 bg-gray-800 pb-4 -mx-6 px-6">
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-purple-600  text-white rounded-lg hover:bg-purple-700 shadow-md transition-all">
                {noteToEdit ? 'Atualizar' : 'Salvar Nota'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;