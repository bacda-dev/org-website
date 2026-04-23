import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * BACDA Logo component — the single source of truth for rendering the BACDA
 * logo anywhere on the site. Per PRD §14.5, frontend-dev and admin-dev must
 * never use a raw <img src="/brand/..."> — always import this component.
 *
 * Variants:
 *   - 'color'      : full-color logo (default), used on cream backgrounds
 *   - 'mono-light' : cream silhouette, used over dark hero scrims
 *   - 'mono-dark'  : ink silhouette, used on light backgrounds when the
 *                    full-color is visually too busy (error pages, email)
 *
 * Sizes map to the PRD §14.3.3 placement rules (nav, footer, admin login,
 * error pages). Pass `priority` for above-the-fold occurrences so next/image
 * preloads the asset and avoids layout shift.
 */
type LogoVariant = 'color' | 'mono-light' | 'mono-dark';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 96, height: 32 },
  md: { width: 132, height: 44 },
  lg: { width: 168, height: 56 },
  xl: { width: 192, height: 64 },
};

const SRC: Record<LogoVariant, string> = {
  color: '/brand/bacda-logo.svg',
  'mono-light': '/brand/bacda-logo-mono-light.svg',
  'mono-dark': '/brand/bacda-logo-mono-dark.svg',
};

export interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

export function Logo({
  variant = 'color',
  size = 'md',
  className,
  priority = false,
}: LogoProps) {
  const { width, height } = SIZES[size];
  return (
    <Image
      src={SRC[variant]}
      alt="Bay Area Creative Dancers"
      width={width}
      height={height}
      priority={priority}
      className={cn('select-none', className)}
    />
  );
}
