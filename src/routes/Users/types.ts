import { PermissionType } from '../../providers/AuthProvider/types';

interface IUsersProviderContextData {
  permissions: Permission[];
  users: User[];
  createUser: (userData: NewUserInput) => Promise<void>;
  confirmEditUser: (
    userData: Pick<NewUserInput, 'email' | 'name' | 'permissionId'>,
  ) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  editUser: (user: User) => void;
  editUserById: (userId: string) => void;
  showForm: boolean;
  toggleShowForm: (open: boolean) => void;
  userEditing: null | User;
  changePage: (page: number) => void;
  pages: number;
}

export type Permission = {
  created_at: string;
  id: string;
  permission: PermissionType;
  updated_at: string;
};

export type User = {
  created_at: string;
  email: string;
  id: string;
  name: string;
  password: string;
  permissionId: string;
  updated_at: string;
};

export type NewUserInput = {
  email: string;
  password: string;
  name: string;
  permissionId: string;
};

export type { IUsersProviderContextData };
