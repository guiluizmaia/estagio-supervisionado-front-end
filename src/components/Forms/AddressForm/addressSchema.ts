import * as yup from 'yup';

yup.addMethod(yup.string, 'numericString', function () {
  return this.matches(/^\d+$/, 'utilizar somente números');
});

export const addressSchema = yup
  .object({
    zipCode: yup
      .string()
      .trim()
      .min(8, 'CEP inválido')
      .max(8, 'CEP inválido')
      .transform((value) => value.replace(/[^\d]/g, ''))
      .required('Favor informar o CEP'),
    city: yup
      .string()
      .trim()
      .max(100, 'Campo cidade deve ter no máximo 100 caracteres')
      .required('Favor informar a cidade'),
    state: yup
      .string()
      .trim()
      .max(100, 'Campo estado deve ter no máximo 100 caracteres')
      .required('Favor informar o estado'),
    district: yup
      .string()
      .trim()
      .max(100, 'Campo bairro deve ter no máximo 100 caracteres')
      .required('Favor informar o bairro'),
    street: yup
      .string()
      .trim()
      .max(100, 'Campo rua deve ter no máximo 100 caracteres')
      .required('Favor informar a rua'),
    complement: yup
      .string()
      .trim()
      .max(100, 'campo complemento deve ter no máximo 100 caracteres'),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    number: yup.string().numericString().required('Favor informar o número'),
  })
  .required();
