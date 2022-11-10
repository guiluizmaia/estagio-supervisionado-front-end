import React, { useCallback, useState } from 'react';
import { FilterProvider, useFilter } from './context';
import './styles.css';
import Select from 'react-select';
import { FilterType } from '../../types';
import { useSales } from '../../context';

const FilterComponent: React.FC = () => {
  const { clients, onFilter, paymentMethods, users } = useFilter();
  const { filter } = useSales();

  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>(undefined);

  const typeOptions: { value: FilterType; label: string }[] = [
    { value: 'client', label: 'por cliente' },
    { value: 'payment', label: 'por forma de pagamento' },
    { value: 'user', label: 'por vendedor' },
  ];

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    setFilterType(undefined);
    onFilter(undefined);
  };

  const renderFilter = useCallback(() => {
    if (!filterType || !showFilter) return null;
    switch (filterType) {
      case 'client':
        return (
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
            isClearable={true}
            options={clients.map((client) => ({
              value: client.id,
              label: client.name,
            }))}
            value={
              clients
                .map((client) => ({
                  value: client.id,
                  label: client.name,
                }))
                .find((p) => p.value === filter?.param) ?? null
            }
            onChange={(val) => {
              onFilter(
                val?.value
                  ? { filter: 'client', param: val?.value }
                  : undefined,
              );
            }}
            placeholder='Selecionar cliente...'
          />
        );
      case 'user':
        return (
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
            isClearable={true}
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            value={
              users
                .map((user) => ({
                  value: user.id,
                  label: user.name,
                }))
                .find((p) => p.value === filter?.param) ?? null
            }
            onChange={(val) => {
              onFilter(
                val?.value ? { filter: 'user', param: val?.value } : undefined,
              );
            }}
            placeholder='Selecionar vendedor...'
          />
        );
      case 'payment':
        return (
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
            isClearable={true}
            options={paymentMethods.map((payment) => ({
              value: payment.id,
              label: payment.formPayment,
            }))}
            value={
              paymentMethods
                .map((pm) => ({
                  value: pm.id,
                  label: pm.formPayment,
                }))
                .find((p) => p.value === filter?.param) ?? null
            }
            onChange={(val) => {
              onFilter(
                val?.value
                  ? { filter: 'payment', param: val?.value }
                  : undefined,
              );
            }}
            placeholder='Selecionar forma de pagamento...'
          />
        );
      default:
        break;
    }
  }, [
    filterType,
    showFilter,
    clients,
    users,
    paymentMethods,
    filter?.param,
    onFilter,
  ]);

  return (
    <div className='filter-row'>
      <button className='filter-button' onClick={toggleFilter}>
        {showFilter ? (
          <i className='bi bi-x-circle'></i>
        ) : (
          <i className='bi bi-funnel'></i>
        )}
      </button>
      {showFilter && (
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
          value={typeOptions.find((p) => p.value === filterType)}
          isClearable={true}
          options={typeOptions}
          onChange={(val) => {
            setFilterType(val?.value);
            onFilter(undefined);
          }}
          placeholder='filtrar por...'
        />
      )}
      {renderFilter()}
    </div>
  );
};

const Filter = () => {
  return (
    <FilterProvider>
      <FilterComponent />
    </FilterProvider>
  );
};

export default Filter;
