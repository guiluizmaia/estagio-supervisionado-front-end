import { ClientInput } from '../../components/Forms/ClientForm/types';
import { User } from '../Users/types';

interface IClientsProviderContextData {
  clients: Client[];
  changePage: (page: number) => void;
  pages: number;
  editClient: (client: Client) => void;
  editClientById: (clientId: string, readOnly?: boolean) => void;
  showForm: boolean;
  toggleShowForm: (open: boolean, readOnly?: boolean) => void;
  clientEditing: null | Client;
  createClient: (clientInput: ClientInput) => Promise<void>;
  confirmEditClient: (clientInput: ClientInput, id: string) => Promise<void>;
  onSearch: (search: string) => void;
  search: string;
  excludeClient: (clientId: string) => void;
  readOnlyForm: boolean;
}

type Phone = {
  id: string;
  ddd: string;
  number: string;
  created_at: string;
  updated_at: string;
};

export type Address = {
  id: string;
  zipCode: string;
  street: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  number: number;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  exclude: boolean;
  active: boolean;
  initDate: string;
  userId: string;
  created_at: string;
  updated_at: string;
  user: User;
  phones: Phone[];
  addresses: Address[];
};

type PhoneInput = {
  ddd: string;
  number: string;
};

type AddressInput = {
  zipCode: string;
  street: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  number: number;
};

export type CreateClientData = {
  name: string;
  rg: string;
  cpf: string;
  phones: PhoneInput[];
  addresses: AddressInput[];
};

export type { IClientsProviderContextData };
