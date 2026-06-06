import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';

// Extend vitest with jest-axe matchers
declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): any;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): any;
  }
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Add jest-axe a11y matcher
expect.extend(toHaveNoViolations);

// Mock indexedDB for InstantDB core initialization in JSDOM
const mockDB = {
  objectStoreNames: {
    contains: () => false,
  },
  createObjectStore: () => ({}),
  transaction: () => ({
    objectStore: () => ({
      get: () => ({ onsuccess: null, onerror: null }),
      put: () => ({ onsuccess: null, onerror: null }),
      delete: () => ({ onsuccess: null, onerror: null }),
      getAllKeys: () => ({ onsuccess: null, onerror: null }),
    }),
    oncomplete: null,
    onerror: null,
    onabort: null,
  }),
};

const mockOpenRequest = {
  result: mockDB,
  onsuccess: null,
  onupgradeneeded: null,
  onerror: null,
};

globalThis.indexedDB = {
  open: () => {
    // Trigger onsuccess asynchronously so that the promise resolves
    setTimeout(() => {
      if (mockOpenRequest.onupgradeneeded) {
        const upgradeEvent = { target: mockOpenRequest };
        (mockOpenRequest as any).onupgradeneeded(upgradeEvent);
      }
      if (mockOpenRequest.onsuccess) {
        const successEvent = { target: mockOpenRequest };
        (mockOpenRequest as any).onsuccess(successEvent);
      }
    }, 0);
    return mockOpenRequest;
  },
} as any;

