import { useMemo } from 'react';
import Pagination from '../../components/Pagination';
import Table from '../../components/Table';
import '../style.css';
import { SalesProvider, useSales } from './context';
import { useNavigate } from 'react-router-dom';
import { currency } from '../../utils/masks/currency';
import Filter from './components/Filter';

const SalesScreen = () => {
  const { sales, pages, changePage } = useSales();
  const navigation = useNavigate();

  const parsedSales = useMemo(() => {
    if (!sales) return [];
    return sales.map((sale) => {
      return {
        id: sale.id,
        name: sale.client.name,
        total: currency(sale.amount),
        date: new Date(sale.created_at).toLocaleDateString('pt-BR'),
        status: sale.canceled ? 'CANCELADA' : 'CONCLUÍDA',
      };
    });
  }, [sales]);

  return (
    <div className='content-simple'>
      <h1 className='content-title'>Vendas</h1>
      <div className='button-add-new-row'>
        <button
          className='button-add-new'
          onClick={() => navigation('/novavenda')}
        >
          <i className='bi bi-person-plus'></i>
          <span>Novo</span>
        </button>
      </div>
      <Filter />
      <Table
        headers={{
          id: 'id',
          name: 'Nome',
          total: 'Total',
          date: 'Data',
          status: 'Situação',
        }}
        items={parsedSales}
        action={(id: string) => navigation(`/vendas/${id}`)}
      />

      <Pagination pages={pages} onChange={(page: number) => changePage(page)} />
    </div>
  );
};

const Sales = () => {
  return (
    <SalesProvider>
      <SalesScreen />
    </SalesProvider>
  );
};

export default Sales;
