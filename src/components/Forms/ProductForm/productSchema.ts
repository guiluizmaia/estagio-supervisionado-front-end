import * as yup from 'yup';

export const productSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required('Favor informar um nome')
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres'),
    description: yup
      .string()
      .trim()
      .required('Favor informar uma descrição')
      .min(3, 'Mínimo 3 caracteres')
      .max(255, 'Máximo 255 caracteres'),
    paidPrice: yup.number().positive().required('Favor informar valor pago'),
    salePrice: yup
      .number()
      .positive()
      .moreThan(
        yup.ref('paidPrice'),
        'Preço de venda deve ser maior que o valor pago',
      )
      .required('Favor informar preço de venda'),
    qntd: yup
      .number()
      .positive()
      .integer()
      .required('Favor informar o estoque inicial'),
    providerId: yup.string().required('Favor selecionar um fornecedor'),
  })
  .required();
