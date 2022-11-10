import React, { useMemo, useState } from 'react';
import Table from '../../../components/Table';
import { currency } from '../../../utils/masks/currency';
import { ReportSales, SaleFilterType } from '../types';
import Select from 'react-select';

const SalesReport: React.FC<{ items: ReportSales[] }> = ({ items }) => {
  const [filter, setFilter] = useState<SaleFilterType>('all');

  const sortedSales = useMemo(() => {
    return items
      ?.filter((s) => {
        if (filter === 'all') return !!s;
        if (filter === 'active') return !s.canceled;
        if (filter === 'excluded') return s.canceled;
      })
      .sort((a, b) => (a.saleDate > b.saleDate ? -1 : 1));
  }, [items, filter]);

  const saleFilterOptions: { value: SaleFilterType; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'active', label: 'Somente concluídas' },
    { value: 'excluded', label: 'Somente canceladas' },
  ];

  const tableData = useMemo(() => {
    switch (filter) {
      case 'all':
        return {
          items: sortedSales.map((sale) => ({
            id: sale.saleId,
            date: new Date(sale.saleDate).toLocaleDateString('pt-BR'),
            value: currency(sale.value),
            profit: currency(sale.profit),
            client: sale.clientName,
            user: sale.userName,
            status: !sale.canceled_at
              ? 'CONCLUÍDA'
              : `CANCELADA EM ${new Date(
                  sale.canceled_at ?? '',
                ).toLocaleDateString('pt-BR')}`,
          })),
          headers: {
            id: 'id',
            date: 'Data',
            value: 'Valor',
            profit: 'Lucro',
            client: 'Cliente',
            user: 'Usuário',
            status: 'Situação',
          },
        };
      case 'excluded':
        return {
          items: sortedSales.map((sale) => ({
            id: sale.saleId,
            date: new Date(sale.saleDate).toLocaleDateString('pt-BR'),
            value: currency(sale.value),
            profit: currency(sale.profit),
            client: sale.clientName,
            user: sale.userName,
            cancelDate: sale.canceled_at
              ? new Date(sale.canceled_at ?? '').toLocaleDateString('pt-BR')
              : '',
          })),
          headers: {
            id: 'id',
            date: 'Data',
            value: 'Valor',
            profit: 'Lucro',
            client: 'Cliente',
            user: 'Usuário',
            cancelDate: 'Data cancelamento',
          },
        };
      case 'active':
        return {
          items: sortedSales.map((sale) => ({
            id: sale.saleId,
            date: new Date(sale.saleDate).toLocaleDateString('pt-BR'),
            value: currency(sale.value),
            profit: currency(sale.profit),
            client: sale.clientName,
            user: sale.userName,
          })),
          headers: {
            id: 'id',
            date: 'Data',
            value: 'Valor',
            profit: 'Lucro',
            client: 'Cliente',
            user: 'Usuário',
          },
        };

      default:
        return null;
    }
  }, [filter, sortedSales]);
  return (
    <div>
      {!!sortedSales && (
        <>
          <p>Filtrar por situação da venda:</p>
          <Select
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                text: '#04050D',
                primary25: '#FFF6EC',
                primary: '#D9A53B',
              },
            })}
            options={saleFilterOptions}
            placeholder='Filtrar...'
            value={saleFilterOptions.find((p) => p.value === filter)}
            onChange={(val) => {
              setFilter(val?.value ?? 'all');
            }}
          />
          <br></br>
          {tableData && <Table {...tableData} />}
        </>
      )}
    </div>
  );
};

export default SalesReport;
/*  filter === 'active'
        ? {
            items: sortedSales.map((sale) => ({
              id: sale.saleId,
              date: new Date(sale.saleDate).toLocaleDateString('pt-BR'),
              value: currency(sale.value),
              profit: currency(sale.profit),
              client: sale.clientName,
              user: sale.userName,
            })),
            headers: {
              id: 'id',
              date: 'Data',
              value: 'Valor',
              profit: 'Lucro',
              client: 'Cliente',
              user: 'Usuário',
            },
          }
        : {
            items: sortedSales.map((sale) => ({
              id: sale.saleId,
              date: new Date(sale.saleDate).toLocaleDateString('pt-BR'),
              value: currency(sale.value),
              profit: currency(sale.profit),
              client: sale.clientName,
              user: sale.userName,
              teste: undefined,
            })),
            headers: {
              id: 'id',
              date: 'Data',
              value: 'Valor',
              profit: 'Lucro',
              client: 'Cliente',
              user: 'Usuário',
              status: 'Situação',
            },
          }, */
