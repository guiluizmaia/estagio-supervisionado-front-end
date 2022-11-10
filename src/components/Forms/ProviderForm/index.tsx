/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import '../style.css';
import Backdrop from '../../Backdrop';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Input from '../Input';
import { providerSchema } from './providerSchema';
import { toast } from 'react-toastify';
import { Provider } from '../../../routes/Providers/types';
import { useProviders } from '../../../routes/Providers/context';
import { cnpjMask } from '../../../utils/masks/cnpj';

const ProviderForm: React.FC<{ provider?: Provider; readOnly?: boolean }> = ({
  provider,
  readOnly = false,
}) => {
  const { showForm, toggleShowForm, createProvider, confirmEditProvider } =
    useProviders();

  const { handleSubmit, reset, control, ...providerForm } = useForm<Provider>({
    resolver: yupResolver(providerSchema),
    mode: 'onSubmit',
    shouldUseNativeValidation: false,
    defaultValues: {
      name: provider?.name ?? '',
      cnpj: provider?.cnpj ? cnpjMask(provider.cnpj) : '',
      email: provider?.email ?? '',
      obs: provider?.obs ?? '',
    },
  });

  const onSubmitHandler = async (data: Provider) => {
    if (!provider) {
      toast.promise(
        createProvider(data),
        {
          pending: 'Cadastrando fornecedor...',
          success: 'Fornecedor cadastrado!',
          error: 'Erro ao cadastrar fornecedor :/',
        },
        { hideProgressBar: true },
      );
    } else {
      toast.promise(
        confirmEditProvider(data, provider.id),
        {
          pending: 'Editando fornecedor...',
          success: 'Fornecedor editado!',
          error: 'Erro ao editar fornecedor :/',
        },
        { hideProgressBar: true },
      );
    }
    reset();
    toggleShowForm(false);
  };

  return !showForm ? null : (
    <Backdrop onClick={() => toggleShowForm(false)}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='form-area'>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className='login-form'
            onReset={() => toggleShowForm(false)}
          >
            <Input
              control={control}
              name='name'
              label='Nome:'
              disabled={readOnly}
            />
            <Input
              control={control}
              name='email'
              label='Email:'
              disabled={readOnly}
            />
            <Input
              control={control}
              name='cnpj'
              label='CNPJ:'
              disabled={readOnly}
              onChange={(e) =>
                providerForm.setValue('cnpj', cnpjMask(e.target.value))
              }
            />
            <Input
              control={control}
              name='obs'
              label='Obs:'
              disabled={readOnly}
            />

            <div className='form-row buttons_row'>
              <button className='cancel-button' type='reset'>
                <span>{!readOnly ? 'Cancelar' : 'OK'}</span>
              </button>
              {!readOnly && (
                <button className='submit-button' type='submit'>
                  <span>{provider ? 'Confirmar' : 'Cadastrar'}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Backdrop>
  );
};

export default ProviderForm;
