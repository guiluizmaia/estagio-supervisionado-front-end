import React, { useState } from 'react';
import '../style.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Input from '../Input';
import { AddressInput } from './types';
import { cepMask } from '../../../utils/masks/cep';
import { getAddress } from '../../../services/getAddress';
import { onlyNumbersMask } from '../../../utils/masks/onlyNumbers';
import { addressSchema } from './addressSchema';

const AddressForm: React.FC<{
  address?: AddressInput;
  onSubit: (address: AddressInput) => void;
  onReset: VoidFunction;
}> = ({ address, onSubit, onReset }) => {
  const [isGettingAddress, setIsGettingAddress] = useState(false);

  const { handleSubmit, ...addressForm } = useForm<AddressInput>({
    resolver: yupResolver(addressSchema),
    mode: 'onSubmit',
    shouldUseNativeValidation: false,
    defaultValues: {
      zipCode: address?.zipCode ? cepMask(address.zipCode) : '',
      state: address?.state ?? '',
      city: address?.city ?? '',
      street: address?.street ?? '',
      district: address?.district ?? '',
      number: address?.number.toString() ?? '',
      complement: address?.complement ?? '',
    },
  });

  const onSubmitHandler = async (data: AddressInput) => {
    onSubit(data);
  };

  const setAddressFields = async () => {
    const cepNumbers = addressForm.getValues('zipCode').replace(/[^\d]/g, '');
    if (cepNumbers.length !== 8) return;

    setIsGettingAddress(true);
    addressForm.setValue('city', '');
    addressForm.setValue('state', '');
    addressForm.setValue('street', '');
    addressForm.setValue('district', '');

    const address = await getAddress(cepNumbers);

    if (address?.city) {
      addressForm.setValue('city', address.city);
      addressForm.clearErrors('city');
    }
    if (address?.state) {
      addressForm.setValue('state', address.state);
      addressForm.clearErrors('state');
    }
    if (address?.street) {
      addressForm.setValue('street', address.street);
      addressForm.clearErrors('street');
    }
    if (address?.district) {
      addressForm.setValue('district', address.district);
      addressForm.clearErrors('district');
    }
    setIsGettingAddress(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className='login-form'
      onReset={onReset}
    >
      <h5>Endereço</h5>
      <Input
        control={addressForm.control}
        name='zipCode'
        label='CEP:'
        onChange={(e) =>
          addressForm.setValue('zipCode', cepMask(e.target.value))
        }
        onBlur={setAddressFields}
      />
      <Input
        control={addressForm.control}
        name='city'
        label='Cidade:'
        disabled={isGettingAddress}
      />
      <Input
        control={addressForm.control}
        name='state'
        label='Estado:'
        disabled={isGettingAddress}
      />
      <Input
        control={addressForm.control}
        name='street'
        label='Rua:'
        disabled={isGettingAddress}
      />
      <Input
        control={addressForm.control}
        name='district'
        label='Bairro:'
        disabled={isGettingAddress}
      />
      <Input
        control={addressForm.control}
        name='number'
        label='Número:'
        onChange={(e) =>
          addressForm.setValue('number', onlyNumbersMask(e.target.value))
        }
      />
      <Input
        control={addressForm.control}
        name='complement'
        label='Complemento:'
      />

      <div className='form-row buttons_row'>
        <button className='cancel-button' type='reset'>
          <span>Cancelar</span>
        </button>
        <button className='submit-button' type='submit'>
          <span>{'confirmar'}</span>
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
