import { useState, useEffect } from 'react'
import { FiX, FiLink, FiCheck } from 'react-icons/fi'

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

function getContrastColor(hexColor) {
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
}

const LinkForm = ({ linkToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    isShortened: false,
    cardColor: '#7c3aed'
  })
  
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (linkToEdit) {
      setFormData({
        name: linkToEdit.name,
        url: linkToEdit.url,
        description: linkToEdit.description || '',
        isShortened: linkToEdit.isShortened || false,
        cardColor: linkToEdit.cardColor || '#7c3aed'
      });
    } else {
      setFormData({
        name: '',
        url: '',
        description: '',
        isShortened: false,
        cardColor: '#7c3aed'
      });
    }
  }, [linkToEdit]);
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.url.trim()) {
      newErrors.url = 'O URL é obrigatório'
    } else {
      try {
        new URL(formData.url)
      } catch {
        newErrors.url = 'URL Inválido'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSave({
        ...formData,
        cardColor: formData.cardColor || '#7c3aed'
      })
    }
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center z-50 overflow-y-auto py-8">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 my-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {linkToEdit ? "Editar link" : "Novo link"}
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
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-600"
                } bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="Ex: Meu Portfolio"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.name}
                </p>
              )}
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
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: getContrastColor(formData.cardColor),
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
                          ? "border-purple-500 scale-105"
                          : "border-transparent hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          cardColor: color.value,
                        }))
                      }
                    >
                      {formData.cardColor === color.value && (
                        <FiCheck className="absolute top-1 right-1 text-white mix-blend-difference" />
                      )}
                    </button>
                    <span className="text-xs text-gray-400 block text-center mt-1 truncate">
                      {color.name.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Link <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLink className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.url ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="https://exemploLink.com"
                />
              </div>
              {errors.url && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.url}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Descrição (opcional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="resize-none w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Uma breve descrição do link..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isShortened"
                name="isShortened"
                checked={formData.isShortened}
                onChange={handleChange}
                className="cursor-pointer h-4 w-4 text-purple-400 focus:ring-purple-500 border-gray-600 rounded"
              />
              <label
                htmlFor="isShortened"
                className="ml-2 block text-sm text-gray-300"
              >
                Encurtar URL
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-4 bg-gray-800 pb-4 -mx-6 px-6">
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-purple-600  text-white rounded-lg hover:bg-purple-700 shadow-md transition-all"
              >
                {linkToEdit ? "Atualizar Link" : "Salvar Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LinkForm