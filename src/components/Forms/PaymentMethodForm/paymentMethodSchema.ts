import * as yup from 'yup';

export const paymentMethodSchema = yup
  .object({
    formPayment: yup
      .string()
      .trim()
      .required('Favor informar forma de pagamento')
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres'),
  })
  .required();
