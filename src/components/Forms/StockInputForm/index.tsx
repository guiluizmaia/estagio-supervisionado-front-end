/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback } from 'react';
import '../style.css';
import Backdrop from '../../Backdrop';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Input from '../Input';
import { toast } from 'react-toastify';
import { stockInputSchema } from './stockInputSchema';
import { useStock } from '../../../routes/Stock/context';
import { StockInputData, StockProduct } from '../../../routes/Stock/types';
import StockProductForm from './components/StockProductForm';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import './styles.css';
const StockInputForm: React.FC = () => {
  const { addProductInput, onToggleShowInputForm, showInputForm, products } =
    useStock();

  const { handleSubmit, reset, control, setError } = useForm<StockInputData>({
    resolver: yupResolver(stockInputSchema),
    mode: 'onSubmit',
    shouldUseNativeValidation: false,
    defaultValues: {
      date: new Date(),
      products: [{ productId: '' }],
    },
  });

  const isValidQuantities = (_products: StockProduct[]): boolean => {
    let isValid = true;
    for (let i = 0; i < _products.length; i++) {
      const productInput = _products[i];
      const product = products.find((p) => p.id === productInput.productId);
      if (!!product && product?.salePrice < Number(productInput.price)) {
        toast.warn(`Considere rever o preço de venda do ${product?.name}`);
      }
      if (
        !!product &&
        productInput.type === 'SUB' &&
        productInput.qntd > product.qntd
      ) {
        setError(`products`, {
          message: 'Há baixa(s) com quantidade maior que o estoque',
        });
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
  const onSubmitHandler = async (data: StockInputData) => {
    if (!isValidQuantities(data.products)) return;
    toast.promise(
      addProductInput(data),
      {
        pending: 'Atualizando estoques...',
        success: 'Estoque atualizado!',
        error: 'Erro ao atualizar estoque :/',
      },
      { hideProgressBar: true },
    );

    reset();
    onToggleShowInputForm(false);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const renderTabs = useCallback(() => {
    return (
      <TabsPrimitive.Root
        defaultValue={`tab0`}
        orientation='horizontal'
        className='tabs-root'
      >
        <TabsPrimitive.List className='tabs-list'>
          {fields.map((_item, index) => (
            <TabsPrimitive.Trigger
              className='tabs-trigger'
              key={index}
              value={`tab${index}`}
            >
              {`Produto ${index + 1}`}
            </TabsPrimitive.Trigger>
          ))}
          <button
            className='tabs-trigger'
            value={`tabNew`}
            onClick={(e) => {
              e.preventDefault();
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              append({ productId: '' });
            }}
          >
            {`+`}
          </button>
        </TabsPrimitive.List>
        <Controller
          control={control}
          name={'products'}
          render={({ fieldState: { error } }) => (
            <p className='input-error-message'>{error?.message}</p>
          )}
        />
        {fields.map((_item, index) => (
          <TabsPrimitive.Content key={index} value={`tab${index}`}>
            <StockProductForm control={control} index={index} />
            <div className='form-row-simple'>
              <button
                className='cancel-button btn-sm'
                onClick={() => remove(index)}
              >
                <span>X Remover produto</span>
              </button>
            </div>
          </TabsPrimitive.Content>
        ))}
      </TabsPrimitive.Root>
    );
  }, [append, control, fields, remove]);

  return !showInputForm ? null : (
    <Backdrop onClick={() => onToggleShowInputForm(false)}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='form-area'>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className='login-form'
            onReset={() => onToggleShowInputForm(false)}
          >
            <Input control={control} name='date' label='Data:' type='date' />
            {renderTabs()}
            <div className='form-row buttons_row'>
              <button className='cancel-button' type='reset'>
                <span>Cancelar</span>
              </button>
              <button className='submit-button' type='submit'>
                <span>Confirmar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Backdrop>
  );
};

export default StockInputForm;
