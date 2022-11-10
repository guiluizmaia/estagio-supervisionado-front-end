/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../../services/api';
import {
  IReportsProviderContextData,
  ReportClients,
  ReportProducts,
  ReportSales,
  ReportType,
} from './types';
import { exportMultipleChartsToPdf } from '../../utils/pdfGenerator';

const ReportsContext = createContext({} as IReportsProviderContextData);

export const ReportsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const currentDate = new Date();
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>(
    lastMonthDate.toISOString().split('T')[0],
  );
  const [endDate, setEndDate] = useState<string>(
    currentDate.toISOString().split('T')[0],
  );
  const [reportType, setReportType] = useState<ReportType | undefined>(
    undefined,
  );

  const [reportData, setReportData] = useState<
    ReportClients[] | ReportProducts[] | ReportSales[]
  >([]);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setReportData([]);
    const response = await api.get<
      ReportClients[] | ReportProducts[] | ReportSales[]
    >(
      `/${reportType}/report?${startDate ? `startdate=${startDate}` : ''}&${
        endDate ? `enddate=${endDate}` : ''
      }`,
    );
    setReportData(response.data);
    setLoading(false);
  }, [startDate, endDate, reportType]);

  const exportToPdf = useCallback(() => {
    if (!reportType) return;
    const namesMap: { [keys in ReportType]: string } = {
      clients: 'vendas_clientes',
      sales: 'vendas',
      products: 'produtos_vendidos',
    };
    exportMultipleChartsToPdf(
      `${namesMap[reportType]}${startDate ? `_${startDate}` : ''}_${
        endDate ? `${endDate}` : ''
      }`,
    );
  }, [startDate, endDate, reportType]);

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, reportType]);

  return (
    <ReportsContext.Provider
      value={{
        reportData,
        startDate,
        endDate,
        reportType,
        onChangeStartDate: (date: string) => setStartDate(date),
        onChangeEndDate: (date: string) => setEndDate(date),
        onChangeReportType: (type: ReportType | undefined) =>
          setReportType(type),
        exportToPdf,
        loading,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  return useContext(ReportsContext);
};
