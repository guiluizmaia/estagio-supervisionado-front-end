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
import { Sale, ISalesProviderContextData, ISaleFilter } from './types';

const SalesContext = createContext({} as ISalesProviderContextData);

export const SalesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState<ISaleFilter | undefined>(undefined);

  const fetchSales = async () => {
    try {
      if (filter) {
        const response = await api.get<Sale[]>(
          `/sales/${filter.filter}/${filter.param}`,
        );
        setSales(response.data);
        setPages(0);
      } else {
        const response = await api.get<IPaginatedResponse<Sale>>(
          `/sales?page=${page}`,
        );
        setSales(response.data.result);
        setPages(response.data.lastPage);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, filter]);

  const handleFilter = (filter: ISaleFilter | undefined) => {
    setFilter(filter);
  };

  return (
    <SalesContext.Provider
      value={{
        sales,
        changePage: (page: number) => setPage(page),
        pages,
        onFilter: handleFilter,
        filter,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  return useContext(SalesContext);
};
