import React from 'react';

const RegisterForm = ({ form, onChange }) => (
  <>
    <input
      type="text"
      placeholder="Username"
      value={form.username}
      onChange={(e) => onChange({ ...form, username: e.target.value })}
    />
    <input
      type="password"
      placeholder="Password"
      value={form.password}
      onChange={(e) => onChange({ ...form, password: e.target.value })}
    />
  </>
);

export default RegisterForm;