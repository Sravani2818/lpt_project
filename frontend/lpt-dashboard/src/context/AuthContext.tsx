import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { roles } from '../data/mockData';
import { login as apiLogin, signup as apiSignup, type SignupPayload } from '../services/api';
import type { AuthSession, RoleId, User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  roleName: string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (payload: SignupPayload) => Promise<boolean>;
  logout: () => void;
  isLearner: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'lpt_auth_session';

function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    if (!result) return false;
    setSession(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    return true;
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    return apiSignup(payload);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const roleName = useMemo(() => {
    if (!session) return '';
    return roles.find((r) => r.role === session.user.role)?.rolename ?? '';
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      roleName,
      isAuthenticated: !!session,
      login,
      signup,
      logout,
      isLearner: session?.user.role === 1,
      isAdmin: session?.user.role === 3,
    }),
    [session, roleName, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useRoleId(): RoleId {
  const { user } = useAuth();
  return (user?.role ?? 1) as RoleId;
}
