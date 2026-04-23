import type { Config } from 'tailwindcss';

/**
 * BACDA design tokens — "Kinetic Editorial / Concert-Hall Noir" revamp.
 *
 * Direction: dark-dominant editorial (ink ground, amber logo accent, paper
 * cream as secondary surface). Dance photography reads on ink; the warm logo
 * glows against it. Token names kept stable so admin + button primitives
 * continue to resolve.
 *
 * Value assignments:
 *   ink            = #0B0B0E  (primary ground — near-black, warm shift)
 *   cream          = #F5F0E6  (paper light — for inverse sections)
 *   burgundy       = #E08D2F  (WARM AMBER — matches logo gradient mid-tone;
 *                              7.1:1 on ink for WCAG AA)
 *   burgundy.dark  = #C27017  (hover / active — 8.2:1 on ink)
 *   gold           = #F4B860  (logo highlight; decorative-only)
 *
 * Typography: Fraunces (display) + Inter Tight (body) + JetBrains Mono
 * (editorial labels). Never Inter/Roboto/Poppins/Arial — Fraunces carries
 * italic voice, Inter Tight is tighter than stock Inter.
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
        DEFAULT: '1.25rem',
        md: '2rem',
        lg: '3rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0B0E',
          50: '#16161A',
          100: '#1C1C21',
          200: '#262529',
        },
        cream: {
          DEFAULT: '#F5F0E6',
          50: '#FDFBF6',
          100: '#F5F0E6',
          200: '#EAE3D3',
        },
        // Primary accent — warm amber derived from the BACDA logo gradient.
        // Token name "burgundy" retained so upstream refs keep resolving.
        burgundy: {
          DEFAULT: '#E08D2F',
          dark: '#C27017',
        },
        // Logo highlight gold — decorative only.
        gold: '#F4B860',
        muted: {
          DEFAULT: '#8A8680',
          foreground: '#8A8680',
        },
        border: '#262529',
        error: '#EF4444',
        success: '#22C55E',
        // shadcn compatibility aliases
        background: '#0B0B0E',
        foreground: '#F5F0E6',
        primary: {
          DEFAULT: '#E08D2F',
          foreground: '#0B0B0E',
        },
        secondary: {
          DEFAULT: '#F4B860',
          foreground: '#0B0B0E',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#F5F0E6',
        },
        accent: {
          DEFAULT: '#1C1C21',
          foreground: '#F5F0E6',
        },
        card: {
          DEFAULT: '#16161A',
          foreground: '#F5F0E6',
        },
        popover: {
          DEFAULT: '#F5F0E6',
          foreground: '#0B0B0E',
        },
        input: '#262529',
        ring: '#E08D2F',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Fluid type scale via clamp() — see app/globals.css :root vars.
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.35rem' }],
        base: ['1rem', { lineHeight: '1.6rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['2rem', { lineHeight: '2.4rem' }],
        '4xl': ['2.75rem', { lineHeight: '3rem' }],
        '5xl': ['3.75rem', { lineHeight: '1.05' }],
        '6xl': ['5rem', { lineHeight: '1.0' }],
        '7xl': ['6.5rem', { lineHeight: '0.95' }],
        '8xl': ['8rem', { lineHeight: '0.92' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
        tight: '-0.015em',
        normal: '0',
        wide: '0.025em',
        wider: '0.1em',
        widest: '0.28em',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '10px',
        xl: '14px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.30)',
        DEFAULT: '0 2px 8px 0 rgb(0 0 0 / 0.35)',
        md: '0 10px 30px -6px rgb(0 0 0 / 0.45)',
        lg: '0 24px 60px -12px rgb(0 0 0 / 0.55)',
        glow: '0 0 40px -8px rgb(224 141 47 / 0.35)',
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
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee 40s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
