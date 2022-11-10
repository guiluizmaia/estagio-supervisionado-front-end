import { Client } from '../../../Clients/types';
import { IPaymentMethod } from '../../../PaymentMethods/types';
import { User } from '../../../Users/types';
import { ISaleFilter } from '../../types';

interface IFilterProviderContextData {
  clients: Client[];
  paymentMethods: IPaymentMethod[];
  onFilter: (filter: ISaleFilter | undefined) => void;
  users: User[];
}

export type { IFilterProviderContextData };
