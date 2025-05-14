import { useEffect, useContext, useState } from 'react';
import ConfirmationModal from '../components/Shared/ConfirmModal';
import { AuthContext } from '../contexts/AuthContext';
import UserMenu from '../components/Dashboard/UserMenu';
import { 
  FiBell, FiTrash2, FiUser, 
  FiMail, FiLink, FiLogOut, FiEye, FiEyeOff, FiCheckCircle, FiLock
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function PasswordChangeForm({ onChangePassword, onClose }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [visibility, setVisibility] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordRequirements = [
    { id: 'length', label: 'Mínimo 8 caracteres', test: (pwd) => pwd.length >= 8 },
    { id: 'upper', label: '1 letra maiúscula', test: (pwd) => /[A-Z]/.test(pwd) },
    { id: 'lower', label: '1 letra minúscula', test: (pwd) => /[a-z]/.test(pwd) },
    { id: 'number', label: '1 número', test: (pwd) => /\d/.test(pwd) },
    { id: 'special', label: '1 caractere especial', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  const validatePassword = (password) => {
    const requirementsMet = passwordRequirements.map(req => ({
      ...req,
      isValid: req.test(password)
    }));

    return {
      isValid: requirementsMet.every(req => req.isValid),
      requirements: requirementsMet
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field) => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    const { isValid } = validatePassword(newPassword);
    if (!isValid) {
      toast.error('A senha não atende aos requisitos de segurança');
      return;
    }

    setIsLoading(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      toast.success('Senha alterada com sucesso!');
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      let message = 'Erro ao alterar senha';
      switch (error.code) {
        case 'auth/wrong-password':
          message = 'Senha atual incorreta';
          break;
        case 'auth/weak-password':
          message = 'A nova senha é muito fraca';
          break;
        case 'auth/requires-recent-login':
          message = 'Sessão expirada. Faça login novamente';
          break;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const { requirements } = validatePassword(formData.newPassword);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 mb-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Alterar Senha</h3>
        <button 
          onClick={onClose}
          className="text-2xl cursor-pointer text-gray-400 hover:text-gray-300"
        >
          &times;
        </button>
      </div>
      
      {success ? (
        <div className="bg-green-900/20 text-green-400 p-4 rounded-lg flex items-center">
          <FiCheckCircle className="mr-2" />
          Senha alterada com sucesso!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Senha Atual
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                name="currentPassword"
                type={visibility.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => toggleVisibility('current')}
              >
                {visibility.current ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Nova Senha
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={visibility.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => toggleVisibility('new')}
              >
                {visibility.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            
            {formData.newPassword && (
              <div className="mt-2 text-sm">
                <p className="text-gray-400 mb-1">A senha deve conter:</p>
                <ul className="space-y-1">
                  {requirements.map((req) => (
                    <li 
                      key={req.id}
                      className={`flex items-center ${req.isValid ? 'text-green-400' : 'text-gray-400'}`}
                    >
                      {req.isValid ? '✓' : '•'} {req.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={visibility.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => toggleVisibility('confirm')}
              >
                {visibility.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Alterando...
                </>
              ) : (
                'Alterar Senha'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser, logout, changePassword, deleteAccount } = useContext(AuthContext);
  // const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // const [emailUpdates, setEmailUpdates] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    document.title = 'LinkStash | Configurações';
  }, []);

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };
  
  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    setShowDeleteModal(false);
  
    try {
      const success = await deleteAccount();
      
      if (!success) {
        throw new Error('Falha ao deletar conta no servidor');
      }
  
      localStorage.removeItem('linkstash-user');
      localStorage.removeItem('linkstash-users');

      await logout();
      
      navigate('/');
      
      toast.success('Conta deletada com sucesso!');
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      toast.error(error.message || 'Erro ao deletar conta');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
        title="Deletar conta"
        message="Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita."
        confirmText={isDeleting ? "Deletando..." : "Deletar Conta"}
        confirmColor="bg-red-500 hover:bg-red-600"
      />

      <header className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer"
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
        <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Configurações</h1>
            
            {/* <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notificações</h2>
              
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FiBell className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Ativar notificações</span>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FiMail className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Atualizações por e-mail</span>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailUpdates}
                      onChange={() => setEmailUpdates(!emailUpdates)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div> */}
            
            <div className="mb-8">
              <h2 className="text-lg font-medium text-white mb-4">Conta</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FiUser className="h-5 w-5 text-purple-400 mr-3" />
                    <span className="text-gray-300">Logado como {currentUser?.email}</span>
                  </div>
                  
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 rounded flex items-center"
                  >
                    <FiLock className="mr-2" />
                    Alterar Senha
                  </button>
                  
                  {showPasswordForm && (
                    <PasswordChangeForm 
                      onChangePassword={changePassword} 
                      onClose={() => setShowPasswordForm(false)}
                    />
                  )}

                  <button
                    onClick={logout}
                    className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 rounded flex items-center"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                  
                </div>
              </div>
            </div>
            
            <div>
              <div className="rounded-lg p-4 border" style={
                {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.2)'
                }
              }>
                <div className="flex items-center justify-between flex-col md:flex-row">
                  <div className="w-full">
                    <h3 className="font-medium text-red-400">Deletar Conta</h3>
                    <p className="text-sm" style={
                      { color: 'rgba(239, 68, 68, 0.8)' }
                    }>
                      Isso excluirá permanentemente sua conta e todos os seus dados.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="cursor-pointer w-full md:w-[13rem] py-1 bg-red-600 text-white mt-5 md:mt-0 rounded-lg hover:bg-red-700 flex items-center justify-center disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deletando...
                      </>
                    ) : (
                      <>
                        <FiTrash2 className="mr-2" />
                        Deletar Conta
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}