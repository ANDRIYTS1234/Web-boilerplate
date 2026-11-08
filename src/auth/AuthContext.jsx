import { createContext, useContext, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import {
  AUTH_COOKIE, AUTH_COOKIE_DAYS, VALID_LOGIN, VALID_PASSWORD,
} from './credentials';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => Cookies.get(AUTH_COOKIE) || null);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: (login, password) => {
      if (login !== VALID_LOGIN || password !== VALID_PASSWORD) {
        return false;
      }
      Cookies.set(AUTH_COOKIE, login, { expires: AUTH_COOKIE_DAYS, sameSite: 'strict' });
      setUser(login);
      return true;
    },
    logout: () => {
      Cookies.remove(AUTH_COOKIE);
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
