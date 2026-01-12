import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, OWNER_EMAIL } from '@shell/auth';
import { registerServiceWorker, unregisterServiceWorker } from '@shell/utils/serviceWorkerManager';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isOwner: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    // Service worker will be unregistered by the useEffect above
  };

  const isOwner = user?.email === OWNER_EMAIL;

  return (
    <AuthContext.Provider value={{ user, loading, isOwner, login, logout }}>
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
