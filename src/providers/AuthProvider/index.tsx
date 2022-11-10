import { AxiosError } from 'axios';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  IAuthProviderContextData,
  LoggedUser,
  LoginInput,
  LoginResponse,
} from './types';
import { toast } from 'react-toastify';

const AuthContext = createContext({} as IAuthProviderContextData);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoggedUser | null>(null);

  useEffect(() => {
    if (user) return;

    const localUser = localStorage.getItem('user');

    if (localUser) {
      setUser(JSON.parse(localUser));
      return;
    }

    const token = localStorage.getItem('token');
    const permissions: any[] = [];
    if (token) {
      api
        .get('/permissions')
        .then((response) => console.log(response.data))
        .catch((err) => console.log(err));

      api
        .get('/user/find')
        .then((response) => {
          const { email, name, id, permissionId } = response.data;
          const permission = permissions.find(
            (perm) => perm.id === permissionId,
          );
          setUser({
            email,
            id,
            name,
            permissionName: permission?.permission ?? 'SALER',
          });
          return;
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const login = (credentials: LoginInput, callback: VoidFunction) => {
    api
      .post<LoginResponse>('/login', {
        ...credentials,
      })
      .then((response) => {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        callback();
        navigate('/', { replace: true });
      })
      .catch((err: AxiosError) => {
        const { message } = err.response?.data as { message: string };
        toast(message, { type: 'error' });
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
