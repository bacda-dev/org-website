import type { Config } from 'tailwindcss';

/**
 * BACDA design tokens.
 * Values come from PRD §6.2 (colors) and §6.3 (typography).
 * --burgundy may be shifted post-logo-color-extraction per §14.3.5.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        md: '3rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        ink: '#1A1A1A',
        cream: '#FAF7F2',
        burgundy: {
          DEFAULT: '#8B3A3A',
          dark: '#6B2828',
        },
        gold: '#C5A572',
        muted: {
          DEFAULT: '#6B6B6B',
          foreground: '#6B6B6B',
        },
        border: '#E8E2D5',
        error: '#B91C1C',
        success: '#15803D',
        // shadcn compatibility aliases (map to our tokens)
        background: '#FAF7F2',
        foreground: '#1A1A1A',
        primary: {
          DEFAULT: '#8B3A3A',
          foreground: '#FAF7F2',
        },
        secondary: {
          DEFAULT: '#C5A572',
          foreground: '#1A1A1A',
        },
        destructive: {
          DEFAULT: '#B91C1C',
          foreground: '#FAF7F2',
        },
        accent: {
          DEFAULT: '#F5EFE4',
          foreground: '#1A1A1A',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1A1A',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1A1A',
        },
        input: '#E8E2D5',
        ring: '#8B3A3A',
      },
      fontFamily: {
        // Wired up via next/font/google in app/layout.tsx; CSS vars consumed here.
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-instrument)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['2rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.5rem', { lineHeight: '3rem' }],
        '5xl': ['3.5rem', { lineHeight: '1.1' }],
        '6xl': ['4.5rem', { lineHeight: '1.05' }],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        DEFAULT: '0 2px 4px 0 rgb(0 0 0 / 0.06)',
        md: '0 4px 12px -2px rgb(0 0 0 / 0.08)',
        lg: '0 10px 24px -4px rgb(0 0 0 / 0.10)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
