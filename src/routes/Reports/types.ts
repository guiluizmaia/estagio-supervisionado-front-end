interface IReportsProviderContextData {
  startDate: string;
  endDate: string;
  reportType: ReportType | undefined;
  onChangeStartDate: (date: string) => void;
  onChangeEndDate: (date: string) => void;
  onChangeReportType: (date: ReportType | undefined) => void;
  reportData: ReportClients[] | ReportProducts[] | ReportSales[];
  exportToPdf: VoidFunction;
  loading: boolean;
}

interface ReportProducts {
  productId: string;
  name: string;
  qntdSale: number;
  description: string;
  providerName: string;
  providerCnpj: string;
}

interface ReportClients {
  clientId: string;
  name: string;
  cpf: string;
  exclude: boolean;
  excludeDate?: Date;
  initDate: Date;
  salesQuantInPeriod: number;
  lastSaleDateInPeriod: Date;
  valuePayInPeriod: number;
}

interface ReportSales {
  saleId: string;
  saleDate: Date;
  value: number;
  profit: number;
  clientName: string;
  clientCPF: string;
  userName: string;
  userId: string;
  formPayment: string;
  canceled: boolean;
  canceled_at?: Date;
}

export type ReportType = 'products' | 'sales' | 'clients';
export type SaleFilterType = 'all' | 'excluded' | 'active';

export type {
  IReportsProviderContextData,
  ReportProducts,
  ReportClients,
  ReportSales,
};
