import { useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Todo from './components/Todo/Todo';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { AuthContext, AuthContextProps } from './context/contextApi';
import Error404 from './components/ErrorPage/Error404';
import './App.css';

function App() {
  const { isLoggedIn, token, login }: AuthContextProps =
    useContext(AuthContext);

  useEffect(() => {
    login();
  }, []);

  return (
    <Routes>
      <Route
        path='login'
        element={isLoggedIn && token ? <Navigate to='/' /> : <Login />}
      />
      <Route
        path='signup'
        element={isLoggedIn && token ? <Navigate to='/' /> : <Signup />}
      />

      <Route element={<PrivateRoute />}>
        <Route path='/' element={<Todo />} />
      </Route>

      <Route path='*' element={<Error404 />} />
    </Routes>
  );
}

export default App;
