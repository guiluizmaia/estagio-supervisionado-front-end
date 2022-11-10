import React from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useClients } from '../../routes/Clients/context';
import { Client } from '../../routes/Clients/types';
import { cpfMask } from '../../utils/masks/cpf';
import { phoneMask } from '../../utils/masks/phone';
import '../UserCard/style.css';

const ClientCard: React.FC<{ data: Client }> = ({ data }) => {
  const { editClient } = useClients();
  const { user } = useAuth();

  return (
    <div className='user-card'>
      <p className='card-title'>{data.name}</p>
      <div className='card-row'>
        <p className='card-label'>CPF: </p>
        <p className='card-info'>{cpfMask(data.cpf)}</p>
      </div>
      <div className='card-row'>
        <p className='card-label'>RG: </p>
        <p className='card-info'>{data.rg}</p>
      </div>
      <div className='card-row'>
        <p className='card-label'>Endereço: </p>
        <p className='card-info'>
          {`${data.addresses[0].street}, ${data.addresses[0].number} - ${data.addresses[0].district} - ${data.addresses[0].city}/${data.addresses[0].state}`}
        </p>
      </div>
      <div className='card-row'>
        <p className='card-label'>Telefone: </p>
        <p className='card-info'>
          {phoneMask(`${data.phones[0].ddd}${data.phones[0].number}`)}
        </p>
      </div>

      {user?.permissionName === 'ADMIN' && (
        <div className='card-row'>
          <button
            className='button button__edit'
            onClick={() => editClient(data)}
          >
            <i className='bi bi-pencil-square'></i>
          </button>
        </div>
      )}

      <div className='card-row card-row__end'>
        <p className='card-label'>
          criado{' '}
          {new Date(data.created_at).toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default ClientCard;
