"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authApi, getUser, getToken } from "./api";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getUser());
  const [token, setTokenState] = useState(() => getToken());
  const [loading, setLoading] = useState(() => !getToken());

  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();

    if (!savedToken) {
      return;
    }

    const restoreSession = async () => {
      try {
        const verifiedUser = await authApi.getSession();
        if (verifiedUser) {
          setUserState(verifiedUser);
        } else if (savedUser) {
          setUserState(savedUser);
        }
      } catch {
        if (savedUser) {
          setUserState(savedUser);
        }
      } finally {
        setLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    setUserState(res.user);
    setTokenState(res.access_token);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register(name, email, password);
    setUserState(res.user);
    setTokenState(res.access_token);
    return res;
  };

  const logout = async () => {
    await authApi.logout();
    setUserState(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
