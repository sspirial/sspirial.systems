/**
 * Service Worker Manager - Shell Layer
 * 
 * Manages the lifecycle of the service worker based on authentication state.
 * Only allows offline functionality when a user is authenticated.
 */

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

/**
 * Register the service worker for offline support
 * Only called when user is authenticated
 */
export const registerServiceWorker = async (): Promise<void> => {
  // Only register in production and if browser supports service workers
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) {
    return;
  }

  // Don't re-register if already registered
  if (serviceWorkerRegistration) {
    return;
  }

  try {
    serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('✓ Offline mode enabled - Service worker registered');

    // Handle updates
    serviceWorkerRegistration.addEventListener('updatefound', () => {
      const newWorker = serviceWorkerRegistration?.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New version available - refresh to update');
          }
        });
      }
    });
  } catch (error) {
    console.warn('Service worker registration failed:', error);
    serviceWorkerRegistration = null;
  }
};

/**
 * Unregister the service worker and clear caches
 * Called when user logs out to disable offline functionality
 */
export const unregisterServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    // Get all registrations and unregister them
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    await Promise.all(
      registrations.map(registration => registration.unregister())
    );

    // Clear all caches
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );

    serviceWorkerRegistration = null;
    
    console.log('✓ Offline mode disabled - Service worker unregistered');
  } catch (error) {
    console.warn('Service worker unregistration failed:', error);
  }
};

/**
 * Check if service worker is currently active
 */
export const isServiceWorkerActive = (): boolean => {
  return serviceWorkerRegistration !== null && 
         serviceWorkerRegistration.active !== null;
};
