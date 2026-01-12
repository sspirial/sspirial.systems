import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Add jest-axe a11y matcher
expect.extend(toHaveNoViolations);
