import { Client } from '../Clients/types';
import { IPaymentMethod } from '../PaymentMethods/types';
import { User } from '../Users/types';

interface ISaleDetailsProviderContextData {
  saleId?: string;
  details?: SaleDetails | null;
  onCancelSale: () => Promise<void>;
}

interface SaleDetails {
  id: string;
  clientsI: string;
  usersId: string;
  formPaymentId: string;
  amount: number;
  created_at: string;
  updated_at: string;
  client: Client;
  user: User;
  formPayment: IPaymentMethod;
  products: SaleProduct[];
  canceled: boolean;
}

interface SaleProduct {
  id: string;
  productId: string;
  saleId: string;
  qntd: number;
  name: string;
  price: string;
  created_at: Date;
  updated_at: Date;
}

export type { ISaleDetailsProviderContextData, SaleDetails };
