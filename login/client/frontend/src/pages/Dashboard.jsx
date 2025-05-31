import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/welcome')
      .then(res => setMessage(res.data.message))
      .catch(() => navigate('/login'));
  }, [navigate]);

  return (
    <div>
      <h2>{message}</h2>
      <button onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>Logout</button>
    </div>
  );
};

export default Dashboard;