import { useState, useContext } from 'react';
import { AuthContext, AuthContextProps } from '../../context/contextApi';
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../../hooks/useFetchApi';

import './Login.css';

interface LoginFields {
  email: string;
  password: string;
}

const defaultLoginFields: LoginFields = {
  email: '',
  password: '',
};

const Login: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [formFields, SetFromFields] = useState<LoginFields>(defaultLoginFields);
  const { email, password } = formFields;

  const navigate = useNavigate();

  const { login }: AuthContextProps = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetFromFields({ ...formFields, [name]: value });
  };

  const userLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginData: { userId: string; token: string } = await postData(
        '/api/login',
        formFields
      );
      console.log('🚀 loginData:', loginData);

      const { userId, token } = loginData;
      const expiryTime = Date.now() + 12 * 60 * 60 * 1000; // 12 hours from now

      localStorage.setItem(
        'token',
        JSON.stringify({ userId, token, expiryTime })
      );

      login();
      navigate('/');
    } catch (err: any) {
      console.error('Error:', err.message);
      setMessage(err.message);
    }
  };

  return (
    <div className='login-page' onSubmit={userLogin}>
      <h1>Login</h1>

      {message && (
        <div className='message'>
          <h4>{message}</h4>
        </div>
      )}

      <form className='login-form' method='post'>
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={email}
          onChange={handleChange}
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={password}
          onChange={handleChange}
        />
        <button type='submit'>Login</button>
      </form>
      <div className='new-account'>
        <h4>Don't Have Account?</h4>
        <Link to={'/signup'}>Create New Account</Link>
      </div>
    </div>
  );
};

export default Login;
