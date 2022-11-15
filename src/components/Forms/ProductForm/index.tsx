/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useProducts } from '../../../routes/Products/context';
import '../style.css';
import Backdrop from '../../Backdrop';
import { CreateProductData, Product } from '../../../routes/Products/types';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Input from '../Input';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { productSchema } from './productSchema';

const ProductForm: React.FC<{ product?: Product; readOnly?: boolean }> = ({
  product,
  readOnly = false,
}) => {
  const {
    showForm,
    toggleShowForm,
    createProduct,
    confirmEditProduct,
    providers,
  } = useProducts();

  const { handleSubmit, reset, control } = useForm<Product>({
    resolver: yupResolver(productSchema),
    mode: 'onSubmit',
    shouldUseNativeValidation: false,
    defaultValues: {
      ...product,
    },
  });

  const onSubmitHandler = async (data: CreateProductData) => {
    if (!product) {
      toast.promise(
        createProduct(data),
        {
          pending: 'Cadastrando produto...',
          success: 'Produto cadastrado!',
          error: 'Erro ao cadastrar produto :/',
        },
        { hideProgressBar: true },
      );
    } else {
      toast.promise(
        confirmEditProduct(data, product.id),
        {
          pending: 'Editando produto...',
          success: 'Produto editado!',
          error: 'Erro ao editar produto :/',
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
              label='Nome: '
              disabled={readOnly}
            />
            <Input
              control={control}
              name='description'
              label='Descrição:'
              disabled={readOnly}
            />
            <Input
              control={control}
              name='paidPrice'
              label='Preço pago:'
              type='number'
              disabled={readOnly}
            />
            <Input
              control={control}
              name='salePrice'
              label='Preço de venda:'
              type='number'
              disabled={readOnly}
            />
            <Input
              control={control}
              name='qntd'
              label='Estoque:'
              type='number'
              disabled={readOnly}
            />
            <p>Fornecedor:</p>
            <Controller
              control={control}
              name='providerId'
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <div className='form-row-simple'>
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
                    isDisabled={readOnly}
                    options={
                      providers.map((prov) => ({
                          value: prov.id,
                          label: prov.name,
                        })
                      )
                    }
                    noOptionsMessage={() => 'Nenhum Fornecedor Cadastrado'}
                    value={providers
                      .map((prov) => ({
                        value: prov.id,
                        label: prov.name,
                      }))
                      .find((p) => p.value === value)}
                    onChange={(val) => onChange(val?.value)}
                    placeholder='Selecionar fornecedor...'
                  />
                  <p className='input-error-message'>{error?.message}</p>
                </div>
              )}
            />
            <div className='form-row buttons_row'>
              <button className='cancel-button' type='reset'>
                <span>{!readOnly ? 'Cancelar' : 'OK'}</span>
              </button>
              {!readOnly && (
                <button className='submit-button' type='submit'>
                  <span>{product ? 'Confirmar' : 'Cadastrar'}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Backdrop>
  );
};

export default ProductForm;
