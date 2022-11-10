/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../../../../services/api';
import { IPaginatedResponse } from '../../../../types/global';
import { Client } from '../../../Clients/types';
import { IPaymentMethod } from '../../../PaymentMethods/types';
import { User } from '../../../Users/types';
import { useSales } from '../../context';
import { IFilterProviderContextData } from './types';

const FilterContext = createContext({} as IFilterProviderContextData);

export const FilterProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { onFilter } = useSales();

  const [clients, setClients] = useState<Client[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchClients = async () => {
    try {
      const response = await api.get<Client[]>(`/clients?all=true`);
      setClients(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get<IPaginatedResponse<IPaymentMethod>>(
        `/form-payments`,
      );
      setPaymentMethods(response.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get<IPaginatedResponse<User>>(`/user`);
      setUsers(response.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchPaymentMethods();
    fetchUsers();
  }, []);

  return (
    <FilterContext.Provider
      value={{
        clients,
        onFilter,
        paymentMethods,
        users,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  return useContext(FilterContext);
};
