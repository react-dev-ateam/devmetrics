import { expect, afterEach, vi, Mock } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/dashboard',
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (_name: string) => ({
      value: 'test-token',
    }),
  }),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

expect.extend({
  toHaveBeenCalledWithURL(received: Mock, urlMatcher: string | RegExp) {
    const lastCall = received.mock.calls[received.mock.calls.length - 1];
    if (!lastCall) {
      return {
        pass: false,
        message: () => 'Expected fetch to have been called',
      };
    }

    const url = lastCall[0];
    const matches =
      typeof urlMatcher === 'string' ? url.includes(urlMatcher) : urlMatcher.test(url);

    return {
      pass: matches,
      message: () => `Expected fetch to have been called with ${urlMatcher}, but was called with ${url}`,
    };
  },
});
