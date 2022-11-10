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
  ICreatePaymentMethodData,
  IPaymentMethod,
  IPaymentMethodsProviderContextData,
} from './types';

const PaymentMethodsContext = createContext(
  {} as IPaymentMethodsProviderContextData,
);

export const PaymentMethodsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [paymentMethodEditing, setPaymentMethodEditing] =
    useState<IPaymentMethod | null>(null);

  const handleEditPaymentMethod = (paymentMethod: IPaymentMethod) => {
    setPaymentMethodEditing(paymentMethod);
    setShowForm(true);
  };

  const handleEditPaymentMethodById = (paymentMethodId: string) => {
    const paymentMethod = paymentMethods.find(
      (_paymentMethod) => _paymentMethod.id === paymentMethodId,
    );
    setPaymentMethodEditing(paymentMethod ?? null);
    setShowForm(true);
  };

  const handleToggleShowForm = (open: boolean) => {
    setShowForm(open);
    !open && setPaymentMethodEditing(null);
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get<IPaginatedResponse<IPaymentMethod>>(
        `/form-payments?page=${page}`,
      );
      setPaymentMethods(response.data.result);
      setPages(response.data.lastPage);
    } catch (err) {
      console.log(err);
    }
  };

  const createPaymentMethod = async (data: ICreatePaymentMethodData) => {
    try {
      const response = await api.post<IPaymentMethod>('/form-payments', data);
      setPaymentMethods([response.data, ...paymentMethods]);
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };

  const confirmEditPaymentMethod = async (
    data: ICreatePaymentMethodData,
    id: string,
  ) => {
    try {
      const response = await api.patch<IPaymentMethod>('/form-payments', {
        ...data,
        id,
      });
      setPaymentMethods(
        paymentMethods.map((paymentMethod) =>
          paymentMethod.id !== response.data.id ? paymentMethod : response.data,
        ),
      );
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };
  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await api.delete(`/form-payments/${paymentMethodId}`);
      setPaymentMethods(
        paymentMethods.filter(
          (paymentMethod) => paymentMethod.id !== paymentMethodId,
        ),
      );
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [page]);

  return (
    <PaymentMethodsContext.Provider
      value={{
        paymentMethods,
        changePage: (page: number) => setPage(page),
        pages,
        showForm,
        editPaymentMethod: handleEditPaymentMethod,
        editPaymentMethodById: handleEditPaymentMethodById,
        toggleShowForm: handleToggleShowForm,
        paymentMethodEditing,
        createPaymentMethod,
        confirmEditPaymentMethod,
        deletePaymentMethod: handleDeletePaymentMethod,
      }}
    >
      {children}
    </PaymentMethodsContext.Provider>
  );
};

export const usePaymentMethods = () => {
  return useContext(PaymentMethodsContext);
};
