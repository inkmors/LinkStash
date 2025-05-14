import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../../components/Shared/Button';
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '../../firebase';
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { toast } from 'sonner';

const Login = () => {
  useEffect(() => {
    document.title = 'Login | LinkStash';
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  const { currentUser, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const success = await login(email, password);
      
      if (!success) {
        throw new Error('Login falhou no contexto');
      }
      
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro no login:', error);
      let errorMessage = 'Email ou senha incorretos. Por favor, tente novamente.';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas falhas. Tente novamente mais tarde.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success(`Email de recuperação enviado para ${resetEmail}`);
      setShowForgotPassword(false);
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      
      let errorMessage = 'Erro ao enviar email de recuperação';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Nenhuma conta encontrada com este email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }
      
      toast.error(errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bem-vindo(a) de volta!"
      subtitle="Por favor, entre com suas credenciais."
      footerText="Não tem uma conta?"
      footerLink="/register"
      footerLinkText="Criar uma conta"
    >
      {!showForgotPassword ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center">
              <FiMail className="mr-2" />
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='********'
                  className="w-full pl-10 pr-10 px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 mb-5">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="cursor-pointer text-sm text-purple-400 hover:text-purple-300 font-medium"
            >
              Esqueceu sua senha?
            </button>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-full py-3.5 font-medium"
            iconRight={<FiArrowRight className="ml-2" />}
          >
            Entrar
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset} className="flex flex-col gap-7">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white">Recuperar senha</h3>
            <p className="mt-2 text-sm text-gray-400">
              Digite seu email para receber um link de recuperação
            </p>
          </div>

          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              loading={resetLoading}
              disabled={resetLoading}
            >
              Enviar Link
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => setShowForgotPassword(false)}
              disabled={resetLoading}
            >
              Voltar
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default Login;