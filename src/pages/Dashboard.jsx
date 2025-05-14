import { useState, useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';

import LinkCard from '../components/Dashboard/LinkCard';
import LinkForm from '../components/Dashboard/LinkForm';
import NoteForm from '../components/Dashboard/NoteForm';
import NoteCard from '../components/Dashboard/NoteCard';
import TodoCard from '../components/Dashboard/TodoCard';
import TodoForm from '../components/Dashboard/TodoForm';
import ImageCard from '../components/Dashboard/ImageCard';
import ImageForm from '../components/Dashboard/ImageForm';
import NewItemModal from '../components/Shared/NewItemModal';
import SearchBar from '../components/Dashboard/SearchBar';
import UserMenu from '../components/Dashboard/UserMenu';

import { FiPlus, FiLink, FiFileText, FiCheckSquare, FiImage as FiImageIcon } from 'react-icons/fi';
import Button from '../components/Shared/Button';
import { toast } from 'sonner';


export default function Dashboard() {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  const [showLinkForm, setShowLinkForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [imageToEdit, setImageToEdit] = useState(null);

  const [activeSection, setActiveSection] = useState('links');
  
  const { 
    userLinks = [], 
    userNotes = [], 
    addLink = () => {}, 
    updateLink = () => {}, 
    deleteLink = () => {}, 
    addNote = () => {}, 
    updateNote = () => {}, 
    deleteNote = () => {},
    userTodos = [],
    userImages = [],
    addTodo,
    updateTodo,
    deleteTodo,
    addImage,
    deleteImage,
    updateImage,
    addTask,
    deleteTask 
  } = useContext(AuthContext) || {};
  
  const filteredItems = useMemo(() => {
    let items = [];
  
    if (searchType === 'all' || searchType === 'links') {
      items.push(...userLinks.map(item => ({ ...item, type: 'link' })));
    }
    
    if (searchType === 'all' || searchType === 'notes') {
      items.push(...userNotes.map(item => ({ ...item, type: 'note' })));
    }

    if (searchType === 'all' || searchType === 'todos') {
      items.push(...userTodos.map(item => ({ ...item, type: 'todo' })));
    }

    if (searchType === 'all' || searchType === 'images') {
      items.push(...userImages.map(item => ({ ...item, type: 'image' })));
    }
    
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
  return items.filter(item => {
    if (item.title?.toLowerCase().includes(query)) return true;
    
    if (item.description?.toLowerCase().includes(query)) return true;
    
    switch(item.type) {
      case 'link':
        return item.url?.toLowerCase().includes(query);
      case 'note':
        return item.content?.toLowerCase().includes(query);
      case 'todo':
        return item.tasks?.some(task => 
          task.text.toLowerCase().includes(query)
        );
      case 'image':
        return item.description?.toLowerCase().includes(query);
      default:
        return false;
    }
  });
}, [userLinks, userNotes, userTodos, userImages, searchQuery, searchType]);

  useEffect(() => {
    document.title = 'LinkStash | Dashboard';
  }, []);

  const handleSaveTodo = async (todoData) => {
    try {
      if (todoToEdit) {
        await updateTodo(todoToEdit.id, todoData);
        toast.success('Tarefa atualizada com sucesso!');
      } else {
        await addTodo(todoData);
        toast.success('Tarefa criada com sucesso!');
      }
      setShowTodoForm(false);
      setTodoToEdit(null);
    } catch (error) {
      toast.error('Erro ao salvar tarefa', error);
    }
  };
  
  const handleToggleComplete = async (todoId, taskIndex, completed) => {
    try {
      const todo = userTodos.find(t => t.id === todoId);
      if (!todo) return;
  
      const updatedTasks = [...todo.tasks];
      
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        completed
      };
  
      await updateTodo(todoId, { tasks: updatedTasks });
      
      toast.success(`Tarefa marcada como ${completed ? 'concluída' : 'pendente'}`);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const getTypeName = (type, plural = false) => {
    switch(type) {
      case 'links': return plural ? 'links' : 'link';
      case 'notes': return plural ? 'notas' : 'nota';
      case 'todos': return plural ? 'tarefas' : 'tarefa';
      case 'images': return plural ? 'imagens' : 'imagem';
      default: return plural ? 'itens' : 'item';
    }
  };

  const handleAddTask = async (todoId, taskText) => {
    try {
      await addTask(todoId, taskText);
      toast.success('Tarefa adicionada com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar tarefa', error);
    }
  };

  const handleDeleteTask = async (todoId, taskIndex) => {
    try {
      const success = await deleteTask(todoId, taskIndex);
      if (success) {
        userTodos(prevTodos => 
          prevTodos.map(todo => 
            todo.id === todoId 
              ? { 
                  ...todo, 
                  tasks: todo.tasks.filter((_, index) => index !== taskIndex) 
                } 
              : todo
          )
        );
      }
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };
  
  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId);
      toast.success('Tarefa excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir tarefa', error);
    }
  };
  
  const handleSaveImage = async (formData) => {
    try {
      const dataToSave = {
        title: formData.title,
        description: formData.description || '',
        cardColor: formData.cardColor || '#7c3aed',
        updatedAt: new Date().toISOString(),
        imageData: formData.imageData
      };
  
      if (imageToEdit) {
        await updateImage(imageToEdit.id, dataToSave);
        toast.success('Imagem atualizada com sucesso!');
      } else {
        await addImage({
          ...dataToSave,
          createdAt: new Date().toISOString()
        });
        toast.success('Imagem salva com sucesso!');
      }
  
      setShowImageForm(false);
      setImageToEdit(null);
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    }
  };
  
  const handleDeleteImage = async (imageId) => {
    try {
      await deleteImage(imageId);
      toast.success('Imagem excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir imagem', error);
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      await deleteLink(linkId);
      toast.success('Link deletado com sucesso!');
    } catch (error) {
      toast.error('Erro ao deletar link',error);
    }
  };

  const handleSaveLink = async (linkData) => {
    try {
      if (linkToEdit) {
        await updateLink(linkToEdit.id, linkData);
        toast.success('Link atualizado com sucesso!');
      } else {
        await addLink(linkData);
        toast.success('Link salvo com sucesso!');
      }
      setShowLinkForm(false);
      setLinkToEdit(null);
    } catch (error) {
      toast.error('Erro ao salvar link',error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      toast.success('Nota deletada com sucesso!');
    } catch (error) {
      toast.error('Erro ao deletar nota',error);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (noteToEdit) {
        await updateNote(noteToEdit.id, noteData);
        toast.success('Nota atualizada com sucesso!');
      } else {
        await addNote(noteData);
        toast.success('Nota salva com sucesso!');
      }
      setShowNoteForm(false);
      setNoteToEdit(null);
    } catch (error) {
      toast.error('Erro ao salvar nota',error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const linksCount = userLinks?.length || 0;
  const notesCount = userNotes?.length || 0;
  const imagesCount = userImages?.length || 0;
  const todoCount = userTodos?.length || 0;
  const filteredCount = filteredItems?.length || 0;

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FiLink className="h-8 w-8 text-purple-400" />
                <span className="ml-2 text-xl font-bold text-white">LinkStash</span>
              </div>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <SearchBar 
                onSearch={handleSearch}
                onClear={handleClearSearch}
                searchQuery={searchQuery}
                searchType={searchType}
                onTypeChange={setSearchType}
                setActiveSection={setActiveSection}
              />
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      
      <div className="md:hidden p-4">
        <SearchBar 
          onSearch={handleSearch}
          onClear={handleClearSearch}
          searchQuery={searchQuery}
          searchType={searchType}
          onTypeChange={setSearchType}
          setActiveSection={setActiveSection}
        />
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start flex-col sm:flex-row mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Seus Itens</h1>
            <p className="text-gray-400 break-all">
              {filteredCount} {filteredCount === 1 ? 'item' : 'itens'} encontrados
              {searchQuery && ` para "${searchQuery}"`}
              {searchType !== 'all'}
            </p>
          </div>
          
          <Button
            onClick={() => setShowNewItemModal(true)}
            icon={FiPlus}
            className='w-full sm:w-auto'
          >
            Novo Item
          </Button>
        </div>
        
        {filteredCount === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              {searchType === 'links' ? (
                <FiLink className="text-4xl text-gray-500" />
                  ) : searchType === 'notes' ? (
                    <FiFileText className="text-4xl text-gray-500" />
                  ) : searchType === 'todos' ? (
                    <FiCheckSquare className="text-4xl text-gray-500" />
                  ) : searchType === 'images' ? (
                    <FiImageIcon className="text-4xl text-gray-500" />
                  ) : (
                <>
                  <FiLink className="text-4xl text-purple-500 mr-2" />
                  <FiFileText className="text-4xl text-purple-500 mr-2" />
                  <FiCheckSquare className="text-4xl text-purple-500 mr-2" />
                  <FiImageIcon className="text-4xl text-purple-500" />
                </>
              )}
            </div>
            <div className="mb-6 border-b border-gray-700">

              <nav className="hidden md:flex -mb-px space-x-8">
                {[
                  { id: 'links', label: 'Links', icon: <FiLink />, count: linksCount },
                  { id: 'notes', label: 'Notas', icon: <FiFileText />, count: notesCount },
                  { id: 'todos', label: 'Tarefas', icon: <FiCheckSquare />, count: todoCount },
                  { id: 'images', label: 'Imagens', icon: <FiImageIcon />, count: imagesCount },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveSection(tab.id);
                      setSearchType(tab.id);
                    }}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeSection === tab.id
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="md:hidden py-2 px-1">
                <select
                  value={activeSection}
                  onChange={(e) => {
                    setActiveSection(e.target.value);
                    setSearchType(e.target.value);
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md bg-gray-700 text-white"
                >
                  {[
                    { id: 'links', label: 'Links' },
                    { id: 'notes', label: 'Notas' },
                    { id: 'todos', label: 'Tarefas' },
                    { id: 'images', label: 'Imagens' },
                  ].map((tab) => (
                    <option 
                      key={tab.id} 
                      value={tab.id}
                      className="bg-gray-700 text-white"
                    >
                      {tab.label} {tab.id === 'links' && linksCount > 0 ? `(${linksCount})` : ''}
                      {tab.id === 'notes' && notesCount > 0 ? `(${notesCount})` : ''}
                      {tab.id === 'todos' && todoCount > 0 ? `(${todoCount})` : ''}
                      {tab.id === 'images' && imagesCount > 0 ? `(${imagesCount})` : ''}
                    </option>
                  ))}
                </select>
              </div>
          </div>

          <h3 className="text-lg font-medium text-white">
            {searchType === 'all' 
              ? 'Nenhum item encontrado'
              : `Nenhum ${getTypeName(searchType)} encontrado`}
          </h3>
          <p className="mt-1 text-sm text-gray-400 break-all">
            {searchQuery 
              ? `Nenhum resultado para "${searchQuery}"`
              : `Você ainda não tem ${getTypeName(searchType, true)}`}
          </p>
            <Button 
              onClick={() => setShowNewItemModal(true)}
              className="mt-4"
            >
              Novo Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {filteredItems.map((item) => {
              switch(item.type) {
                case 'link':
                  return (
                    <LinkCard
                      key={`link-${item.id}`}
                      link={item}
                      onEdit={(link) => {
                        setLinkToEdit(link);
                        setShowLinkForm(true);
                      }}
                      onDelete={handleDeleteLink}
                    />
                  );
                case 'note':
                  return (
                    <NoteCard
                      key={`note-${item.id}`}
                      note={item}
                      onEdit={(note) => {
                        setNoteToEdit(note);
                        setShowNoteForm(true);
                      }}
                      onDelete={handleDeleteNote}
                    />
                  );
                case 'todo':
                  return (
                    <TodoCard
                      key={`todo-${item.id}`}
                      todo={item}
                      onEdit={(todo) => {
                        setTodoToEdit(todo);
                        setShowTodoForm(true);
                      }}
                      onDelete={handleDeleteTodo}
                      onToggleComplete={handleToggleComplete}
                      onAddTask={handleAddTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  );
                case 'image':
                  return (
                    <ImageCard
                      key={`image-${item.id}`}
                      image={item}
                      onDelete={handleDeleteImage}
                      onEdit={(image) => {
                        console.log(image);
                        setImageToEdit(image);
                        setShowImageForm(true);
                      }}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        )}
      </main>
      
      <NewItemModal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}

        onSelectLink={() => {
          setShowNewItemModal(false);
          setShowLinkForm(true);
          setLinkToEdit(null);
        }}

        onSelectNote={() => {
          setShowNewItemModal(false);
          setShowNoteForm(true);
          setNoteToEdit(null);
        }}

        onSelectTodo={() => {
          setShowNewItemModal(false);
          setShowTodoForm(true);
          setTodoToEdit(null);
        }}

        onSelectImage={() => {
          setShowNewItemModal(false);
          setShowImageForm(true);
          setImageToEdit(null);
        }}
      />
      
      {showLinkForm && (
        <LinkForm
          linkToEdit={linkToEdit}
          onSave={handleSaveLink}
          onCancel={() => {
            setShowLinkForm(false);
            setLinkToEdit(null);
          }}
        />
      )}
      
      {showNoteForm && (
        <NoteForm
          noteToEdit={noteToEdit}
          onSave={handleSaveNote}
          onCancel={() => {
            setShowNoteForm(false);
            setNoteToEdit(null);
          }}
        />
      )}

      {showTodoForm && (
        <TodoForm
          todoToEdit={todoToEdit}
          onSave={handleSaveTodo}
          onCancel={() => {
            setShowTodoForm(false);
            setTodoToEdit(null);
          }}
        />
      )}

      {showImageForm && (
        <ImageForm
          imageToEdit={imageToEdit}
          onSave={handleSaveImage}
          onCancel={() => {
            setShowImageForm(false)
            setImageToEdit(null)
          }}
        />
      )}
    </div>
  );
}