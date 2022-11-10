import { useMemo } from 'react';
import ClientCard from '../../components/ClientCard';
import ClientForm from '../../components/Forms/ClientForm';
import Pagination from '../../components/Pagination';
import Table from '../../components/Table';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useAuth } from '../../providers/AuthProvider';
import { cpfMask } from '../../utils/masks/cpf';
import { phoneMask } from '../../utils/masks/phone';
import '../style.css';
import { ClientsProvider, useClients } from './context';

const ClientsScreen = () => {
  const {
    clients,
    toggleShowForm,
    clientEditing,
    showForm,
    pages,
    editClientById,
    changePage,
    onSearch,
    search,
    excludeClient,
    readOnlyForm,
  } = useClients();

  const { user } = useAuth();
  const { width } = useWindowDimensions();

  const isSmallScreen = useMemo(() => width < 1000, [width]);

  const parsedClients = useMemo(() => {
    if (!clients) return [];
    return clients.map((client) => {
      const mainAddress =
        (client.addresses?.length ?? 0) > 0 ? client.addresses[0] : null;
      return {
        id: client.id,
        name: client.name,
        cpf: cpfMask(client.cpf),
        phone: client.phones
          .map((phone) => phoneMask(`${phone.ddd}${phone.number}`))
          .join('\n'),
        address: `${mainAddress?.street}, ${mainAddress?.number} - ${mainAddress?.district} - ${mainAddress?.city}/${mainAddress?.state}`,
        actions: '',
      };
    });
  }, [clients]);

  return (
    <div className='content-simple'>
      <h1 className='content-title'>Clientes</h1>
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
            placeholder='Buscar por nome ou cpf'
            onChange={(e) => onSearch(e.target.value)}
            value={search}
          ></input>
        </div>
      </div>
      {!isSmallScreen ? (
        <Table
          headers={{
            id: 'id',
            name: 'Nome',
            cpf: 'CPF',
            phone: 'Telefones',
            address: 'Endereço',
            actions: 'Ações',
          }}
          items={parsedClients}
          customRenderers={{
            actions: (client) => (
              <>
                <button
                  disabled={user?.permissionName !== 'ADMIN'}
                  className='button button__edit'
                  onClick={() => editClientById(client.id)}
                >
                  <i className='bi bi-pencil-square'></i>
                </button>{' '}
                <button
                  className='button button__edit'
                  onClick={() => editClientById(client.id, true)}
                >
                  <i className='bi bi-eye'></i>
                </button>{' '}
                <button
                  className='button button__delete'
                  onClick={(e) => {
                    e.preventDefault();
                    excludeClient(client.id);
                  }}
                >
                  <i className='bi bi-trash3'></i>
                </button>
              </>
            ),
          }}
        />
      ) : (
        clients.map((client) => <ClientCard key={client.id} data={client} />)
      )}
      <Pagination pages={pages} onChange={(page: number) => changePage(page)} />

      {showForm && (
        <ClientForm
          client={clientEditing ?? undefined}
          readOnly={readOnlyForm}
        />
      )}
    </div>
  );
};

const Clients = () => {
  return (
    <ClientsProvider>
      <ClientsScreen />
    </ClientsProvider>
  );
};

export default Clients;
