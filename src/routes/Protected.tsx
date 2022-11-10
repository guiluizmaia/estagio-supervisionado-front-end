import React, { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

interface Props {
  redirectPath: string;
  admin?: boolean;
}

const Protected: React.FC<PropsWithChildren<Props>> = ({
  redirectPath,
  children,
  admin,
}) => {
  const token = localStorage.getItem('token');
  const { user } = useAuth();

  if (!token || (admin && user?.permissionName !== 'ADMIN')) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default Protected;
