import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import UserMenu from '../components/Dashboard/UserMenu';
import { 
  FiUser, FiEdit2, FiCamera, FiLink, 
  FiGlobe, FiFileText, FiScissors, FiCheckSquare, FiImage as FiImageIcon
} from 'react-icons/fi';
import Button from '../components/Shared/Button';
import { BadgeList } from '../components/Shared/Badge';
import { BannerSelector } from '../components/Shared/BannerSelector';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BANNER_OPTIONS } from '../hooks/banners';

const MAX_IMAGE_SIZE = 1048576;

export default function Profile(){
  const navigate = useNavigate();

  const { currentUser, updateUser, userLinks, userNotes, userTodos, userImages } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false)
  const [showBannerSelector, setShowBannerSelector] = useState(false)
  const [editData, setEditData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    avatar: currentUser?.avatar || '',
    banner: currentUser?.banner || 'purple'
  })

  const handleBannerSelect = (bannerId) => {
    setEditData(prev => ({
      ...prev,
      banner: bannerId
    }));
    setShowBannerSelector(false);
  };
  
  const [avatarPreview, setAvatarPreview] = useState('')

  const calculateTimeBadges = (createdAt) => {
    if (!createdAt) return [];
    
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffYears = (now - createdDate) / (1000 * 60 * 60 * 24 * 365);
    
    const badges = [];
    
    if (diffYears >= 5) badges.push('FIVE_YEARS');
    else if (diffYears >= 2) badges.push('TWO_YEARS');
    else if (diffYears >= 1) badges.push('ONE_YEAR');
    else if (diffYears <= 0.1) badges.push('EARLY_ADOPTER');
    
    return badges;
  };

  const userBadges = [
    ...calculateTimeBadges(currentUser.createdAt),
    ...(currentUser.isAdmin ? ['STAFF'] : []),
    ...(currentUser.isOwner ? ['OWNER'] : []),
    ...(currentUser.isBetaTester ? ['BETA'] : []),
    ...(currentUser.isPremium ? ['PREMIUM'] : [])
  ];

  const diffYears = currentUser?.createdAt 
  ? (new Date() - new Date(currentUser.createdAt)) / (1000 * 60 * 60 * 24 * 365)
  : 0;

  useEffect(() => {
    document.title = 'LinkStash | Perfil'
    
    if (currentUser) {
      setEditData({
        name: currentUser.name,
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || '',
        banner: currentUser.banner 
      })
      setAvatarPreview(currentUser.avatar || '')
    }
  }, [currentUser])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if(!file) return

    if(file.size > MAX_IMAGE_SIZE) {
      toast.error('A imagem deve ter menos de 1MB')
      e.target.value = ''
      return
    }
      
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    try {
      const success = await updateUser({
        ...editData,
        avatar: avatarPreview || editData.avatar,
        banner: editData.banner
      })
      
      if (success) {
        setIsEditing(false)
        setShowBannerSelector(false)
        toast.success('Perfil atualizado com sucesso!')
      }
    } catch (error) {
      //console.error('Erro ao salvar perfil:', error)
      toast.error('Erro ao salvar perfil:', error);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Data desconhecida'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="p-4 text-center text-white">Carregando perfil...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      
      <header className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                <FiLink className="h-8 w-8 text-purple-400" />
                <span className="ml-2 text-xl font-bold text-white">LinkStash</span>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-700">

        
        <div className={`relative h-48 ${BANNER_OPTIONS.find(b => b.id === editData.banner)?.bgClass || 'bg-purple-600'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {isEditing && (
            <div className="absolute bottom-4 right-4 z-5">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBannerSelector(!showBannerSelector);
                }}
                variant="secondary"
                size="small"
              >
                Trocar Cor
              </Button>
              {showBannerSelector && (
                <div className="absolute right-0 bottom-full mb-2 z-10 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                  <BannerSelector 
                    currentBanner={editData.banner} 
                    onSelect={handleBannerSelect}
                  />
                </div>
              )}
            </div>
          )}
        </div>
          
          <div className="px-6 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20">
                <div className="relative group">
                  <img 
                    src={avatarPreview || currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=7c3aed&color=fff`}
                    alt={currentUser.name}
                    className="h-40 w-40 rounded-full border-4 border-gray-800 object-cover shadow-lg"
                  />
                  {isEditing && (
                    <label className="absolute bottom-4 right-4 bg-gray-700 p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-600 transition-colors">
                      <FiCamera className="h-5 w-5 text-gray-300" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <div className="space-y-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="text-3xl font-bold text-white bg-transparent border-b border-gray-600 focus:outline-none focus:border-purple-500 w-full"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-white">{currentUser.name}</h1>
                  )}
                  
                  <div className="flex items-center text-gray-400">
                    <FiUser className="mr-2" />
                    <span>Membro desde {formatDate(currentUser.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {isEditing ? (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="secondary"
                      size="medium"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      variant="primary"
                      size="medium"
                    >
                      Salvar alterações
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="secondary"
                    size="medium"
                    icon={FiEdit2}
                  >
                    Editar perfil
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              {isEditing ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Biografia</label>
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleEditChange}
                    placeholder="Fale um pouco sobre você..."
                    className="resize-none w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="5"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Biografia</h3>
                  <p className={`text-gray-300 ${!currentUser.bio && 'italic text-gray-500'}`}>
                    {currentUser.bio || 'Nenhuma biografia adicionada ainda.'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap gap-3 items-center">
                {userBadges.length > 0 ? (
                  <BadgeList
                  user={currentUser} 
                  badges={userBadges} 
                  size="medium" />
                ) : (
                  <p className="text-gray-400 italic">Nenhuma badge ainda</p>
                )}
              </div>
              
              {calculateTimeBadges(currentUser?.createdAt).length === 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-400 mb-1">
                    Próxima badge: Veterano (1 ano)
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (diffYears / 1) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-bold text-white mb-6">Estatísticas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard 
                  icon={<FiLink className="h-6 w-6" />}
                  value={userLinks.length}
                  label="Links salvos"
                  color="purple"
                />
                
                <StatCard 
                  icon={<FiScissors className="h-6 w-6" />}
                  value={userLinks.filter(l => l?.isShortened).length}
                  label="Links encurtados"
                  color="indigo"
                />

                <StatCard 
                  icon={<FiFileText className="h-6 w-6" />}
                  value={userNotes.length}
                  label="Notas criadas"
                  color="blue"
                />
                
                <StatCard 
                  icon={<FiGlobe className="h-6 w-6" />}
                  value={new Set(userLinks
                    .filter(link => link?.url)
                    .map(link => {
                      try {
                        return new URL(link.url).hostname
                      } catch {
                        return null
                      }
                    })
                    .filter(Boolean)
                  ).size}
                  label="Domínios únicos"
                  color="blue"
                />

                <StatCard 
                  icon={<FiCheckSquare className="h-6 w-6" />}
                  value={userTodos.length}
                  label="Tarefas salvas"
                  color="green"
                />

                <StatCard 
                  icon={<FiImageIcon className="h-6 w-6" />}
                  value={userImages.length}
                  label="Imagens salvas"
                  color="salmon"
                />
                
                {/* <StatCard 
                  icon={<FiFileText className="h-6 w-6" />}
                  value={userLinks.reduce((acc, link) => acc + (link?.description ? 1 : 0), 0)}
                  label="Links Com descrição"
                  color="pink"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const StatCard = ({ icon, value, label, color = 'purple' }) => {
  const colorClasses = {
    purple: 'bg-purple-900/30 text-purple-400',
    indigo: 'bg-indigo-900/30 text-indigo-400',
    blue: 'bg-blue-900/30 text-blue-400',
    pink: 'bg-pink-900/30 text-pink-400',
    green: 'bg-green-900/30 text-green-400',
    salmon: 'bg-pink-900/30 text-pink-400'
  }

  return (
    <div className="bg-gray-700 rounded-lg p-5 shadow-sm border border-gray-600">
      <div className={`${colorClasses[color]} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}