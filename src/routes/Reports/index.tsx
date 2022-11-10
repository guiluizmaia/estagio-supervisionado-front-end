import '../style.css';
import { ReportsProvider, useReports } from './context';
import Select from 'react-select';
import {
  ReportClients,
  ReportProducts,
  ReportSales,
  ReportType,
} from './types';

import ProductsReport from './models/ProductsReport';
import SalesReport from './models/SalesReport';
import ClientsReport from './models/ClientsReport';

const ReportsScreen = () => {
  const {
    reportData,
    startDate,
    endDate,
    reportType,
    onChangeEndDate,
    onChangeReportType,
    onChangeStartDate,
    exportToPdf,
    loading,
  } = useReports();

  const typeOptions: { value: ReportType; label: string }[] = [
    { value: 'clients', label: 'Vendas por cliente' },
    { value: 'sales', label: 'Vendas' },
    { value: 'products', label: 'Produtos' },
  ];

  const isProduct = (data: object[]): data is ReportProducts[] => {
    return data.length > 0 && !data.some((item) => !('productId' in item));
  };
  const isSale = (data: object[]): data is ReportSales[] => {
    return data.length > 0 && !data.some((item) => !('saleId' in item));
  };
  const isClient = (data: object[]): data is ReportClients[] => {
    return data.length > 0 && !data.some((item) => !('clientId' in item));
  };

  return (
    <div className='content-simple'>
      <h1 className='content-title'>Relatórios</h1>
      <p>Modelo:</p>
      <Select
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            text: '#04050D',
            primary25: '#FFF6EC',
            primary: '#D9A53B',
          },
        })}
        isClearable={true}
        options={typeOptions}
        placeholder='Selecionar tipo...'
        value={typeOptions.find((p) => p.value === reportType)}
        onChange={(val) => {
          onChangeReportType(val?.value);
        }}
      />
      <div className='dates-filter'>
        <div className='dates-filter__group'>
          <p>Data início:</p>
          <input
            type='date'
            name='start_date'
            max={endDate}
            placeholder='dd-mm-yyyy'
            value={startDate}
            onChange={(e) => {
              onChangeStartDate(e.target.value);
            }}
          />
        </div>
        <div className='dates-filter__group'>
          <p>Data fim:</p>
          <input
            type='date'
            name='end_date'
            min={startDate}
            placeholder='dd-mm-yyyy'
            max={new Date().toISOString().split('T')[0]}
            value={endDate}
            onChange={(e) => {
              onChangeEndDate(e.target.value);
            }}
          />
        </div>
      </div>
      <div className='dates-filter'>
        {reportData.length > 0 ? (
          <button className='submit-button' onClick={exportToPdf}>
            Baixar PDF
          </button>
        ) : (
          <>
            {!!reportType && !loading && (
              <h2>Não há informações para este período</h2>
            )}
          </>
        )}
      </div>
      {isProduct(reportData) && <ProductsReport items={reportData} />}
      {isSale(reportData) && <SalesReport items={reportData} />}
      {isClient(reportData) && <ClientsReport items={reportData} />}
    </div>
  );
};

const Reports = () => {
  return (
    <ReportsProvider>
      <ReportsScreen />
    </ReportsProvider>
  );
};

export default Reports;
