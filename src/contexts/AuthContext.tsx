import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setMockRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<UserRole, User> = {
  admin: {
    id: 'admin-1',
    email: 'admin@devup.org',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date(),
  },
  organization: {
    id: 'org-user-1',
    email: 'org@techcorp.com',
    name: 'TechCorp Team',
    role: 'organization',
    createdAt: new Date(),
  },
  student: {
    id: 'student-1',
    email: 'student@university.edu',
    name: 'Student User',
    role: 'student',
    createdAt: new Date(),
  },
  public: {
    id: 'public-1',
    email: '',
    name: 'Guest',
    role: 'public',
    createdAt: new Date(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('public');

  const login = async (email: string, password: string, loginRole: UserRole) => {
    // Mock login - in production, this would call Supabase auth
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser = mockUsers[loginRole];
    setUser({ ...mockUser, email });
    setRole(loginRole);
  };

  const logout = () => {
    setUser(null);
    setRole('public');
  };

  const setMockRole = (newRole: UserRole) => {
    if (newRole === 'public') {
      setUser(null);
    } else {
      setUser(mockUsers[newRole]);
    }
    setRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user && role !== 'public',
        login,
        logout,
        setMockRole,
      }}
    >
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
