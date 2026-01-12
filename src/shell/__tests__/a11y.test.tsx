import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import App from '@shell/App';

// Basic accessibility check for the top-level app structure
describe('Accessibility', () => {
  it('App has no obvious a11y violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
