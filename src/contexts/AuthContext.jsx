import { createContext, useState, useEffect, useCallback } from 'react';
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from '../firebase';
import { 
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLinks, setUserLinks] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [userTodos, setUserTodos] = useState([]);
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const loadUserLinks = useCallback(async (userId) => {
    const linksQuery = query(collection(db, 'links'), where('userId', '==', userId));
    const querySnapshot = await getDocs(linksQuery);
    const links = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUserLinks(links);
  }, []);

  const loadUserNotes = useCallback(async (userId) => {
    const notesQuery = query(collection(db, 'notes'), where('userId', '==', userId));
    const querySnapshot = await getDocs(notesQuery);
    const notes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUserNotes(notes);
  }, []);

  const loadUserTodos = useCallback(async (userId) => {
    const todosQuery = query(collection(db, 'todos'), where('userId', '==', userId));
    const querySnapshot = await getDocs(todosQuery);
    const todos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUserTodos(todos);
  }, []);

  const loadUserImages = useCallback(async (userId) => {
    const imagesQuery = query(collection(db, 'images'), where('userId', '==', userId));
    const querySnapshot = await getDocs(imagesQuery);
    const images = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUserImages(images);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            isAdmin: userData.isAdmin || false,
            isOwner: userData.isOwner || false,
            ...userData
          });
          
          await Promise.all([
            loadUserLinks(user.uid),
            loadUserNotes(user.uid),
            loadUserTodos(user.uid),
            loadUserImages(user.uid)
          ]);
        }
      } else {
        setCurrentUser(null);
        setUserLinks([]);
        setUserNotes([]);
        setUserTodos([]);
        setUserImages([]);
      }
      setLoading(false);
      setInitialCheckDone(true);
    });

    return unsubscribe;
  }, [loadUserLinks, loadUserNotes, loadUserTodos, loadUserImages]);

  const login = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        bio: '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff`,
        banner: 'gradient-purple',
        isAdmin: false,
        isOwner: false,
        isBetaTester: false,
        isPremium: false
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return false;
    }
  }, []);

  const updateUser = async (userData) => {
    if (!currentUser) return false;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const dataToUpdate = {
        name: userData.name,
        bio: userData.bio || null,
        avatar: userData.avatar || null,
        banner: userData.banner || 'gradient-purple'
      };

      Object.keys(dataToUpdate).forEach(key => {
        if (dataToUpdate[key] === undefined) {
          delete dataToUpdate[key];
        }
      });

      await updateDoc(userRef, dataToUpdate);
      setCurrentUser(prev => ({ ...prev, ...dataToUpdate }));
      return true;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("Nenhum usuário logado");
        return false;
      }

      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);
      await user.delete();
      return true;
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Por favor, faça login novamente para confirmar a exclusão');
      }
      throw new Error('Não foi possível deletar a conta no momento');
    }
  };

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!currentUser) {
      throw new Error("Usuário não autenticado");
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      return true;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      let errorMessage = "Erro ao alterar senha";
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = "Senha atual incorreta";
          break;
        case 'auth/weak-password':
          errorMessage = "A nova senha é muito fraca";
          break;
        case 'auth/requires-recent-login':
          errorMessage = "Sessão expirada. Faça login novamente";
          break;
      }
      throw new Error(errorMessage);
    }
  }, [currentUser]);

  const addLink = useCallback(async (linkData) => {
    if (!currentUser) return false;

    try {
      const docRef = await addDoc(collection(db, 'links'), {
        ...linkData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      });
      setUserLinks(prev => [...prev, { id: docRef.id, ...linkData }]);
      return true;
    } catch (error) {
      console.error("Erro ao adicionar link:", error);
      return false;
    }
  }, [currentUser]);

  const updateLink = useCallback(async (linkId, updatedData) => {
    try {
      await updateDoc(doc(db, 'links', linkId), updatedData);
      setUserLinks(prev => 
        prev.map(link => 
          link.id === linkId ? { ...link, ...updatedData } : link
        )
      );
      return true;
    } catch (error) {
      console.error("Erro ao atualizar link:", error);
      return false;
    }
  }, []);

  const deleteLink = useCallback(async (linkId) => {
    try {
      await deleteDoc(doc(db, 'links', linkId));
      setUserLinks(prev => prev.filter(link => link.id !== linkId));
      return true;
    } catch (error) {
      console.error("Erro ao deletar link:", error);
      return false;
    }
  }, []);

  const addNote = useCallback(async (noteData) => {
    if (!currentUser) return false;

    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        ...noteData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setUserNotes(prev => [...prev, { id: docRef.id, ...noteData }]);
      return true;
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
      return false;
    }
  }, [currentUser]);

  const updateNote = useCallback(async (noteId, updatedData) => {
    try {
      await updateDoc(doc(db, 'notes', noteId), {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      setUserNotes(prev => 
        prev.map(note => 
          note.id === noteId ? { ...note, ...updatedData } : note
        )
      );
      return true;
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
      return false;
    }
  }, []);

  const deleteNote = useCallback(async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      setUserNotes(prev => prev.filter(note => note.id !== noteId));
      return true;
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
      return false;
    }
  }, []);

  const addTodo = useCallback(async (todoData) => {
    if (!currentUser) return false;

    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        ...todoData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        tasks: todoData.tasks || []
      });
      setUserTodos(prev => [...prev, { id: docRef.id, ...todoData }]);
      return true;
    } catch (error) {
      console.error("Erro ao adicionar lista de tarefas:", error);
      return false;
    }
  }, [currentUser]);

  const addTask = useCallback(async (todoId, taskText) => {
    try {
      const todoRef = doc(db, 'todos', todoId);
      const todoDoc = await getDoc(todoRef);
      
      if (todoDoc.exists()) {
        const currentTasks = todoDoc.data().tasks || [];
        const updatedTasks = [...currentTasks, { text: taskText, completed: false }];
        
        await updateDoc(todoRef, { tasks: updatedTasks });
        setUserTodos(prev => prev.map(todo => 
          todo.id === todoId ? { ...todo, tasks: updatedTasks } : todo
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      return false;
    }
  }, []);

  const deleteTask = useCallback(async (todoId, taskIndex) => {
    try {
      const todoRef = doc(db, 'todos', todoId);
      const todoDoc = await getDoc(todoRef);
      
      if (todoDoc.exists()) {
        const currentTasks = todoDoc.data().tasks || [];
        const updatedTasks = currentTasks.filter((_, index) => index !== taskIndex);
        
        await updateDoc(todoRef, { tasks: updatedTasks });
        setUserTodos(prev => prev.map(todo => 
          todo.id === todoId ? { ...todo, tasks: updatedTasks } : todo
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      return false;
    }
  }, []);

  const toggleTask = useCallback(async (todoId, taskIndex, completed) => {
    try {
      const todoRef = doc(db, 'todos', todoId);
      const todoDoc = await getDoc(todoRef);
      
      if (todoDoc.exists()) {
        const currentTasks = todoDoc.data().tasks || [];
        const updatedTasks = [...currentTasks];
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          completed
        };
        
        await updateDoc(todoRef, { tasks: updatedTasks });
        setUserTodos(prev => prev.map(todo => 
          todo.id === todoId ? { ...todo, tasks: updatedTasks } : todo
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao alternar tarefa:", error);
      return false;
    }
  }, []);

  const updateTodo = useCallback(async (todoId, updatedData) => {
    try {
      await updateDoc(doc(db, 'todos', todoId), {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      setUserTodos(prev => 
        prev.map(todo => 
          todo.id === todoId ? { ...todo, ...updatedData } : todo
        )
      );
      return true;
    } catch (error) {
      console.error("Erro ao atualizar lista de tarefas:", error);
      return false;
    }
  }, []);

  const deleteTodo = useCallback(async (todoId) => {
    try {
      await deleteDoc(doc(db, 'todos', todoId));
      setUserTodos(prev => prev.filter(todo => todo.id !== todoId));
      return true;
    } catch (error) {
      console.error("Erro ao deletar lista de tarefas:", error);
      return false;
    }
  }, []);

  const addImage = useCallback(async (imageData) => {
    if (!currentUser) return false;

    try {
      const docRef = await addDoc(collection(db, 'images'), {
        ...imageData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      });
      setUserImages(prev => [...prev, { id: docRef.id, ...imageData }]);
      return true;
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error);
      return false;
    }
  }, [currentUser]);

  const updateImage = async (imageId, updatedData) => {
    try {
      const { id: _, userId: __, createdAt: ___, ...dataToUpdate } = updatedData;
      
      await updateDoc(doc(db, 'images', imageId), dataToUpdate);
      
      setUserImages(prev => prev.map(img => 
        img.id === imageId ? { 
          ...img,
          ...dataToUpdate,
          imageData: dataToUpdate.imageData || img.imageData
        } : img
      ));
      
      return true;
    } catch (error) {
      console.error('Erro detalhado:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      return false;
    }
  };

  const deleteImage = useCallback(async (imageId) => {
    try {
      await deleteDoc(doc(db, 'images', imageId));
      setUserImages(prev => prev.filter(image => image.id !== imageId));
      return true;
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      userLinks,
      userNotes,
      userTodos,
      userImages,
      loading,
      initialCheckDone,
      login,
      register,
      logout,
      updateUser,
      deleteAccount,
      changePassword,

      addLink,
      updateLink,
      deleteLink,

      addNote,
      updateNote,
      deleteNote,

      addTodo,
      updateTodo,
      deleteTodo,
      addTask,
      deleteTask,
      toggleTask,

      addImage,
      updateImage,
      deleteImage
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};