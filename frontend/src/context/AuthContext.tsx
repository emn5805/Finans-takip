import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

import api from '../lib/api';
import { AuthResponse, User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  const token = localStorage.getItem('auth_token');
  const userRaw = localStorage.getItem('auth_user');
  return { token, user: userRaw ? (JSON.parse(userRaw) as User) : null };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const stored = getStoredAuth();
  const [user, setUser] = useState<User | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);
  const [loading, setLoading] = useState(false);

  const persistAuth = (auth: AuthResponse) => {
    localStorage.setItem('auth_token', auth.token);
    localStorage.setItem('auth_user', JSON.stringify(auth.user));
    setToken(auth.token);
    setUser(auth.user);
  };

  const resolveError = (error: unknown, type: 'login' | 'register') => {
    const defaultMessage = type === 'login' ? 'Giriş başarısız oldu.' : 'Kayıt işlemi başarısız oldu.';
    if ((error as AxiosError)?.isAxiosError) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError.response?.status;
      if (status === 409) {
        return 'Bu kullanıcı zaten kayıtlı.';
      }
      if (status === 401) {
        return 'E-posta veya şifre hatalı.';
      }
      return axiosError.response?.data?.message ?? defaultMessage;
    }
    return defaultMessage;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post<{ data: AuthResponse }>('/auth/login', { email, password });
      persistAuth(data.data);
      navigate('/dashboard');
    } catch (error) {
      throw new Error(resolveError(error, 'login'));
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post<{ data: AuthResponse }>('/auth/register', { email, password });
      persistAuth(data.data);
      navigate('/dashboard');
    } catch (error) {
      throw new Error(resolveError(error, 'register'));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    navigate('/auth');
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
