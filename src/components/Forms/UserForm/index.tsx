/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { toast } from 'react-toastify';
import { useUsers } from '../../../routes/Users/contex';
import '../style.css';
import Backdrop from '../../Backdrop';
import { NewUserInput, User } from '../../../routes/Users/types';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import Input from '../Input';
import Select from 'react-select';

const UserForm: React.FC<{ user?: User }> = ({ user }) => {
  const { createUser, permissions, showForm, toggleShowForm, confirmEditUser } =
    useUsers();

  const schema = yup
    .object({
      id: yup.string(),
      email: yup
        .string()
        .trim()
        .email('Favor informar um email válido')
        .max(50, 'Máximo 50 caracteres')
        .required('Favor informar um email'),
      name: yup
        .string()
        .trim()
        .required('Favor informar um nome')
        .min(3, 'Mínimo 3 caracteres')
        .max(100, 'Máximo 100 caracteres'),
      passwordCheck: yup.string().when('id', ([id], schema) => {
        return !id
          ? schema
              .trim()
              .required('Favor informar uma senha')
              .min(6, 'A senha deve ter no mínimo 6 caracteres')
              .max(20, 'A senha deve ter no máximo 20 caracteres')
          : schema
              .trim()
              .test(
                'minChar',
                `A senha deve ter no mínimo 6 caracteres`,
                (value: string) => !value || value.length >= 6,
              )
              .test(
                'minChar',
                `A senha deve ter no máximo 20 caracteres`,
                (value: string) => value.length < 20,
              );
      }),
      password: yup
        .string()
        .trim()
        .oneOf([yup.ref('passwordCheck'), null], 'As senhas não coincidem'),
      permissionId: yup.string().required('Favor selecionar uma permissão'),
    })
    .required();

  const { handleSubmit, reset, ...userForm } = useForm<
    NewUserInput & { id: string; passwordCheck: string }
  >({
    defaultValues: {
      id: user?.id ?? '',
      email: user?.email ?? '',
      password: '',
      passwordCheck: '',
      name: user?.name ?? '',
      permissionId: user?.permissionId ?? '',
    },
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    shouldUseNativeValidation: false,
  });

  const onSubmitHandler = async (data: NewUserInput) => {
    if (!user) {
      toast.promise(createUser(data), {
        pending: 'Aguardando...',
        success: 'Usuário Cadastrado',
        error: 'Erro ao cadastrar usuário',
      });
    } else {
      toast.promise(confirmEditUser(data), {
        pending: 'Aguardando...',
        success: 'Usuário Editado',
        error: 'Erro ao editar usuário',
      });
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
            <Input control={userForm.control} name='name' label='Nome:' />
            <Input control={userForm.control} name='email' label='E-mail:' />
            <Input
              control={userForm.control}
              name='passwordCheck'
              label='Senha:'
              autoComplete='off'
              type='password'
              onBlur={() =>
                userForm.getFieldState('password').isDirty &&
                userForm.trigger('password')
              }
            />
            <Input
              control={userForm.control}
              name='password'
              label='Confirmar senha:'
              autoComplete='off'
              type='password'
            />
            {!user && <></>}
            <Controller
              control={userForm.control}
              name='permissionId'
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
                    options={permissions.map((perm) => ({
                      value: perm.id,
                      label: perm.permission,
                    }))}
                    noOptionsMessage={() => 'Nenhuma Permissão Cadastrada'}
                    value={permissions
                      .map((perm) => ({
                        value: perm.id,
                        label: perm.permission,
                      }))
                      .find((p) => p.value === value)}
                    onChange={(val) => onChange(val?.value)}
                    placeholder='Selecionar permissão...'
                  />
                  <p className='input-error-message'>{error?.message}</p>
                </div>
              )}
            />
            <div className='form-row buttons_row'>
              <button className='cancel-button' type='reset'>
                <span>Cancelar</span>
              </button>
              <button className='submit-button' type='submit'>
                <span>{user ? 'Confirmar' : 'Cadastrar'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Backdrop>
  );
};

export default UserForm;
