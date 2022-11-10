import * as yup from 'yup';

const productSchema = {
  productId: yup.string().required('Favor selecionar um produto'),
  type: yup.string().oneOf(['ADD', 'SUB']).required('Favor selecionar um tipo'),
  price: yup.number().when('type', {
    is: 'ADD',
    then: yup.number().required('Favor informar o preço'),
    otherwise: yup.number().strip(),
  }),

  qntd: yup
    .number()
    .positive('Quantidade deve ser maior que 0')
    .integer('Quantidade deve ser um número inteiro')
    .required('Favor informar a quantidade'),
};

export const stockInputSchema = yup
  .object({
    date: yup
      .date()
      .max(new Date(), 'A data deve ser igual ou anterior a data atual'),
    products: yup
      .array()
      .of(yup.object().shape(productSchema))
      .min(1, 'Pelo menos 1')
      .required(),
  })
  .required();
