// import { ProviderInput } from '../../components/Forms/ProviderForm/types';

interface IProvidersProviderContextData {
  providers: Provider[];
  editProvider: (provider: Provider) => void;
  editProviderById: (providerId: string, readOnly?: boolean) => void;
  showForm: boolean;
  toggleShowForm: (open: boolean, readOnly?: boolean) => void;
  providerEditing: null | Provider;
  createProvider: (providerInput: CreateProviderData) => Promise<void>;
  confirmEditProvider: (
    providerInput: CreateProviderData,
    id: string,
  ) => Promise<void>;
  excludeProvider: (providerId: string) => void;
  changePage: (page: number) => void;
  pages: number;
  onSearch: (search: string) => void;
  search: string;
  readOnlyForm: boolean;
}

export type Provider = {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  obs: string;
};

export type CreateProviderData = {
  name: string;
  cnpj: string;
  email: string;
  obs: string;
};

export type { IProvidersProviderContextData };
