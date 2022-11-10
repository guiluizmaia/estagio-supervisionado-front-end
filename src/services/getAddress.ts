import { Address } from '../routes/Clients/types';
import { BrasilApiResponse } from '../types/global';

export async function getAddress(search: string): Promise<Partial<Address>> {
  try {
    const response = await fetch(
      `https://brasilapi.com.br/api/cep/v2/${search}`,
    );

    if (!response.ok) throw new Error('cep não localizado');

    const cep = (await response.json()) as BrasilApiResponse;

    return {
      city: cep.city,
      state: cep.state,
      street: cep.street,
      district: cep.neighborhood,
    };
  } catch (err) {
    throw new Error('cep não localizado');
  }
}
