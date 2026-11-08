import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const LOGIN_PATTERN = /^[a-zA-Z]+\d$/;

const validate = ({ login, password }) => {
  const errors = {};

  if (!login.trim()) {
    errors.login = 'Enter your login';
  } else if (!LOGIN_PATTERN.test(login.trim())) {
    errors.login = 'Login must be your name followed by the course number, e.g. mark5';
  }

  if (!password) {
    errors.password = 'Enter your password';
  } else if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters long';
  }

  return errors;
};

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ login: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    if (!login(values.login.trim(), values.password)) {
      setFormError('Incorrect login or password');
      return;
    }

    navigate('/dashboard', { replace: true });
  };

  return (
    <main className="login">
      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <h1 className="login__title">Sign in</h1>

        <label className="field">
          <span className="field__label">Login</span>
          <input
            className={`field__input ${errors.login ? 'field__input--error' : ''}`}
            name="login"
            value={values.login}
            onChange={handleChange}
            autoComplete="username"
            placeholder="mark5"
          />
          {errors.login && <span className="field__error">{errors.login}</span>}
        </label>

        <label className="field">
          <span className="field__label">Password</span>
          <input
            className={`field__input ${errors.password ? 'field__input--error' : ''}`}
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && <span className="field__error">{errors.password}</span>}
        </label>

        {formError && <p className="login__error" role="alert">{formError}</p>}

        <button className="button" type="submit">Log in</button>
      </form>
    </main>
  );
};

export default LoginPage;
