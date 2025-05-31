import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', form);
      alert('Registered successfully');
      navigate('/login');
    } catch {
      alert('Username already taken');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <RegisterForm form={form} onChange={setForm} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;