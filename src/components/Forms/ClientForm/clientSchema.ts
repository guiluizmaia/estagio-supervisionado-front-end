import * as yup from 'yup';
import { validateCpf } from '../../../utils/validations/cpf';
import { addressSchema } from '../AddressForm/addressSchema';

yup.addMethod(yup.string, 'numericString', function () {
  return this.matches(/^\d+$/, 'Utilizar somente números');
});

const phoneSchema = {
  value: yup
    .string()
    .trim()
    .min(10, 'Telefone inválido')
    .max(11, 'Telefone inválido')
    .transform((value) => value.replace(/[^\d]/g, '')),
};

export const clientSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required('Favor informar um nome')
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres'),
    rg: yup
      .string()
      .trim()
      .min(3, 'Mínimo 3 caracteres')
      .max(12, 'Máximo 12 caracteres')
      .required('Favor informar o RG'),
    cpf: yup
      .string()
      .trim()
      .test('test-cpf', `CPF inválido`, (value) => validateCpf(value ?? ''))
      .transform((value) => value.replace(/[^\d]/g, ''))
      .required('Favor informar o CPF'),
    phones: yup
      .array()
      .of(yup.object().shape(phoneSchema))
      .min(1, 'Ao menos 1')
      .required(),
    address: addressSchema.required('Favor informar um endereço').nullable(),
  })
  .required();
