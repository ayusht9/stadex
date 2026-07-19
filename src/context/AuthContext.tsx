import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

export type Role = 'Fan' | 'Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage?.getItem('fifa26_user');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (user) {
          window.localStorage?.setItem('fifa26_user', JSON.stringify(user));
        } else {
          window.localStorage?.removeItem('fifa26_user');
        }
      } catch {
        // ignore in tests
      }
    }
  }, [user]);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
