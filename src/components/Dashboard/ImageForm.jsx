import { useState, useRef, useEffect } from 'react';
import { FiX, FiImage, FiUpload, FiCheck } from 'react-icons/fi';
import { toast } from 'sonner';

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

const ImageForm = ({ imageToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageData: '',
    cardColor: '#7c3aed'
  });
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const MAX_IMAGE_SIZE = 1048487;

  useEffect(() => {
    if (imageToEdit) {
      setFormData({
        title: imageToEdit.title || '',
        description: imageToEdit.description || '',
        imageData: '',
        cardColor: imageToEdit.cardColor || '#7c3aed'
      });
      if (imageToEdit.imageData) {
        setPreview(imageToEdit.imageData);
      }
    }
  }, [imageToEdit]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors({
        ...errors,
        imageData: 'A imagem deve ter menos de 1MB'
      });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData(prev => ({
        ...prev,
        imageData: reader.result
      }));
      setErrors({
        ...errors,
        imageData: ''
      });
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    
    if (!imageToEdit && !formData.imageData) {
      newErrors.imageData = 'A imagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.imageData) {
      toast.error('Selecione uma imagem para continuar');
      return;
    };
    
    if (!validate()) {
      if (!formData.title.trim()) {
        toast.error('O título é obrigatório');
      } else if (!imageToEdit && !formData.imageData) {
        toast.error('Selecione uma imagem para criar');
      }
      return;
    }
    onSave({
      ...formData,
      imageData: imageToEdit && !formData.imageData 
        ? imageToEdit.imageData 
        : formData.imageData
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center z-50 overflow-y-auto py-8">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 my-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {imageToEdit ? "Editar Imagem" : "Nova Imagem"}
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Título (opcional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Título da imagem"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="resize-none w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="3"
                placeholder="Descrição da imagem"
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
            
              <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-10">
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Imagem {!imageToEdit && <span className="text-red-500">*</span>}
              </label>
              
              {(preview || (imageToEdit?.imageData && !formData.imageData)) ? (
                <div className="relative group">
                  <img 
                    src={preview || imageToEdit.imageData} 
                    alt="Preview" 
                    className="w-full h-40 sm:h-48 object-cover rounded-lg border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <FiUpload className="mr-2" />
                    {preview ? 'Alterar Imagem' : 'Substituir Imagem'}
                  </button>
                </div>
              ) : formData.imageData ? (
                <div className="relative group">
                  <img 
                    src={formData.imageData} 
                    alt="Nova imagem selecionada" 
                    className="w-full h-40 sm:h-48 object-cover rounded-lg border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <FiUpload className="mr-2" />
                    Alterar Imagem
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-32 sm:h-48 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
                >
                  <FiImage className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2" />
                  <p className="text-gray-400 text-xs sm:text-sm text-center px-2">
                    {imageToEdit ? 'Clique para substituir a imagem' : 'Clique para selecionar uma imagem'}
                  </p>
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {errors.imageData && (
                <p className="mt-1 text-sm text-red-400">{errors.imageData}</p>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4  bg-gray-800 pb-4 -mx-6 px-6">
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`cursor-pointer px-4 py-2 rounded-lg shadow-md transition-colors ${
                  (!imageToEdit && !formData.imageData) || !formData.title
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                disabled={(!imageToEdit && !formData.imageData) || !formData.title}
              >
                {imageToEdit ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageForm;