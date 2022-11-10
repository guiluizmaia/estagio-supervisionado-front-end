import { useMemo, useState } from 'react';
import StockInputForm from '../../components/Forms/StockInputForm';
import Table from '../../components/Table';
import './styles.css';
import '../style.css';
import { StockProvider, useStock } from './context';
import { currency } from '../../utils/masks/currency';

const StockScreen = () => {
  const { onToggleShowInputForm, showInputForm, history, onChangeDate } =
    useStock();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const parsedSales = useMemo(() => {
    if (!history) return [];
    const teste = history.map((hist) => {
      return hist.products.map((prod) => {
        return {
          id: prod.id,
          date: new Date(hist.date).toLocaleDateString('pt-BR'),
          product: prod.name,
          type: prod.type === 'ADD' ? 'Entrada' : 'Saída',
          qntd: prod.qntd,
          price: !prod?.price ? '-' : currency(Number(prod.price)),
        };
      });
    });

    return teste.reduce((accumulator, value) => accumulator.concat(value), []);
  }, [history]);

  return (
    <div className='content-simple'>
      <h1 className='content-title'>Estoque</h1>
      <button
        className='submit-button'
        onClick={() => onToggleShowInputForm(true)}
      >
        <span>Nova movimentação</span>
      </button>
      <div className='dates-filter'>
        <div className='dates-filter__group'>
          <p>Data início:</p>
          <input
            type='date'
            name='start_date'
            max={endDate}
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              onChangeDate(e.target.value, 'start');
            }}
          />
        </div>
        <div className='dates-filter__group'>
          <p>Data fim:</p>
          <input
            type='date'
            name='end_date'
            min={startDate}
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              onChangeDate(e.target.value, 'end');
            }}
          />
        </div>
      </div>
      <Table
        headers={{
          id: 'id',
          date: 'Data',
          product: 'Produtos',
          type: 'Operação',
          qntd: 'Quantidade',
          price: 'Preço',
        }}
        items={parsedSales}
      />
      {showInputForm && <StockInputForm />}
    </div>
  );
};

const Stock = () => {
  return (
    <StockProvider>
      <StockScreen />
    </StockProvider>
  );
};

export default Stock;
