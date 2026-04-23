import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    include: [
      '**/*.test.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
    ],
    exclude: [
      'node_modules/**',
      '.next/**',
      'e2e/**',
      'legacy-website/**',
      'Harness/**',
      '__tests__/setup.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        '.next/**',
        'e2e/**',
        '**/*.config.*',
        '**/*.d.ts',
        '__tests__/setup.ts',
        'legacy-website/**',
        'Harness/**',
      ],
    },
  },
});
