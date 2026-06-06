/**
 * Shell: Services Context
 * Provides service implementations to the entire app
 * Allows dependency injection without coupling to Firebase
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { ServiceRegistry } from '@core/services';
import { InstantDBDatabase, InstantDBAuth, Base64StorageService } from '@shell/services/instantdb-impl';

// Create context
const ServicesContext = createContext<ServiceRegistry | null>(null);

/**
 * Initialize services (InstantDB for database & auth, Base64Storage for assets)
 */
const initializeServices = (): ServiceRegistry => {
  return {
    database: new InstantDBDatabase(),
    auth: new InstantDBAuth(),
    storage: new Base64StorageService(),
  };
};

/**
 * Services Provider Component
 * Wrap your app with this to provide services
 */
export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services] = React.useState<ServiceRegistry>(() => initializeServices());

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

/**
 * Hook to use services anywhere in the app
 */
export const useServices = (): ServiceRegistry => {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error(
      'useServices must be used within a ServicesProvider. Wrap your app with <ServicesProvider>.'
    );
  }
  return services;
};

/**
 * Individual service hooks for convenience
 */
export const useDatabase = () => useServices().database;
export const useAuth = () => useServices().auth;
export const useStorage = () => useServices().storage;
