'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

/**
 * Tabs — Radix Tabs wrapper styled for the editorial voice.
 * TabsList is a horizontal bar with a bottom border; the active trigger
 * gets a burgundy underline rather than a boxed pill background. This
 * echoes the Form §6.5 "no boxed inputs" spirit in navigation.
 */
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center gap-6 border-b border-border',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative -mb-px inline-flex items-center py-3 text-sm font-medium',
      'text-muted transition-colors duration-200 ease-out',
      'hover:text-ink',
      'data-[state=active]:text-ink',
      'data-[state=active]:after:absolute data-[state=active]:after:bottom-0',
      'data-[state=active]:after:left-0 data-[state=active]:after:right-0',
      'data-[state=active]:after:h-[2px] data-[state=active]:after:bg-burgundy',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-6 focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-burgundy focus-visible:ring-offset-2',
      'focus-visible:ring-offset-cream',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
