import { Client } from '../Clients/types';
import { IPaymentMethod } from '../PaymentMethods/types';
import { Product } from '../Products/types';

interface INewSaleProviderContextData {
  products: Product[];
  clients: Client[];
  paymentMethods: IPaymentMethod[];
  createSale: (data: NewSaleData) => Promise<void>;
}

interface NewSaleData {
  products: {
    id: string;
    qntd: number | undefined;
  }[];
  clientsId: string;
  formPaymentId: string;
}

export type { INewSaleProviderContextData, NewSaleData };
