import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../../components/Shared/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const [ phone, setPhone ] = useState('');
  
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    
    const truncatedValue = rawValue.slice(0, 11);
    
    let formattedValue = '';
    if (truncatedValue.length > 0) {
      formattedValue = `(${truncatedValue.slice(0, 2)}`;
    }
    if (truncatedValue.length > 2) {
      formattedValue += `) ${truncatedValue.slice(2, 7)}`;
    }
    if (truncatedValue.length > 7) {
      formattedValue += `-${truncatedValue.slice(7, 11)}`;
    }
    
    setPhone(formattedValue);
  };

  useEffect(() => {
    document.title = 'Registro | LinkStash';

    setFormData(prev => ({
      ...prev,
      phone: phone.replace(/\D/g, '')
    }))
  }, [phone]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);


  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

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

    const score = requirementsMet.filter(req => req.isValid).length;
    setPasswordScore(score);

    return {
      isValid: requirementsMet.every(req => req.isValid),
      requirements: requirementsMet
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const toggleVisibility = (field) => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem. Por favor, tente novamente.");
      setLoading(false);
      return;
    }

    const { isValid } = validatePassword(formData.password);
    if (!isValid) {
      setError('A senha não atende aos requisitos de segurança');
      setLoading(false);
      return;
    }

    if (!formData.phone.match(/^(\+\d{1,3})?\d{10,15}$/)) {
      setError('Número de telefone inválido');
      setLoading(false);
      return;
    }

    const phoneNumbers = formData.phone.replace(/\D/g, '')
    if (phoneNumbers.length < 11) {
      setError('Número de telefone inválido, Digite DDD + número com 9 dígitos.');
      setLoading(false);
      return;
    }

    const success = await register(
      formData.name, 
      formData.email, 
      formData.password,
      formData.phone
    );
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Falha ao criar conta. Por favor, tente novamente.');
    }
    
    setLoading(false);
  };

  const getPasswordStrengthColor = () => {
    if (passwordScore <= 1) return 'bg-red-500';
    if (passwordScore <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordScore <= 1) return 'Fraca';
    if (passwordScore <= 3) return 'Média';
    return 'Forte';
  };

  return (
    <AuthLayout
      title="Criar uma conta"
      subtitle="Comece a organizar seus links agora!"
      footerText="Já possui uma conta?"	
      footerLink="/login"
      footerLinkText="Entrar"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="bg-red-900/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Nome Completo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            placeholder='Seu nome completo'
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder='Seu email'
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Telefone (com DDD)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Senha
            <span className="float-right text-xs font-normal text-gray-400">
              Força: <span className={`font-medium ${getPasswordStrengthColor().replace('bg-', 'text-')}`}>
                {getPasswordStrengthText()}
              </span>
            </span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={visibility.password ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder='Sua senha'
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              onClick={() => toggleVisibility('password')}
            >
              {visibility.password ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          
          {formData.password && (
            <div className="mt-2">
              <div className="w-full rounded-full h-1.5 bg-gray-700">
                <div 
                  className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`} 
                  style={{ width: `${(passwordScore / passwordRequirements.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="mt-2 text-xs text-gray-400">
                <p className="mb-1">A senha deve conter:</p>
                <ul className="grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req) => (
                    <li 
                      key={req.id}
                      className={`flex items-center ${req.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`}
                    >
                      {req.test(formData.password) ? '✓' : '•'} {req.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
            Confirmar Senha
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              name="confirmPassword"
              type={visibility.confirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              placeholder='Confirme sua senha'
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              onClick={() => toggleVisibility('confirmPassword')}
            >
              {visibility.confirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          className="w-full py-[0.8rem]"
        >
          Criar Conta
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;