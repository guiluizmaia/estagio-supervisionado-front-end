import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../../components/Forms/LoginForm';
import { useAuth } from '../../providers/AuthProvider';
import '../style.css';

const Login: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div className='content'>
      <LoginForm />
    </div>
  );
};

export default Login;
