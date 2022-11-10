/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { Sale } from '../Sales/types';
import { ISaleDetailsProviderContextData, SaleDetails } from './types';

const SaleDetailsContext = createContext({} as ISaleDetailsProviderContextData);

export const SaleDetailsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { saleId } = useParams();
  const [saleDetails, setSaleDetails] = useState<SaleDetails | null>(null);

  const fetchSaleDetails = async () => {
    try {
      const response = await api.get<SaleDetails>(`/sales/${saleId}`);
      setSaleDetails(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!saleId) return;
    fetchSaleDetails();
  }, [saleId]);

  const handleCancelSale = async () => {
    if (!saleId) return;
    try {
      const response = await api.patch<Sale>(`/sales`, {
        id: saleId,
        canceled: true,
      });
      if (!response.data.canceled) {
        throw new Error('deu ruim');
      }
      !!saleDetails && setSaleDetails({ ...saleDetails, canceled: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SaleDetailsContext.Provider
      value={{ saleId, details: saleDetails, onCancelSale: handleCancelSale }}
    >
      {children}
    </SaleDetailsContext.Provider>
  );
};

export const useSaleDetails = () => {
  return useContext(SaleDetailsContext);
};
