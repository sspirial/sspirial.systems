import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OWNER_EMAIL } from '@shell/auth';
import { useServices } from '@shell/contexts/ServicesContext';
import { registerServiceWorker, unregisterServiceWorker } from '@shell/utils/serviceWorkerManager';

interface UserSession {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  isOwner: boolean;
  sendMagicCode: (email: string) => Promise<void>;
  verifyMagicCode: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const services = useServices();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = services.auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [services]);

  // Manage service worker based on authentication state
  useEffect(() => {
    if (loading) return; // Wait for auth to initialize

    if (user) {
      // User is logged in - enable offline support
      registerServiceWorker();
    } else {
      // User is logged out - disable offline support
      unregisterServiceWorker();
    }
  }, [user, loading]);

  const sendMagicCode = async (email: string) => {
    await services.auth.sendMagicCode(email);
  };

  const verifyMagicCode = async (email: string, code: string) => {
    const session = await services.auth.verifyMagicCode(email, code);
    setUser(session);
  };

  const logout = async () => {
    await services.auth.signOut();
    setUser(null);
  };

  const isOwner = user?.email === OWNER_EMAIL;

  return (
    <AuthContext.Provider value={{ user, loading, isOwner, sendMagicCode, verifyMagicCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
