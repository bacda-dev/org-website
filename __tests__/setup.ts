// Vitest global setup. Runs before every test file.
// Extends expect with @testing-library/jest-dom matchers and provides minimal
// browser polyfills missing from happy-dom.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Auto-unmount any components rendered via @testing-library/react after each test.
afterEach(() => {
  cleanup();
});

// happy-dom does not implement matchMedia. Stub it so components that
// query prefers-color-scheme / reduced-motion don't crash during tests.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// IntersectionObserver — used by lazy-load components and animation libs.
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).IntersectionObserver = MockIntersectionObserver;
}
