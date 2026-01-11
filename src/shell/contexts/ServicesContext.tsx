/**
 * Shell: Services Context
 * Provides service implementations to the entire app
 * Allows dependency injection without coupling to Firebase
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { ServiceRegistry } from '@core/services';
import { FirebaseDatabase, FirebaseAuth, FirebaseStorage } from '@shell/services/firebase-impl';

// Create context
const ServicesContext = createContext<ServiceRegistry | null>(null);

/**
 * Initialize Firebase services (can be replaced with other providers)
 */
const initializeServices = (): ServiceRegistry => {
  return {
    database: new FirebaseDatabase(),
    auth: new FirebaseAuth(),
    storage: new FirebaseStorage(),
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
