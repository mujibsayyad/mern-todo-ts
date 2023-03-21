import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData, postData } from '../../hooks/useFetchApi';

import './Signup.css';

interface FormFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const defualtFormFields: FormFields = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Signup: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [formFields, SetFromFields] = useState<FormFields>(defualtFormFields);
  const { name, email, password, confirmPassword } = formFields;

  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  // handle change of form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetFromFields({ ...formFields, [name]: value });
  };

  // Create new user
  const newUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setMessage('Must fill all input fields');
      return;
    }

    if (password.length < 7) {
      setMessage('Password length should be atleast 7 characters');

      if (passwordRef.current) {
        passwordRef.current?.focus();
        passwordRef.current.style.outline = 'none';
        passwordRef.current.style.outline = '2px solid red';
      }
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Password did not match');
      return;
    }

    try {
      let userData = await postData('/api/signup', formFields);
      console.log('🚀 Signup.tsx:33 ~ userData:', userData);
      navigate('/login');
    } catch (err: any) {
      console.error('Error:', err.message);
      setMessage(err.message);
    }
  };

  return (
    <div className='signup-page'>
      <h1>Signup</h1>

      {message && (
        <div className='message'>
          <h4>{message}</h4>
        </div>
      )}

      <form className='signup-form' method='post' onSubmit={newUser}>
        <input
          type='text'
          name='name'
          placeholder='Full Name'
          value={name}
          onChange={handleChange}
          required
        />
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={email}
          onChange={handleChange}
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={password}
          onChange={handleChange}
          ref={passwordRef}
          required
        />
        <input
          type='password'
          name='confirmPassword'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={handleChange}
          required
        />
        <button type='submit'>Signup</button>
      </form>

      <div className='login-back'>
        <span>Go To</span> <Link to={'/login'}>Login Page</Link>
      </div>
    </div>
  );
};

export default Signup;
