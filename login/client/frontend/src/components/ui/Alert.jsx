import React from 'react';

const Alert = ({ message, type = 'error' }) => (
  <div className={`alert ${type}`}>{message}</div>
);

export default Alert;