import React, { useState, createContext } from 'react';
import {
  fetchData,
  postData,
  readData,
  updateData,
  deleteData,
} from '../hooks/useFetchApi';

export interface AuthContextProps {
  user: string | null;
  userId: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  token: string | null;
  todoItems: string[];
  createTodo: (text: string, token: string) => void;
  fetchTodoData: () => void;
  getTodoData: (id: string, token: string) => Promise<any>;
  updateTodoData: (id: string, updatedText: string, token: string) => void;
  deleteTodoData: (id: string, token: string) => void;
  login: () => void;
  logout: () => void;
}

interface TodoData {
  user: {
    name: string;
  };

  todoList: string[];
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  userId: null,
  loading: false,
  isLoggedIn: false,
  token: null,
  todoItems: [],
  createTodo: () => {},
  fetchTodoData: () => {},
  getTodoData: () => Promise.resolve(),
  updateTodoData: () => {},
  deleteTodoData: () => {},
  login: () => {},
  logout: () => {},
});

export type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [todoItems, setTodoItems] = useState<string[]>([]);

  const createTodo = async (text: string, token: string) => {
    try {
      if (token) {
        await postData('/api/create', { text }, token);
        setLoading(true);
        fetchTodoData();
      }
    } catch (error) {
      console.log('🚀 createTodo ~ error:', error);
    }
  };

  const fetchTodoData = async () => {
    if (token) {
      const todoData: TodoData = await fetchData(`/api/read`, token);
      setUser(todoData.user.name);
      setTodoItems(todoData.todoList);
    }
  };

  const getTodoData = async (id: string, token: string): Promise<any> => {
    try {
      if (token) {
        let todoData = await readData(`/api/get/${id}`, token);
        return todoData;
      }
    } catch (error) {
      console.log('🚀 createTodo ~ error:', error);
    }
  };

  const updateTodoData = async (
    id: string,
    updatedText: string,
    token: string
  ) => {
    try {
      if (token) {
        await updateData(`/api/update/${id}`, { text: updatedText }, token);
        fetchTodoData();
      }
    } catch (error) {
      console.log('🚀 updateTodo ~ error:', error);
    }
  };

  const deleteTodoData = async (id: string, token: string): Promise<any> => {
    try {
      if (token) {
        await deleteData(`/api/delete/${id}`, token);
        fetchTodoData();
      }
    } catch (error) {
      console.log('🚀 createTodo ~ error:', error);
    }
  };

  const login = () => {
    if (localStorage.getItem('token')) {
      const localStorageValue = localStorage.getItem('token');
      const localValue = localStorageValue
        ? JSON.parse(localStorageValue)
        : null;

      setIsLoggedIn(true);
      setUserId(localValue.userId);
      setToken(localValue.token);

      if (Date.now() > localValue.expiryTime) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setToken('');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setToken('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        isLoggedIn,
        loading,
        token,
        createTodo,
        fetchTodoData,
        getTodoData,
        updateTodoData,
        deleteTodoData,
        todoItems,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
