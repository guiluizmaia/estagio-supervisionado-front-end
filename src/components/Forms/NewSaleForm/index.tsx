/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useState } from 'react';
import '../style.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { newSaleSchema } from './newSaleSchema';
import { useNewSale } from '../../../routes/NewSale/context';
import Input from '../Input';
import { NewSaleData } from '../../../routes/NewSale/types';
import Backdrop from '../../Backdrop';
import { Product } from '../../../routes/Products/types';
import { currency } from '../../../utils/masks/currency';

const NewSaleForm: React.FC = () => {
  const { products, clients, paymentMethods, createSale } = useNewSale();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [preSale, setPreSale] = useState<NewSaleData | null>(null);

  const { handleSubmit, reset, control, setError } = useForm<NewSaleData>({
    resolver: yupResolver(newSaleSchema),
    mode: 'onSubmit',
    shouldUseNativeValidation: false,
    defaultValues: {
      clientsId: '',
      formPaymentId: '',
      products: [{ id: '', qntd: undefined }],
    },
  });

  const paymentForm = useForm<Pick<NewSaleData, 'formPaymentId'>>({
    resolver: yupResolver(newSaleSchema),
    mode: 'onSubmit',
    shouldUseNativeValidation: false,
    defaultValues: {
      formPaymentId: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const isValidQuantities = (
    _products: {
      id: string;
      qntd: number | undefined;
    }[],
  ): boolean => {
    let isValid = true;
    for (let i = 0; i < _products.length; i++) {
      const productInput = _products[i];
      const productsInput = _products.filter((p) => p.id === productInput.id);
      const product = products.find((p) => p.id === productInput.id);

      console.log(productInput)
      console.log(productInput)

      let quant = 0
      productsInput.forEach(p => {
        if(p.qntd)
          quant += p.qntd
      })


      if (!!product && (quant ?? 0) > product.qntd) {
        setError(
          `products.${i}.qntd`,
          {
            message: 'Quantidade maior que o estoque',
          },
          { shouldFocus: true },
        );
        isValid = false;
      }
    }

    return isValid;
  };

  const onSubmitHandler = (data: NewSaleData) => {
    if (!isValidQuantities(data.products)) return;

    const products: any = []
    data.products.forEach(product => {
      const p = products.find((pFind: any) => pFind.id === product.id)
      const index = products.findIndex((pFind: any) => pFind.id === product.id)
      if(!p){
        products.push(product)
      } else {
        products[index] = {
          id: products[index].id,
          qntd: products[index].qntd + product.qntd
        }
      }
    })

    data.products = products
    console.log('teste', data)

    setPreSale(data);
    setShowConfirmModal(true);
  };

  const onConfirmSale = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();

      const paymentFormId = paymentForm.getValues('formPaymentId');
      if (!paymentFormId) {
        return paymentForm.setError('formPaymentId', {
          message: 'Favor selecionar a forma de pagamento',
        });
      }
      if (!preSale) return;

      toast.promise(
        createSale({ ...preSale, formPaymentId: paymentFormId }),
        {
          pending: 'Confirmando venda...',
          success: 'Venda realizada!',
          error: 'Erro ao registrar venda :/',
        },
        { hideProgressBar: true },
      );

      setPreSale(null);
      setShowConfirmModal(false);
      reset();
    },
    [paymentForm, preSale, createSale, reset],
  );

  return (
    <div className='form-area-large'>
      <form onSubmit={handleSubmit(onSubmitHandler)} className='login-form'>
        <Controller
          control={control}
          name={`clientsId`}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <p className='form-row-simple'>Cliente:</p>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1 }}>
                  <Select
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        text: '#04050D',
                        primary25: '#FFF6EC',
                        primary: '#D9A53B',
                      },
                    })}
                    isClearable={true}
                    options={clients.map((client) => ({
                      value: client.id,
                      label: client.name,
                    }))}
                    value={
                      clients
                        .map((client) => ({
                          value: client.id,
                          label: client.name,
                        }))
                        .find((p) => p.value === value) ?? null
                    }
                    noOptionsMessage={() => 'Nenhum Cliente Cadastrado'}
                    onChange={(val) => {
                      onChange(val?.value);
                    }}
                    placeholder='Selecionar cliente...'
                  />
                  <p className='input-error-message'>{error?.message}</p>
                </div>
              </div>
            </>
          )}
        />

        <p className='form-row-simple'>Produtos:</p>
        {fields.map((item, index) => {
          return (
            <div key={item.id} className='lined-inputs'>
              <Controller
                control={control}
                name={`products.${index}.id`}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div className='form-row-simple' style={{ flex: 1 }}>
                    <Select
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          text: '#04050D',
                          primary25: '#FFF6EC',
                          primary: '#D9A53B',
                        },
                      })}
                      isClearable={true}
                      options={products
                        .filter((prod) => prod.qntd > 0)
                        .map((prod) => ({
                          value: prod.id,
                          label: `R$ ${prod.qntd} - ${prod.name}`,
                        }))}
                      noOptionsMessage={() => 'Nenhum Produto Cadastrado'}
                      value={
                        products
                          .map((prod) => ({
                            value: prod.id,
                            label: `R$ ${prod.qntd} - ${prod.name}`,
                          }))
                          .find((p) => p.value === value) ?? null
                      }
                      onChange={(val) => onChange(val?.value)}
                      placeholder='Selecionar produto...'
                    />
                    <p className='input-error-message'>{error?.message}</p>
                  </div>
                )}
              />
              <Input
                control={control}
                name={`products.${index}.qntd`}
                label={'Quantidade:'}
                type='number'
                onRemove={index > 0 ? () => remove(index) : undefined}
              />
            </div>
          );
        })}
        <Controller
          control={control}
          name={'products'}
          render={({ fieldState: { error } }) => (
            <p className='input-error-message'>{error?.message}</p>
          )}
        />
        <button
          className='cancel-button'
          style={{ fontSize: '12px' }}
          onClick={(e) => {
            e.preventDefault();
            append({ id: '', qntd: undefined });
          }}
        >
          Mais produtos
        </button>
        <div className='form-row buttons_row'>
          <button className='submit-button' type='submit'>
            <span>Registrar venda</span>
          </button>
        </div>
      </form>
      {showConfirmModal && (
        <Backdrop onClick={() => setShowConfirmModal(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='form-area'>
              <div className='login-form'>
                <div>
                  <h2>Detalhes da venda</h2>
                  <p>Cliente:</p>
                  <p>
                    {
                      clients.find((client) => client.id === preSale?.clientsId)
                        ?.name
                    }
                  </p>
                  <br />
                  <p>Produtos:</p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '1rem',
                    }}
                  >
                    <p>Qtd.</p>
                    <p style={{ flex: 1 }}>Nome</p>
                    <p>Subtotal</p>
                  </div>
                  {preSale?.products.map((preSaleProduct, index) => {
                    const product: Product | undefined = products.find(
                      (p) => p.id === preSaleProduct.id,
                    );
                    return !product ? null : (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '1rem',
                          marginBlock: '0.25rem',
                        }}
                      >
                        <p>{`${preSaleProduct.qntd}x`}</p>
                        <p
                          style={{
                            flex: 1,
                          }}
                        >
                          {product.name}
                        </p>
                        <p>
                          {currency(
                            product.salePrice * (preSaleProduct.qntd ?? 0),
                          )}
                        </p>
                      </div>
                    );
                  })}
                  <br />
                  <p>{`TOTAL: ${currency(
                    preSale?.products.reduce(
                      (a, b) =>
                        a +
                        (b.qntd ?? 0) *
                          (products.find((p) => p.id === b.id)?.salePrice ?? 0),
                      0,
                    ) ?? 0,
                  )}`}</p>
                  <Controller
                    control={paymentForm.control}
                    name={`formPaymentId`}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <p className='form-row-simple'>Forma de Pagamento</p>
                        <div>
                          <Select
                            theme={(theme) => ({
                              ...theme,
                              colors: {
                                ...theme.colors,
                                text: '#04050D',
                                primary25: '#FFF6EC',
                                primary: '#D9A53B',
                              },
                            })}
                            isClearable={true}
                            options={paymentMethods.map((pm) => ({
                              value: pm.id,
                              label: pm.formPayment,
                            }))}
                            noOptionsMessage={() => 'Nenhuma Forma de Pagamento Cadastrada'}
                            value={
                              paymentMethods
                                .map((pm) => ({
                                  value: pm.id,
                                  label: pm.formPayment,
                                }))
                                .find((p) => p.value === value) ?? null
                            }
                            onChange={(val) => onChange(val?.value)}
                            placeholder='Selecionar cliente...'
                          />
                          <p className='input-error-message'>
                            {error?.message}
                          </p>
                        </div>
                      </>
                    )}
                  />
                </div>
                <div className='form-row buttons_row'>
                  <button
                    className='cancel-button'
                    onClick={() => setShowConfirmModal(false)}
                  >
                    <span>Cancelar</span>
                  </button>
                  <button
                    className='submit-button'
                    onClick={(e) => onConfirmSale(e)}
                  >
                    <span>Confirmar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Backdrop>
      )}
    </div>
  );
};

export default NewSaleForm;
