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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        setUser(savedUser);
      }
      // Optionally verify with backend
      authApi.getSession().then((verifiedUser) => {
        if (verifiedUser) setUser(verifiedUser);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    setUser(res.user);
    setToken(res.access_token);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register(name, email, password);
    setUser(res.user);
    setToken(res.access_token);
    return res;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
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
