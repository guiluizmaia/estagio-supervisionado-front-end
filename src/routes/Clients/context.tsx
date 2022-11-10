/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from 'axios';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ClientInput } from '../../components/Forms/ClientForm/types';
import api from '../../services/api';
import { IPaginatedResponse } from '../../types/global';
import { Client, CreateClientData, IClientsProviderContextData } from './types';

const ClientsContext = createContext({} as IClientsProviderContextData);

export const ClientsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [clientEditing, setClientEditing] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [readOnlyForm, setReadOnlyForm] = useState(false);

  const handleEditClient = (client: Client) => {
    setClientEditing(client);
    setShowForm(true);
  };

  const handleEditClientById = (clientId: string, readOnly?: boolean) => {
    const client = clients.find((_client) => _client.id === clientId);
    setReadOnlyForm(readOnly ?? false);
    setClientEditing(client ?? null);
    setShowForm(true);
  };

  const handleToggleShowForm = (open: boolean, readOnly?: boolean) => {
    setReadOnlyForm(readOnly ?? false);
    setShowForm(open);
    !open && setClientEditing(null);
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchClients = async () => {
    try {
      const response = await api.get<IPaginatedResponse<Client>>(
        `/clients?page=${page}${!search ? '' : `&search=${search}`}`,
      );
      setClients(response.data.result);
      setPages(response.data.lastPage);
    } catch (err) {
      console.log(err);
    }
  };

  const parseClientData = (clientInput: ClientInput): CreateClientData => {
    const addresses = !clientInput.address
      ? []
      : [
          {
            city: clientInput.address?.city,
            state: clientInput.address?.state,
            district: clientInput.address?.district,
            complement: clientInput.address?.complement,
            street: clientInput.address?.street,
            number: Number(clientInput.address?.number),
            zipCode: clientInput.address?.zipCode,
          },
        ];
    return {
      rg: clientInput.rg,
      cpf: clientInput.cpf,
      name: clientInput.name,
      phones: clientInput.phones.map((phone) => ({
        ddd: phone.value.substring(0, 2),
        number: phone.value.substring(2),
      })),
      addresses,
    };
  };

  const createClient = async (clientInput: ClientInput) => {
    try {
      const clientData = parseClientData(clientInput);
      const response = await api.post<Client>('/clients', clientData);
      setClients([response.data, ...clients]);
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };

  const confirmEditClient = async (clientInput: ClientInput, id: string) => {
    try {
      const clientData = parseClientData(clientInput);
      const response = await api.patch<Client>('/clients', {
        ...clientData,
        id,
      });
      setClients(
        clients.map((client) =>
          client.id !== response.data.id ? client : response.data,
        ),
      );
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };
  const handleExcludeClient = async (clientId: string) => {
    try {
      console.log(clientId);
      const response = await api.patch<Client>('/clients', {
        id: clientId,
        exclude: true,
      });
      console.log(response.data);
      setClients(clients.filter((client) => client.id !== response.data.id));
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, search]);

  return (
    <ClientsContext.Provider
      value={{
        clients,
        changePage: (page: number) => setPage(page),
        onSearch: (search: string) => setSearch(search),
        pages,
        showForm,
        editClient: handleEditClient,
        editClientById: handleEditClientById,
        toggleShowForm: handleToggleShowForm,
        clientEditing,
        createClient,
        confirmEditClient,
        search,
        excludeClient: handleExcludeClient,
        readOnlyForm,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  return useContext(ClientsContext);
};
