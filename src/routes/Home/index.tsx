import { useAuth } from '../../providers/AuthProvider';
import '../style.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const navigation = useNavigate();

  return (
    <div className='content'>
      <h1>Olá, {user?.name}!</h1>
      <button
        className='submit-button'
        onClick={() => navigation('/novavenda')}
      >
        <span>Venda</span>
      </button>
    </div>
  );
};

export default Home;
