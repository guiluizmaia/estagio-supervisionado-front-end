/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback } from 'react';
import { usePaymentMethods } from '../../../routes/PaymentMethods/context';
import '../style.css';
import Backdrop from '../../Backdrop';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Input from '../Input';
import { toast } from 'react-toastify';
import { paymentMethodSchema } from './paymentMethodSchema';
import {
  ICreatePaymentMethodData,
  IPaymentMethod,
} from '../../../routes/PaymentMethods/types';

const PaymentMethodForm: React.FC<{ paymentMethod?: IPaymentMethod }> = ({
  paymentMethod,
}) => {
  const {
    showForm,
    toggleShowForm,
    createPaymentMethod,
    confirmEditPaymentMethod,
  } = usePaymentMethods();

  const { handleSubmit, reset, control, setError } = useForm<IPaymentMethod>({
    resolver: yupResolver(paymentMethodSchema),
    mode: 'onSubmit',
    shouldUseNativeValidation: false,
    defaultValues: {
      ...paymentMethod,
    },
  });

  const setAlreadyExistError = useCallback(() => {
    setError('formPayment', { message: 'Favor utilizar um nome diferente' });
  }, [setError]);

  const onSubmitHandler = async (data: ICreatePaymentMethodData) => {
    if (!paymentMethod) {
      toast.promise(
        createPaymentMethod(data),
        {
          pending: 'Cadastrando forma de pagamento...',
          success: {
            render: () => {
              reset();
              toggleShowForm(false);
              return 'Forma de pagamento cadastrada!';
            },
          },
          error: {
            render: ({ toastProps }) => {
              if (
                toastProps.data instanceof Error &&
                toastProps.data.message === 'Form Payment already exists'
              ) {
                setAlreadyExistError();
                return 'Já existe uma forma de pagamento com esse nome!';
              }
              return 'Erro ao cadastrar forma de pagamento :/';
            },
          },
        },
        { hideProgressBar: true },
      );
    } else {
      toast.promise(
        confirmEditPaymentMethod(data, paymentMethod.id),
        {
          pending: 'Editando forma de pagamento...',
          success: {
            render: () => {
              reset();
              toggleShowForm(false);
              return 'Forma de pagamento editada!';
            },
          },
          error: {
            render: ({ toastProps }) => {
              if (
                toastProps.data instanceof Error &&
                toastProps.data.message === 'Form Payment already exists'
              ) {
                setAlreadyExistError();
                return 'Já existe uma forma de pagamento com esse nome!';
              }
              return 'Erro ao editar forma de pagamento :/';
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
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className='login-form'
            onReset={() => toggleShowForm(false)}
          >
            <Input
              control={control}
              name='formPayment'
              label='Forma de pagamento:'
            />

            <div className='form-row buttons_row'>
              <button className='cancel-button' type='reset'>
                <span>Cancelar</span>
              </button>
              <button className='submit-button' type='submit'>
                <span>{paymentMethod ? 'Confirmar' : 'Cadastrar'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Backdrop>
  );
};

export default PaymentMethodForm;
