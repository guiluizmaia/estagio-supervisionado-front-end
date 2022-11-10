import { useMemo } from 'react';
import PaymentMethodForm from '../../components/Forms/PaymentMethodForm';
import Pagination from '../../components/Pagination';
import Table from '../../components/Table';
import '../style.css';
import { PaymentMethodsProvider, usePaymentMethods } from './context';

const PaymentMethodsScreen = () => {
  const {
    paymentMethods,
    toggleShowForm,
    paymentMethodEditing,
    showForm,
    pages,
    editPaymentMethodById,
    changePage,
    deletePaymentMethod,
  } = usePaymentMethods();

  const parsedPaymentMethods = useMemo(() => {
    if (!paymentMethods) return [];
    return paymentMethods.map((paymentMethod) => {
      return {
        id: paymentMethod.id,
        formPayment: paymentMethod.formPayment,

        actions: '',
      };
    });
  }, [paymentMethods]);

  return (
    <div className='content-simple'>
      <h1 className='content-title'>Produtos</h1>
      <div className='button-add-new-row'>
        <button className='button-add-new' onClick={() => toggleShowForm(true)}>
          <i className='bi bi-person-plus'></i>
          <span>Novo</span>
        </button>
      </div>
      <Table
        headers={{
          id: 'id',
          formPayment: 'Forma de pagamento',
          actions: 'Ações',
        }}
        items={parsedPaymentMethods}
        customRenderers={{
          actions: (paymentMethod) => (
            <>
              <button
                className='button button__edit'
                onClick={() => editPaymentMethodById(paymentMethod.id)}
              >
                <i className='bi bi-pencil-square'></i>
              </button>{' '}
              <button
                className='button button__delete'
                onClick={(e) => {
                  e.preventDefault();
                  deletePaymentMethod(paymentMethod.id);
                }}
              >
                <i className='bi bi-trash3'></i>
              </button>
            </>
          ),
        }}
      />

      <Pagination pages={pages} onChange={(page: number) => changePage(page)} />

      {showForm && (
        <PaymentMethodForm paymentMethod={paymentMethodEditing ?? undefined} />
      )}
    </div>
  );
};

const PaymentMethods = () => {
  return (
    <PaymentMethodsProvider>
      <PaymentMethodsScreen />
    </PaymentMethodsProvider>
  );
};

export default PaymentMethods;
