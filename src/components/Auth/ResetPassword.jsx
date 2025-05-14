import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, verifyPasswordResetCode, confirmPasswordReset } from '../../firebase';
import { toast } from 'sonner';
import AuthLayout from './AuthLayout';
import Button from '../../components/Shared/Button';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [email, setEmail] = useState('');

  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      toast.error('Link inválido');
      navigate('/login');
      return;
    }

    const verifyToken = async () => {
      try {

        const email = await verifyPasswordResetCode(auth, oobCode);
        setValidToken(true);
        setEmail(email);
      } catch (error) {
        toast.error('Link expirado ou inválido', error);
        navigate('/login');
      }
    };

    verifyToken();
  }, [oobCode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {

      await confirmPasswordReset(auth, oobCode, newPassword);
      
      toast.success(`Senha redefinida para ${email}`);
      navigate('/login');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Este link já foi usado ou expirou');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <AuthLayout title="Verificando link...">
        <div className="text-center py-8">
          <p className='text-white'>Validando seu link de segurança...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Redefinir Senha" subtitle={`Para ${email}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nova Senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
            minLength="8"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Confirmar Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <Button 
          type="submit" 
          loading={loading}
          className="cursor-pointer py-[0.8rem] w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Redefinir Senha
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;