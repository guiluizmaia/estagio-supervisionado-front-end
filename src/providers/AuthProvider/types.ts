interface IAuthProviderContextData {
  user: LoggedUser | null;
  login: (credentials: LoginInput, callback: () => void) => void;
  logout: VoidFunction;
}

export type PermissionType = 'ADMIN' | 'SALER';

export type LoginInput = {
  email: string;
  password: string;
};

export type LoggedUser = {
  id: string;
  name: string;
  email: string;
  permissionName: PermissionType;
};

export type LoginResponse = { token: string; user: LoggedUser };

export type { IAuthProviderContextData };
