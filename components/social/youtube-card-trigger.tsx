'use client';

/**
 * Client-side wrapper that opens a YouTube video in a Radix Dialog lightbox.
 * Used by `YouTubeGrid`'s server-rendered cards. Kept as a separate file so
 * the grid itself can stay a Server Component.
 */

import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { YouTubePlayer } from './youtube-player';

interface YouTubeCardTriggerProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function YouTubeCardTrigger({
  id,
  title,
  children,
}: YouTubeCardTriggerProps) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={`Play video: ${title}`}
        className="block w-full rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl border-0 bg-ink p-0 sm:p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            YouTube video player for {title}. Press Escape to close.
          </DialogDescription>
        </DialogHeader>
        <YouTubePlayer id={id} title={title} params="autoplay=1" />
      </DialogContent>
    </Dialog>
  );
}
