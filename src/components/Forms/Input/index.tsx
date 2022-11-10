import React from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { IInputProps } from './types';
import '../style.css';

const Input = <T extends FieldValues>({
  control,
  name,
  label,
  onRemove,
  ...props
}: IInputProps<T>): React.ReactElement => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <div>
        <div className='form-row'>
          <input
            className={`form-input${field.value ? ' form-input-valid' : ''}`}
            {...field}
            {...props}
          ></input>
          <label htmlFor='email' className='form-label'>
            <span className='label-content'>{label}</span>
          </label>

          {onRemove && (
            <button
              className='button button__delete remove-button'
              onClick={() => onRemove()}
            >
              <i className='bi bi-trash3'></i>
            </button>
          )}
        </div>
        <p className='input-error-message'>{error?.message}</p>
      </div>
    )}
  />
);

export default Input;
