/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useState } from 'react';
import { useClients } from '../../../routes/Clients/context';
import '../style.css';
import Backdrop from '../../Backdrop';
import { Client } from '../../../routes/Clients/types';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Input from '../Input';
import { ClientInput } from './types';
import { cpfMask } from '../../../utils/masks/cpf';
import { phoneMask } from '../../../utils/masks/phone';
import { clientSchema } from './clientSchema';
import { toast } from 'react-toastify';
import AddressForm from '../AddressForm';
import { AddressInput } from '../AddressForm/types';

const ClientForm: React.FC<{ client?: Client; readOnly?: boolean }> = ({
  client,
  readOnly = false,
}) => {
  const { showForm, toggleShowForm, createClient, confirmEditClient } =
    useClients();
  const [step, setStep] = useState<'main' | 'address'>('main');
  const [addressEditing, setAddressEditing] = useState<AddressInput | null>(
    null,
  );

  const { handleSubmit, reset, control, setError, ...clientForm } =
    useForm<ClientInput>({
      resolver: yupResolver(clientSchema),
      mode: 'onSubmit',
      shouldUseNativeValidation: false,
      defaultValues: {
        name: client?.name ?? '',
        cpf: client?.cpf ? cpfMask(client?.cpf) : '',
        rg: client?.rg ?? '',
        phones: client?.phones.map((phone) => ({
          value: phoneMask(`${phone.ddd}${phone.number}`),
        })) ?? [{ value: '' }],
        address:
          (client?.addresses?.length ?? 0) > 0
            ? {
                ...client?.addresses[0],
                number: client?.addresses[0].number.toString(),
              }
            : null,
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phones',
  });

  const setAlreadyExistError = useCallback(() => {
    setError('cpf', { message: 'Cpf já possui cadastro' });
  }, [setError]);

  const onSubmitHandler = async (data: ClientInput) => {
    if (!client) {
      toast.promise(
        createClient(data),
        {
          pending: 'Cadastrando cliente...',
          success: {
            render: () => {
              reset();
              toggleShowForm(false);
              return 'Cliente cadastrado!';
            },
          },
          error: {
            render: ({ toastProps }) => {
              if (
                toastProps.data instanceof Error &&
                toastProps.data.message === 'Clients already exists!'
              ) {
                setAlreadyExistError();
                return 'Já existe um cadastro com este cpf!';
              }
              return 'Erro ao cadastrar cliente :/';
            },
          },
        },
        { hideProgressBar: true },
      );
    } else {
      toast.promise(
        confirmEditClient(data, client.id),
        {
          pending: 'Editando cliente...',
          success: {
            render: () => {
              reset();
              toggleShowForm(false);
              return 'Cliente editado!';
            },
          },
          error: {
            render: ({ toastProps }) => {
              if (
                toastProps.data instanceof Error &&
                toastProps.data.message ===
                  'Clients with this cpf already exists!'
              ) {
                setAlreadyExistError();
                return 'Já existe um cadastro com este cpf!';
              }
              return 'Erro ao editar cliente :/';
            },
          },
        },
        { hideProgressBar: true },
      );
    }
  };

  return !showForm ? null : (
    <Backdrop onClick={() => toggleShowForm(false)}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='form-area'>
          {step === 'main' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                clientForm.trigger('address');
                handleSubmit(onSubmitHandler)(e);
              }}
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
                name='cpf'
                label='CPF:'
                disabled={readOnly}
                onChange={(e) =>
                  clientForm.setValue('cpf', cpfMask(e.target.value))
                }
              />
              <Input
                control={control}
                name='rg'
                label='RG:'
                disabled={readOnly}
              />
              {fields.map((item, index) => {
                return (
                  <Input
                    control={control}
                    key={item.id}
                    name={`phones.${index}.value`}
                    disabled={readOnly}
                    label={`Telefone${index > 0 ? ` ${index + 1}` : ''}:`}
                    onChange={(e) =>
                      clientForm.setValue(
                        `phones.${index}.value`,
                        phoneMask(e.target.value),
                      )
                    }
                    onRemove={
                      !readOnly && index > 0 ? () => remove(index) : undefined
                    }
                  />
                );
              })}
              {!readOnly && (
                <button
                  className='cancel-button'
                  style={{ fontSize: '12px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    append({ value: '' });
                  }}
                >
                  Mais um telefone
                </button>
              )}

              <div className='form-row-simple'>
                <p>Endereço:</p>
                {clientForm.getValues('address') ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <p>{`${clientForm.getValues(
                      'address.street',
                    )}, ${clientForm.getValues(
                      'address.number',
                    )} - ${clientForm.getValues(
                      'address.district',
                    )} - ${clientForm.getValues(
                      'address.city',
                    )}/${clientForm.getValues('address.state')}`}</p>
                    {!readOnly && (
                      <button
                        className='button button__edit'
                        onClick={(e) => {
                          e.preventDefault();
                          setAddressEditing(clientForm.getValues('address'));
                          setStep('address');
                        }}
                      >
                        <i className='bi bi-pencil-square'></i>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    className='submit-button'
                    style={{ fontSize: '12px' }}
                    onClick={(e) => {
                      e.preventDefault();
                      setStep('address');
                    }}
                  >
                    Cadastrar endereço
                  </button>
                )}
              </div>

              <Controller
                control={control}
                name={'address'}
                render={({ fieldState: { error } }) => (
                  <p className='input-error-message'>{error?.message}</p>
                )}
              />

              <div className='form-row buttons_row'>
                <button className='cancel-button' type='reset'>
                  <span>{!readOnly ? 'Cancelar' : 'OK'}</span>
                </button>
                {!readOnly && (
                  <button className='submit-button' type='submit'>
                    <span>{client ? 'Confirmar' : 'Cadastrar'}</span>
                  </button>
                )}
              </div>
            </form>
          ) : (
            <AddressForm
              onSubit={(data) => {
                clientForm.setValue('address', data);
                setStep('main');
                clientForm.trigger('address');
              }}
              onReset={() => setStep('main')}
              address={addressEditing ?? undefined}
            />
          )}
        </div>
      </div>
    </Backdrop>
  );
};

export default ClientForm;
