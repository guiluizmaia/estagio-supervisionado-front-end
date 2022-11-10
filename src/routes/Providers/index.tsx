import { useMemo } from 'react';
import ProviderForm from '../../components/Forms/ProviderForm';
import Pagination from '../../components/Pagination';
import Table from '../../components/Table';

import { cnpjMask } from '../../utils/masks/cnpj';

import '../style.css';
import { ProvidersProvider, useProviders } from './context';

const ProvidersScreen = () => {
  const {
    providers,
    editProviderById,
    excludeProvider,
    showForm,
    providerEditing,
    toggleShowForm,
    pages,
    changePage,
    readOnlyForm,
    search,
    onSearch,
  } = useProviders();

  const parsedProviders = useMemo(() => {
    if (!providers) return [];
    return providers.map((provider) => {
      return {
        id: provider.id,
        name: provider.name,
        cnpj: cnpjMask(provider.cnpj),
        email: provider.email,
        obs: provider.obs,
        actions: '',
      };
    });
  }, [providers]);

  return (
    <div className='content-simple'>
      <h1 className='content-title'>Fornecedores</h1>
      <div className='button-add-new-row'>
        <button className='button-add-new' onClick={() => toggleShowForm(true)}>
          <i className='bi bi-person-plus'></i>
          <span>Novo</span>
        </button>
      </div>
      <div>
        <div className='form-row' style={{ marginBottom: '1rem' }}>
          <input
            className='form-input'
            style={{ borderBottom: '2px solid #04050D' }}
            placeholder='Buscar por nome'
            onChange={(e) => onSearch(e.target.value)}
            value={search}
          ></input>
        </div>
      </div>
      <Table
        headers={{
          id: 'id',
          name: 'Nome',
          cnpj: 'CNPJ',
          email: 'Email',
          obs: 'Obs',
          actions: 'Ações',
        }}
        items={parsedProviders}
        customRenderers={{
          actions: (prov) => (
            <>
              <button
                className='button button__edit'
                onClick={() => editProviderById(prov.id)}
              >
                <i className='bi bi-pencil-square'></i>
              </button>{' '}
              <button
                className='button button__edit'
                onClick={() => editProviderById(prov.id, true)}
              >
                <i className='bi bi-eye'></i>
              </button>{' '}
              <button
                className='button button__delete'
                onClick={(e) => {
                  e.preventDefault();
                  excludeProvider(prov.id);
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
        <ProviderForm
          provider={providerEditing ?? undefined}
          readOnly={readOnlyForm}
        />
      )}
    </div>
  );
};

const Providers = () => {
  return (
    <ProvidersProvider>
      <ProvidersScreen />
    </ProvidersProvider>
  );
};

export default Providers;
