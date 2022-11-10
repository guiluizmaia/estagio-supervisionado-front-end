import * as yup from 'yup';
import { validateCnpj } from '../../../utils/validations/cnpj';

export const providerSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required('Favor informar um nome')
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres'),
    cnpj: yup
      .string()
      .trim()
      .required('Favor informar o cnpj')
      .test('test-cpf', `CPF inválido`, (value) => validateCnpj(value ?? ''))
      .transform((value) => value.replace(/[^\d]/g, '')),
    obs: yup.string().trim().max(255, 'Máximo 255 caracteres'),
    email: yup
      .string()
      .trim()
      .email('Favor informar um email válido')
      .max(50, 'Máximo 50 caracteres')
      .required('Favor informar um email'),
  })
  .required();
