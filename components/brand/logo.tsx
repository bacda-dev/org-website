import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * BACDA Logo — single source of truth for rendering the brand mark.
 *
 * The underlying PNG is a warm-gradient dancer silhouette on transparent
 * background — it reads equally well on the ink hero scrim and on cream
 * admin surfaces, so we drop the previous color/mono variant split.
 * The `variant` prop is preserved for call-site compatibility but maps
 * everything to the single full-color asset.
 */
type LogoVariant = 'color' | 'mono-light' | 'mono-dark';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<LogoSize, number> = {
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
};

export interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

export function Logo({
  size = 'md',
  className,
  priority = false,
}: LogoProps) {
  const px = SIZES[size];
  return (
    <Image
      src="/brand/bacda-logo-full.png"
      alt="Bay Area Creative Dance Academy"
      width={px}
      height={px}
      priority={priority}
      className={cn('select-none object-contain', className)}
      sizes={`${px}px`}
    />
  );
}
