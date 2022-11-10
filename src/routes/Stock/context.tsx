/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../../services/api';
import { IPaginatedResponse } from '../../types/global';
import { Product } from '../Products/types';
import {
  IStockProviderContextData,
  StockHistory,
  StockInputData,
} from './types';

const StockContext = createContext({} as IStockProviderContextData);

export const StockProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showInputForm, setShowInputForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [history, setHistory] = useState<StockHistory[]>([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>(`/products?all=true`);
      setProducts(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInputs = async () => {
    try {
      const response = await api.get<IPaginatedResponse<StockHistory>>(
        `/products/input?page=${page}${
          startDate ? `&startdate=${startDate}` : ''
        }${endDate ? `&enddate=${endDate}` : ''}`,
      );
      setHistory(response.data.result);
      setPages(response.data.lastPage);
    } catch (err) {
      console.log(err);
    }
  };

  const addProductInput = async (data: StockInputData) => {
    try {
      const response = await api.post<StockHistory>(`/products/input`, data);
      setHistory([response.data, ...history]);
    } catch (err) {
      console.log(err);
    }
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchInputs();
  }, [startDate, endDate, page]);

  const handleToggleShowInputForm = (open: boolean) => {
    setShowInputForm(open);
  };

  const handleChangeDate = (date: string, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  return (
    <StockContext.Provider
      value={{
        products,
        history,
        showInputForm,
        onToggleShowInputForm: handleToggleShowInputForm,
        addProductInput,
        changePage: (page: number) => setPage(page),
        pages,
        onChangeDate: handleChangeDate,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  return useContext(StockContext);
};
