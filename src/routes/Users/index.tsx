import UserForm from '../../components/Forms/UserForm';
import UserCard from '../../components/UserCard';
import './style.css';
import '../style.css';
import { UsersProvider, useUsers } from './contex';
import Pagination from '../../components/Pagination';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useMemo } from 'react';
import Table from '../../components/Table';

const UsersScreen = () => {
  const {
    users,
    showForm,
    toggleShowForm,
    userEditing,
    changePage,
    pages,
    permissions,
    editUserById,
    deleteUser,
  } = useUsers();

  const { width } = useWindowDimensions();

  const isSmallScreen = useMemo(() => width < 1000, [width]);

  const parsedUsers = useMemo(() => {
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      perm: permissions.find((_perm) => _perm.id === user.permissionId)
        ?.permission,
      createdAt: new Date(user.created_at).toLocaleDateString('pt-BR'),
      actions: '',
    }));
  }, [permissions, users]);

  return (
    <div className='content-simple'>
      <h1 className='content-title'>Usuários</h1>
      <div className='button-add-new-row'>
        <button className='button-add-new' onClick={() => toggleShowForm(true)}>
          <i className='bi bi-person-plus'></i>
          <span>Novo</span>
        </button>
      </div>
      {!isSmallScreen ? (
        <Table
          headers={{
            id: 'id',
            name: 'Nome',
            email: 'Email',
            perm: 'Permissão',
            createdAt: 'Criado em',
            actions: 'Ações',
          }}
          items={parsedUsers}
          customRenderers={{
            actions: (user) => (
              <>
                <button
                  className='button button__edit'
                  onClick={() => editUserById(user.id)}
                >
                  <i className='bi bi-pencil-square'></i>
                </button>{' '}
                <button
                  className='button button__delete'
                  onClick={() => deleteUser(user.id)}
                >
                  <i className='bi bi-trash3'></i>
                </button>
              </>
            ),
          }}
        ></Table>
      ) : (
        users.map((user) => {
          return <UserCard key={user.id} data={user} />;
        })
      )}
      <Pagination pages={pages} onChange={(page: number) => changePage(page)} />
      {showForm && <UserForm user={userEditing ?? undefined} />}
    </div>
  );
};

const Users = () => {
  return (
    <UsersProvider>
      <UsersScreen />
    </UsersProvider>
  );
};

export default Users;
