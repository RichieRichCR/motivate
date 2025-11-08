// Set up test environment variables before any imports
process.env.API_KEY = 'test-api-key-for-testing';
process.env.USER_ID = 'test-user-id';
process.env.REVALIDATE_SECRET = 'test-revalidate-secret';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8787';

import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Add custom matchers if needed
expect.extend({});
