/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from 'axios';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../../services/api';
import { IPaginatedResponse } from '../../types/global';
import {
  IUsersProviderContextData,
  NewUserInput,
  Permission,
  User,
} from './types';

const UsersContext = createContext({} as IUsersProviderContextData);

export const UsersProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [userEditing, setUserEditing] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchPermissions = async () => {
    try {
      const response = await api.get<Permission[]>('/permissions');
      setPermissions(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get<IPaginatedResponse<User>>(
        `/user?page=${page}`,
      );
      setUsers(response.data.result);
      setPages(response.data.lastPage);
    } catch (err) {
      console.log(err);
    }
  };

  const createUser = async (userData: NewUserInput) => {
    try {
      const response = await api.post<User>('/user', userData);
      setUsers([response.data, ...users]);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      } else {
        console.log(err);
      }
    }
  };

  const confirmEditUser = async (
    userData: Pick<NewUserInput, 'email' | 'name' | 'permissionId'> & {
      pass?: string;
    },
  ) => {
    try {
      const response = await api.patch<User>('/user', userData);
      setUsers(
        users.map((user) =>
          user.id !== response.data.id ? user : response.data,
        ),
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      } else {
        console.log(err);
      }
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await api.delete(`/user/${id}`);
      if (response.data.ok === 'ok') {
        setUsers(users.filter((user) => user.id !== id));
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      } else {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleEditUser = (user: User) => {
    setUserEditing(user);
    setShowForm(true);
  };

  const handleEditUserById = (userId: string) => {
    const user = users.find((_user) => _user.id === userId);
    setUserEditing(user ?? null);
    setShowForm(true);
  };

  const handleToggleShowForm = (open: boolean) => {
    setShowForm(open);
    !open && setUserEditing(null);
  };

  return (
    <UsersContext.Provider
      value={{
        permissions,
        users,
        createUser,
        deleteUser,
        showForm,
        editUser: handleEditUser,
        editUserById: handleEditUserById,
        toggleShowForm: handleToggleShowForm,
        userEditing,
        confirmEditUser,
        changePage: (page: number) => setPage(page),
        pages,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  return useContext(UsersContext);
};
