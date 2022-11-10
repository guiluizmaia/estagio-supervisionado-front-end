import React, { useState } from 'react';
import '../../style.css';

import { Control, Controller } from 'react-hook-form';
import Input from '../../Input';
import Select from 'react-select';
import { useStock } from '../../../../routes/Stock/context';
import {
  StockInputData,
  StockOperationType,
} from '../../../../routes/Stock/types';
import { Product } from '../../../../routes/Products/types';

const StockProductForm: React.FC<{
  control: Control<StockInputData, any>;
  index: number;
}> = ({ control, index }) => {
  const { products } = useStock();

  const [type, setType] = useState<StockOperationType | undefined>(undefined);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const typeOptions: { value: StockOperationType; label: string }[] = [
    { value: 'ADD', label: 'ENTRADA' },
    { value: 'SUB', label: 'BAIXA' },
  ];

  return (
    <>
      <Controller
        control={control}
        name={`products.${index}.productId`}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div className='form-row-simple'>
            <p>Produto:</p>
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
              options={products.map((prod) => ({
                value: prod.id,
                label: prod.name,
              }))}
              value={products
                .map((prod) => ({
                  value: prod.id,
                  label: prod.name,
                }))
                .find((p) => p.value === value)}
              onChange={(val) => {
                onChange(val?.value);
                const prod = products.find((p) => p.id === val?.value);
                setProduct(prod);
              }}
              placeholder='Selecionar produto...'
            />
            <p className='input-error-message'>{error?.message}</p>
          </div>
        )}
      />
      <Controller
        control={control}
        name={`products.${index}.type`}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div className='form-row-simple'>
            <p>Operação:</p>
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
              options={typeOptions}
              value={typeOptions.find((p) => p.value === value)}
              onChange={(val) => {
                onChange(val?.value);
                setType(val?.value);
              }}
              placeholder='Selecionar tipo...'
            />
            <p className='input-error-message'>{error?.message}</p>
          </div>
        )}
      />
      <Input
        control={control}
        name={`products.${index}.qntd`}
        label={`Quantidade: ${product ? `(atual ${product.qntd})` : ''}`}
        type='number'
      />
      {type === 'ADD' && (
        <Input
          control={control}
          name={`products.${index}.price`}
          label='Preço:'
          type='number'
        />
      )}
    </>
  );
};

export default StockProductForm;
