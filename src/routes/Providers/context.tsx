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
  Provider,
  CreateProviderData,
  IProvidersProviderContextData,
} from './types';

const ProvidersContext = createContext({} as IProvidersProviderContextData);

export const ProvidersProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [providerEditing, setProviderEditing] = useState<Provider | null>(null);
  const [search, setSearch] = useState('');
  const [readOnlyForm, setReadOnlyForm] = useState(false);

  const handleEditProvider = (provider: Provider) => {
    setProviderEditing(provider);
    setShowForm(true);
  };

  const handleEditProviderById = (providerId: string, readOnly?: boolean) => {
    const provider = providers.find((_provider) => _provider.id === providerId);
    setReadOnlyForm(readOnly ?? false);
    setProviderEditing(provider ?? null);
    setShowForm(true);
  };

  const handleToggleShowForm = (open: boolean, readOnly?: boolean) => {
    setReadOnlyForm(readOnly ?? false);
    setShowForm(open);
    !open && setProviderEditing(null);
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchProviders = async () => {
    try {
      const response = await api.get<IPaginatedResponse<Provider>>(
        `/providers?page=${page}${!search ? '' : `&search=${search}`}`,
      );
      setProviders(response.data.result);
      setPages(response.data.lastPage);
    } catch (err) {
      console.log(err);
    }
  };

  const createProvider = async (providerInput: CreateProviderData) => {
    try {
      console.log(providerInput);
      const response = await api.post<Provider>('/providers', providerInput);
      setProviders([response.data, ...providers]);
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };

  const confirmEditProvider = async (
    providerInput: CreateProviderData,
    id: string,
  ) => {
    try {
      const response = await api.patch<Provider>('/providers', {
        ...providerInput,
        id,
      });
      console.log(response.data);
      setProviders(
        providers.map((provider) =>
          provider.id !== response.data.id ? provider : response.data,
        ),
      );
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };

  const handleExcludeProvider = async (providerId: string) => {
    try {
      console.log(providerId);
      const response = await api.patch<Provider>('/providers', {
        id: providerId,
        exclude: true,
      });
      console.log(response.data);
      setProviders(
        providers.filter((provider) => provider.id !== response.data.id),
      );
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [page, search]);

  return (
    <ProvidersContext.Provider
      value={{
        providers,
        showForm,
        changePage: (page: number) => setPage(page),
        onSearch: (search: string) => setSearch(search),
        pages,
        editProvider: handleEditProvider,
        editProviderById: handleEditProviderById,
        toggleShowForm: handleToggleShowForm,
        providerEditing,
        createProvider,
        confirmEditProvider,
        excludeProvider: handleExcludeProvider,
        readOnlyForm,
        search,
      }}
    >
      {children}
    </ProvidersContext.Provider>
  );
};

export const useProviders = () => {
  return useContext(ProvidersContext);
};
