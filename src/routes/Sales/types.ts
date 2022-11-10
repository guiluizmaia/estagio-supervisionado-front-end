import { Client } from '../Clients/types';
import { IPaymentMethod } from '../PaymentMethods/types';
import { Product } from '../Products/types';

interface ISalesProviderContextData {
  sales: Sale[];
  changePage: (page: number) => void;
  pages: number;
  onFilter: (filter: ISaleFilter | undefined) => void;
  filter: ISaleFilter | undefined;
}

interface ISaleFilter {
  filter: FilterType;
  param: string;
}

export type FilterType = 'client' | 'payment' | 'user' | undefined;

export type Sale = {
  id: string;
  client: Client;
  formPayment: IPaymentMethod;
  products: Product[];
  amount: number;
  canceled: boolean;
  created_at: string;
};

export type { ISalesProviderContextData, ISaleFilter };
