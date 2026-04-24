'use client';

/**
 * ImageUploader — drag-and-drop or click-to-browse file uploader.
 *
 * Wraps any async upload action provided via the `onUpload` prop. Supports
 * single or multiple files and enforces an optional client-side size cap
 * (default 10 MB per file — matches next.config.js serverActions body limit).
 *
 * Props:
 *  - onUpload: (files: File[]) => Promise<void>
 *  - multiple: boolean (default false)
 *  - maxSizeMB: number (default 10)
 *  - accept: string (default 'image/*')
 *  - label: string (custom instruction shown in drop zone)
 *  - disabled: boolean
 */

import * as React from 'react';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface ImageUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  multiple?: boolean;
  maxSizeMB?: number;
  accept?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ImageUploader({
  onUpload,
  multiple = false,
  maxSizeMB = 10,
  accept = 'image/*',
  label,
  disabled = false,
  className,
}: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const maxBytes = maxSizeMB * 1024 * 1024;

  const handleFiles = React.useCallback(
    async (fileList: FileList | File[] | null) => {
      if (!fileList) return;
      const arr = Array.from(fileList);
      if (arr.length === 0) return;

      const kept: File[] = [];
      const oversize: string[] = [];
      for (const f of arr) {
        if (f.size > maxBytes) {
          oversize.push(f.name);
          continue;
        }
        kept.push(f);
      }
      if (oversize.length > 0) {
        toast.error(
          `Skipped ${oversize.length} file${oversize.length === 1 ? '' : 's'} over ${maxSizeMB}MB: ${oversize.slice(0, 3).join(', ')}${oversize.length > 3 ? '…' : ''}`
        );
      }
      if (kept.length === 0) return;

      setBusy(true);
      try {
        await onUpload(kept);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        toast.error(message);
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [maxBytes, maxSizeMB, onUpload]
  );

  const defaultLabel = multiple
    ? 'Drag images here, or click to browse'
    : 'Drag an image here, or click to browse';

  return (
    <div
      className={cn(
        'relative rounded-md border-2 border-dashed bg-ink-50/60 p-6 text-center transition-colors',
        dragOver ? 'border-burgundy bg-burgundy/5' : 'border-cream/10',
        disabled || busy ? 'pointer-events-none opacity-60' : 'cursor-pointer',
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled && !busy) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (disabled || busy) return;
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => {
        if (!disabled && !busy) inputRef.current?.click();
      }}
      role="button"
      tabIndex={0}
      aria-disabled={disabled || busy}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !busy) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        aria-label={label ?? defaultLabel}
      />
      <div className="flex flex-col items-center gap-2">
        <UploadCloud className="size-8 text-cream/55" aria-hidden="true" />
        <p className="text-sm text-cream">{label ?? defaultLabel}</p>
        <p className="text-xs text-cream/55">
          {busy ? 'Uploading…' : `Up to ${maxSizeMB}MB per file`}
        </p>
      </div>
    </div>
  );
}
