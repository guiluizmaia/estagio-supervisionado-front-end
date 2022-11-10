import { SaleDetailsProvider, useSaleDetails } from './context';
import '../style.css';
import './style.css';
import ProductsList from './components/ProductsList';

const SaleDetailsScreen = () => {
  const { details, onCancelSale } = useSaleDetails();

  return (
    <div className='content-simple'>
      <h1 className='content-title'>Detalhes</h1>
      <div className='sale-detail__container'>
        <div className='sale-detail__card'>
          <h2 className='sale-detail__card-title'>Dados da venda</h2>
          <div className='sale-detail__row'>
            <p className='sale-detail__label'>Cliente:</p>
            <p className='sale-detail__info'>{details?.client.name}</p>
          </div>
          <div className='sale-detail__row'>
            <p className='sale-detail__label'>Vendedor:</p>
            <p className='sale-detail__info'>{details?.user.name}</p>
          </div>
          <div className='sale-detail__row'>
            <p className='sale-detail__label'>Data da venda:</p>
            {!!details?.created_at && (
              <p className='sale-detail__info'>
                {new Date(details?.created_at).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          <div className='sale-detail__row'>
            <p className='sale-detail__label'>Situação:</p>
            {details?.canceled ? (
              <p className='sale-detail__info sale-detail__canceled'>
                Cancelada
              </p>
            ) : (
              <p className='sale-detail__info'>Concluída</p>
            )}
          </div>
        </div>
        <ProductsList />
        <div className='sale-detail__card'>
          <h2 className='sale-detail__card-title'>Pagamento</h2>
          <div className='sale-detail__row'>
            <p className='sale-detail__label'>Forma de pagamento:</p>
            <p>{details?.formPayment.formPayment}</p>
          </div>
        </div>
        {!details?.canceled && (
          <div className='sale-details__cancel-button-row'>
            <button
              className='sale-details__cancel-button'
              onClick={(e) => {
                e.preventDefault();
                onCancelSale();
              }}
            >
              CANCELAR VENDA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SaleDetails = () => {
  return (
    <SaleDetailsProvider>
      <SaleDetailsScreen />
    </SaleDetailsProvider>
  );
};

export default SaleDetails;
