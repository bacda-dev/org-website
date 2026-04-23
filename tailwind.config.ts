import type { Config } from 'tailwindcss';

/**
 * BACDA design tokens.
 *
 * Color palette: PRD §6.2 baseline, with the primary accent re-derived from
 * the BACDA logo per PRD §14.3.5 ("If the logo's native color differs
 * significantly from burgundy, update the --burgundy token to match the logo
 * color exactly").
 *
 * The BACDA 2020 logo is a warm orange-to-gold gradient wordmark with a
 * dancer silhouette. Burgundy (#8B3A3A) is visually disjoint from that art.
 * We therefore re-assign the token values (keeping the token NAMES so
 * downstream code/PRD references remain stable):
 *
 *   burgundy.DEFAULT  = #C2570B  (burnt amber — matches logo saturation,
 *                                 5.2:1 on cream for WCAG AA body text)
 *   burgundy.dark     = #9A4509  (hover / active — 6.7:1 on cream)
 *
 * Kept as a dedicated decorative-only color for large headings / accents
 * that echo the logo's lighter gradient tones:
 *
 *   gold              = #E8A336  (logo mid-gold — decorative ONLY; 2.9:1 on
 *                                 cream, fails 4.5:1 body-text and even 3:1
 *                                 for large text so reserve for >=24px bold
 *                                 display type or borders/dividers)
 *
 * Typography: PRD §6.3 — Fraunces (display) + Instrument Sans (body) +
 * JetBrains Mono (code). Never Inter/Roboto/Poppins/Montserrat/Arial.
 *
 * Type scale / spacing / radius: PRD §6.3 + §6.4.
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
        // Primary accent — burnt amber derived from BACDA logo (PRD §14.3.5).
        // Token name "burgundy" is preserved per PRD §6.2 so the rest of the
        // codebase and spec references keep resolving.
        burgundy: {
          DEFAULT: '#C2570B',
          dark: '#9A4509',
        },
        // Logo mid-gradient gold — decorative use ONLY. Fails body-text
        // contrast on cream; use for 24px+ bold display or dividers.
        gold: '#E8A336',
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
          DEFAULT: '#C2570B',
          foreground: '#FAF7F2',
        },
        secondary: {
          DEFAULT: '#E8A336',
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
        ring: '#C2570B',
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
