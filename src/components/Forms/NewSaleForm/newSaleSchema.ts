import * as yup from 'yup';

export const newSaleSchema = yup
  .object({
    products: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            id: yup.string().required('Favor selecionar um produto'),
            qntd: yup
              .number()
              .positive('Favor informar uma quantidade acima de 0')
              .typeError('Favor informar a quantidade')
              .required('Favor informar a quantidade'),
          })
          .required(),
      )
      .min(1),
    clientsId: yup.string().required('Favor selecionar o cliente'),
  })
  .required();

export const paymentSchema = yup.object({
  formPaymentId: yup.string().required('Favor selecionar a forma de pagamento'),
});
