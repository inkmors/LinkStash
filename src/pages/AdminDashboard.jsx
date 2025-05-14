import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  FiUsers, 
  FiLink, 
  FiFileText,
  FiSettings, 
  FiAlertTriangle, 
  FiRefreshCw, 
  FiHome,
  FiChevronRight,
  FiTrash2,
  FiStar,
  FiCheckSquare,
  FiImage,
  FiList,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';
import { collection, query, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ConfirmationModal from '../components/Shared/ConfirmModal';
import Button from '../components/Shared/Button';
import { toast } from 'sonner';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [images, setImages] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newAdminStatus, setNewAdminStatus] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);
  
  const [activeTab, setActiveTab] = useState('users');

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (err) {
      setError('Erro ao carregar usuários');
      toast.error('Erro ao carregar usuários', err);
    }
  };

  const fetchLinks = async () => {
    try {
      const linksQuery = query(collection(db, 'links'));
      const linksSnapshot = await getDocs(linksQuery);
      const linksData = linksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLinks(linksData);
    } catch (err) {
      setError('Erro ao carregar links');
      toast.error('Erro ao carregar links', err);
    }
  };

  const fetchNotes = async () => {
    try {
      const notesQuery = query(collection(db, 'notes'));
      const notesSnapshot = await getDocs(notesQuery);
      const notesData = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
    } catch (err) {
      setError('Erro ao carregar notas');
      toast.error('Erro ao carregar notas', err);
    }
  };

  const fetchTodos = async () => {
    try {
      const todosQuery = query(collection(db, 'todos'));
      const todosSnapshot = await getDocs(todosQuery);
      const todosData = todosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todosData);
    } catch (err) {
      setError('Erro ao carregar tarefas');
      toast.error('Erro ao carregar tarefas', err);
    }
  };

  const fetchImages = async () => {
    try {
      const imagesQuery = query(collection(db, 'images'));
      const imagesSnapshot = await getDocs(imagesQuery);
      const imagesData = imagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(imagesData);
    } catch (err) {
      setError('Erro ao carregar imagens');
      toast.error('Erro ao carregar imagens', err);
    }
  };

  useEffect(() => {
    document.title = 'LinkStash | Admin';
    
    if (currentUser?.isAdmin) {
      const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          await Promise.all([
            fetchUsers(), 
            fetchLinks(), 
            fetchNotes(),
            fetchTodos(),
            fetchImages()
          ]);
        } catch (err) {
          setError('Erro ao carregar dados');
          toast.error('Erro ao carregar dados', err);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize)
    };

  }, [currentUser]);

  const tabOptions = [
    { value: 'users', label: 'Usuários', icon: <FiUsers className="mr-2" />, count: users.length },
    { value: 'links', label: 'Links', icon: <FiLink className="mr-2" />, count: links.length },
    { value: 'notes', label: 'Notas', icon: <FiFileText className="mr-2" />, count: notes.length },
    { value: 'todos', label: 'Tarefas', icon: <FiCheckSquare className="mr-2" />, count: todos.length },
    { value: 'images', label: 'Imagens', icon: <FiImage className="mr-2" />, count: images.length }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'users') {
        await fetchUsers();
      } else if (activeTab === 'links') {
        await fetchLinks();
      } else if (activeTab === 'notes') {
        await fetchNotes();
      } else if (activeTab === 'todos') {
        await fetchTodos();
      } else {
        await fetchImages();
      }
    } catch (err) {
      setError('Erro ao atualizar dados');
      toast.error('Erro ao atualizar dados', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (activeTab === 'users') {
        await deleteDoc(doc(db, 'users', selectedItem.id));
        setUsers(users.filter(user => user.id !== selectedItem.id));
        toast.success('Usuário excluído com sucesso!');
      } else if (activeTab === 'links') {
        await deleteDoc(doc(db, 'links', selectedItem.id));
        setLinks(links.filter(link => link.id !== selectedItem.id));
        toast.success('Link excluído com sucesso!');
      } else if (activeTab === 'notes') {
        await deleteDoc(doc(db, 'notes', selectedItem.id));
        setNotes(notes.filter(note => note.id !== selectedItem.id));
        toast.success('Nota excluída com sucesso!');
      } else if (activeTab === 'todos') {
        await deleteDoc(doc(db, 'todos', selectedItem.id));
        setTodos(todos.filter(todo => todo.id !== selectedItem.id));
        toast.success('Lista de tarefas excluída com sucesso!');
      } else if (activeTab === 'images') {
        await deleteDoc(doc(db, 'images', selectedItem.id));
        setImages(images.filter(image => image.id !== selectedItem.id));
        toast.success('Imagem excluída com sucesso!');
      }
    } catch (err) {
      setError('Erro ao excluir item');
      toast.error('Erro ao excluir item', err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    if (!currentUser?.isOwner) {
      toast.warning('Apenas o Owner pode alterar privilégios de admin');
      return;
    }

    if (userId === currentUser.uid) {
      toast.warning('Você não pode alterar seus próprios privilégios');
      return;
    }

    setUserToUpdate(userId);
    setNewAdminStatus(!currentStatus);
    setShowAdminModal(true);
  };

  const confirmAdminChange = async () => {
    try {
      setUpdatingUser(userToUpdate);
      const userRef = doc(db, 'users', userToUpdate);
      await updateDoc(userRef, {
        isAdmin: newAdminStatus
      });
      
      setUsers(users.map(user => 
        user.id === userToUpdate ? {...user, isAdmin: newAdminStatus} : user
      ));
      
      toast.success(`Usuário ${newAdminStatus ? 'promovido a admin' : 'rebaixado a usuário'} com sucesso!`);
    } catch (err) {
      setError('Erro ao atualizar status de admin');
      toast.error('Erro ao atualizar status de admin', err);
    } finally {
      setUpdatingUser(null);
      setShowAdminModal(false);
      setUserToUpdate(null);
    }
  };

  const barChartData = {
    labels: ['Usuários', 'Links', 'Notas', 'Tarefas', 'Imagens'],
    datasets: [
      {
        label: 'Itens',
        data: [users.length, links.length, notes.length, todos.length, images.length],
        backgroundColor: [
          'rgba(91, 33, 182, 0.7)',
          'rgba(30, 64, 175, 0.7)', 
          'rgba(131, 24, 67, 0.7)',
          'rgba(29, 78, 52, 0.7)',  
          'rgba(49, 46, 129, 0.7)'  
        ],
        borderColor: [
          'rgba(91, 33, 182, 1)',  
          'rgba(30, 64, 175, 1)',    
          'rgba(157, 23, 77, 1)',   
          'rgba(22, 163, 74, 1)',  
          'rgba(55, 48, 129, 1)'   
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Admin', 'Usuários'],
    datasets: [
      {
        data: [users.filter(u => u.isAdmin).length, users.filter(u => !u.isAdmin).length],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(76, 29, 149, 0.7)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(76, 29, 149, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  if (!currentUser?.isAdmin && !currentUser?.isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-lg max-w-md w-full text-center">
          <FiAlertTriangle className="h-16 w-16 text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-gray-400 mb-6">
            Você não tem permissão para acessar esta página. Apenas administradores podem visualizar este conteúdo.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Voltar à Página Inicial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  {currentUser.isOwner ? (
                    <FiStar className="h-5 w-5 md:h-8 md:w-8 text-yellow-500" />
                  ) : (
                    <FiSettings className="h-5 w-5 md:h-8 md:w-8 text-purple-400" />
                  )}
                  <span className="ml-2 text-sm md:text-xl font-bold text-white">
                    Painel Admin {currentUser.isOwner && '(Owner)'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="small"
                icon={FiRefreshCw}
                className={isLoading ? 'animate-spin' : ''}
                disabled={isLoading}
              >
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="cursor-pointer inline-flex items-center text-sm font-medium text-gray-400 hover:text-white"
              >
                <FiHome className="mr-2" />
                Dashboard
              </button>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <FiChevronRight className="text-gray-400" />
                <span className="ml-1 text-sm font-medium text-purple-400">
                  Painel Admin
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <FiAlertTriangle className="mr-2" />
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#5B21B64D] p-6 rounded-xl border border-[#5B21B680] shadow-lg hover:shadow-[#A855F71A] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">Total Usuários</p>
                <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
              </div>
              <div className="p-3 rounded-full bg-[#6b21a84D]">
                <FiUsers className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#1E40AF4D] p-6 rounded-xl border border-[#1E40AF80] shadow-lg hover:shadow-[#3B82F61A] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Total Links</p>
                <p className="text-2xl font-bold text-white mt-1">{links.length}</p>
              </div>
              <div className="p-3 rounded-full bg-[#1D4ED84D]">
                <FiLink className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#83184380] p-6 rounded-xl border border-[#9D174D80] shadow-lg hover:shadow-[#EC48991A] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-300">Total Notas</p>
                <p className="text-2xl font-bold text-white mt-1">{notes.length}</p>
              </div>
              <div className="p-3 rounded-full bg-[#BE185D4D]">
                <FiFileText className="h-6 w-6 text-pink-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#312E8180] p-6 rounded-xl border border-[#3730A380] shadow-lg hover:shadow-[#6366F11A] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-300">Total Imagens</p>
                <p className="text-2xl font-bold text-white mt-1">{images.length}</p>
              </div>
              <div className="p-3 rounded-full bg-[#4338CA4D]">
                <FiImage className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#1D4E3180] p-6 rounded-xl border border-[#16653480] shadow-lg hover:shadow-[#16A34A1A] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Total Tarefas</p>
                <p className="text-2xl font-bold text-white mt-1">{todos.length}</p>
              </div>
              <div className="p-3 rounded-full bg-[#16A34A4D]">
                <FiList className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1F293780] p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex items-center mb-4">
              <FiBarChart2 className="h-5 w-5 text-purple-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Distribuição de Conteúdo</h3>
            </div>
            <div className="h-64">
              <Bar 
                data={barChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: '#E5E7EB'
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: {
                        color: '#9CA3AF'
                      },
                      grid: {
                        color: '#374151'
                      }
                    },
                    x: {
                      ticks: {
                        color: '#9CA3AF'
                      },
                      grid: {
                        color: '#374151'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow">
            <div className="flex items-center mb-4">
              <FiPieChart className="h-5 w-5 text-purple-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Tipos de Usuários</h3>
            </div>
            <div className="h-64">
              <Pie 
                data={pieChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '60%',   
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: '#E5E7EB'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          {isMobile ? (
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white rounded-lg"
              >
                {tabOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8 overflow-x-auto pb-2">
                {tabOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setActiveTab(option.value)}
                    className={`${
                      activeTab === option.value
                        ? 'border-purple-500 text-purple-400'
                        : 'cursor-pointer border-transparent text-gray-400 hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    {option.icon}
                    {option.label} 
                    <span className="ml-1 bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {option.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={
                                  user.avatar ||
                                  `https://ui-avatars.com/api/?name=${user.name}&background=random`
                                }
                                alt={user.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {user.name}
                                {user.isOwner && (
                                  <span className="ml-2 text-yellow-500">
                                    <FiStar className="inline" /> Owner
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative group">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={user.isAdmin || false}
                                onChange={() => toggleAdminStatus(user.id, user.isAdmin)}
                                className="sr-only peer"
                                disabled={user.id === currentUser.uid || 
                                          updatingUser === user.id ||
                                          user.isOwner ||
                                          !currentUser.isOwner}
                              />
                              <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 ${user.isAdmin ? 'peer-checked:bg-purple-600' : ''}`}></div>
                              <span className="ml-3 text-sm font-medium text-gray-300">
                                {user.isAdmin ? 'Admin' : 'User'}
                              </span>
                            </label>
                            {user.id === currentUser.uid && (
                              <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded py-1 px-2 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                Você não pode alterar seus próprios privilégios
                              </span>
                            )}
                            {!currentUser.isOwner && (
                              <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded py-1 px-2 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                Apenas o Owner pode alterar privilégios
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedItem(user);
                              setShowDeleteModal(true);
                            }}
                            className="cursor-pointer text-red-400 hover:text-red-500 flex items-center"
                            disabled={user.id === currentUser.uid || user.isOwner}
                          >
                            <FiTrash2 className="mr-1" /> Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-400"
                      >
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'links' ? (
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Proprietário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {links.length > 0 ? (
                    links.map((link) => (
                      <tr key={link.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {link.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:underline"
                          >
                            {link.url.length > 30
                              ? `${link.url.substring(0, 30)}...`
                              : link.url}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {users.find((u) => u.id === link.userId)?.name || 'Desconhecido'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedItem(link);
                              setShowDeleteModal(true);
                            }}
                            className="cursor-pointer text-red-400 hover:text-red-500 flex items-center"
                          >
                            <FiTrash2 className="mr-1" /> Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-400"
                      >
                        Nenhum link encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'notes' ? (
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Conteúdo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Proprietário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {notes.length > 0 ? (
                    notes.map((note) => (
                      <tr key={note.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {note.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {note.content?.substring(0, 50)}{note.content?.length > 50 ? '...' : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {users.find((u) => u.id === note.userId)?.name || 'Desconhecido'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedItem(note);
                              setShowDeleteModal(true);
                            }}
                            className="cursor-pointer text-red-400 hover:text-red-500 flex items-center"
                          >
                            <FiTrash2 className="mr-1" /> Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-400"
                      >
                        Nenhuma nota encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'todos' ? (
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Tarefas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Proprietário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {todos.length > 0 ? (
                    todos.map((todo) => (
                      <tr key={todo.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {todo.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {todo.tasks?.filter(t => t.completed).length || 0}/{todo.tasks?.length || 0} completas
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {users.find((u) => u.id === todo.userId)?.name || 'Desconhecido'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedItem(todo);
                              setShowDeleteModal(true);
                            }}
                            className="cursor-pointer text-red-400 hover:text-red-500 flex items-center"
                          >
                            <FiTrash2 className="mr-1" /> Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-400"
                      >
                        Nenhuma lista de tarefas encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Visualização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Proprietário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {images.length > 0 ? (
                    images.map((image) => (
                      <tr key={image.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {image.title || 'Sem título'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-12 w-12 rounded overflow-hidden">
                            <img 
                              src={image.imageData} 
                              alt={image.title || 'Imagem'} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {users.find((u) => u.id === image.userId)?.name || 'Desconhecido'}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedItem(image);
                              setShowDeleteModal(true);
                            }}
                            className="cursor-pointer text-red-400 hover:text-red-500 flex items-center transition-colors"
                          >
                            <FiTrash2 className="mr-1" /> Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-400"
                      >
                        Nenhuma imagem encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={`Excluir ${
          activeTab === 'users' ? 'Usuário' : 
          activeTab === 'links' ? 'Link' : 
          activeTab === 'notes' ? 'Nota' :
          activeTab === 'todos' ? 'Lista de Tarefas' :
          'Imagem'
        }`}
        message={`Tem certeza que deseja excluir ${selectedItem?.title || selectedItem?.name || 'este item'}? Esta ação não pode ser desfeita.`}
      />

      <ConfirmationModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onConfirm={confirmAdminChange}
        title={`Alterar privilégios de administrador`}
        message={`Tem certeza que deseja ${newAdminStatus ? 'conceder' : 'remover'} privilégios de administrador para este usuário?`}
        confirmText={newAdminStatus ? 'Promover a Admin' : 'Rebaixar a Usuário'}
        confirmColor={newAdminStatus ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'}
      />
    </div>
  );
}