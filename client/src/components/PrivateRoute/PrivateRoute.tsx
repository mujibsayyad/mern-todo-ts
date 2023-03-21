import { useEffect, useContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext, AuthContextProps } from '../../context/contextApi';

const PrivateRoute: React.FC = () => {
  const { isLoggedIn, token }: AuthContextProps = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && !token) {
      navigate('/login');
    }
  }, [isLoggedIn, token]);

  return <Outlet />;
};

export default PrivateRoute;
