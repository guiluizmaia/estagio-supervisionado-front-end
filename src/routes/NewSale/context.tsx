/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from 'axios';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from '../../providers/AuthProvider';
import api from '../../services/api';
import { IPaginatedResponse } from '../../types/global';
import { Client } from '../Clients/types';
import { IPaymentMethod } from '../PaymentMethods/types';
import { Product } from '../Products/types';
import { INewSaleProviderContextData, NewSaleData } from './types';

const NewSaleContext = createContext({} as INewSaleProviderContextData);

export const NewSaleProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

  const fetchClients = async () => {
    try {
      const response = await api.get<Client[]>(`/clients?all=true`);
      setClients(response.data.filter((cl) => !cl.exclude));
    } catch (err) {
      console.log(err);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>(`/products?all=true`);
      setProducts(response.data);
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

  const handleCreateSale = async (data: NewSaleData) => {
    try {
      await api.post('/sales', {
        ...data,
        usersId: user?.id,
      });
      fetchProducts();
    } catch (err) {
      const message = err instanceof AxiosError ? err.response?.data : err;
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchProducts();
    fetchPaymentMethods();
  }, []);

  return (
    <NewSaleContext.Provider
      value={{
        products,
        clients,
        paymentMethods,
        createSale: handleCreateSale,
      }}
    >
      {children}
    </NewSaleContext.Provider>
  );
};

export const useNewSale = () => {
  return useContext(NewSaleContext);
};
