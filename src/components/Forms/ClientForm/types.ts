import { AddressInput } from '../AddressForm/types';

export type ClientInput = {
  name: string;
  rg: string;
  cpf: string;
  phones: {
    value: string;
  }[];
  address: AddressInput | null;
};
