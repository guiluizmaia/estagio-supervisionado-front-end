import React, { useMemo } from 'react';
import { useUsers } from '../../routes/Users/contex';
import { User } from '../../routes/Users/types';
import './style.css';

const UserCard: React.FC<{ data: User }> = ({ data }) => {
  const { permissions, deleteUser, editUser } = useUsers();

  const permissionName = useMemo(() => {
    const userPermission = permissions.find(
      (perm) => perm.id === data.permissionId,
    );
    return userPermission?.permission;
  }, [data.permissionId, permissions]);

  return (
    <div className='user-card'>
      <p className='card-title'>{data.name}</p>
      <div className='card-row'>
        <p className='card-label'>Email: </p>
        <p className='card-info'>{data.email}</p>
      </div>
      {!!permissionName && (
        <div className='card-row'>
          <p className='card-label'>Permissão: </p>
          <p className='card-info'>{permissionName}</p>
        </div>
      )}

      <div className='card-row'>
        <button className='button button__edit' onClick={() => editUser(data)}>
          <i className='bi bi-pencil-square'></i>
        </button>
        <button
          className='button button__delete'
          onClick={() => deleteUser(data.id)}
        >
          <i className='bi bi-trash3'></i>
        </button>
      </div>

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

export default UserCard;
