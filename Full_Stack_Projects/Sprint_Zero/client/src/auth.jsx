import { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken, getToken } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session on load via GET /auth/me (if a token exists).
  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    api.me()
      .then((d) => setUser(d.user))
      .catch(() => { setToken(null); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const d = await api.login(email, password);
    setToken(d.access_token);
    setUser(d.user);
  }

  async function signup(email, password) {
    const d = await api.signup(email, password);
    setToken(d.access_token);
    setUser(d.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
