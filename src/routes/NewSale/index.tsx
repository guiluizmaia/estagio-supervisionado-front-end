import NewSaleForm from '../../components/Forms/NewSaleForm';
import '../style.css';
import { NewSaleProvider } from './context';

const NewSaleScreen = () => {
  return (
    <div className='content-simple'>
      <h1 className='content-title'>Nova Venda</h1>
      <NewSaleForm />
    </div>
  );
};

const NewSale = () => {
  return (
    <NewSaleProvider>
      <NewSaleScreen />
    </NewSaleProvider>
  );
};

export default NewSale;
