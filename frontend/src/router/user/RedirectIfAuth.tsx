import { Navigate } from 'react-router-dom';
import type { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const RedirectIfAuth = ({ children }: Props) => {
  const isAuthenticated = useSelector((state: RootState) => state.userAuth.isAuthenticated);

  return isAuthenticated ? <Navigate to="/home" replace /> : <>{children}</>;
};

export default RedirectIfAuth;
