import React from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import '../style.css';
import { LoginInput } from '../../../providers/AuthProvider/types';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Input from '../Input';

const LoginForm: React.FC = () => {
  const { login } = useAuth();

  const schema = yup
    .object({
      email: yup
        .string()
        .trim()
        .email('Favor informar um email válido')
        .max(50, 'Máximo 50 caracteres')
        .required('Favor informar um email'),
      password: yup.string().trim().required('Favor informar a senha'),
    })
    .required();

  const { handleSubmit, reset, ...loginForm } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const onSubmitHandler = (data: LoginInput) => {
    login(data, reset);
  };

  return (
    <div className='form-area'>
      <form onSubmit={handleSubmit(onSubmitHandler)} className='login-form'>
        <Input control={loginForm.control} name={'email'} label={'E-mail'} />
        <Input
          control={loginForm.control}
          name={'password'}
          label={'Senha'}
          autoComplete='off'
          type='password'
        />
        <div className='form-row buttons_row'>
          <button className='submit-button' type='submit'>
            <span>entrar</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
