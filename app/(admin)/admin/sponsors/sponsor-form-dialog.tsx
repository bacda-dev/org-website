'use client';

/**
 * SponsorFormDialog — modal for creating / editing a sponsor.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/admin/image-uploader';
import {
  createSponsor,
  updateSponsor,
  uploadSponsorLogo,
} from '@/lib/actions/sponsors';
import type { SponsorRow } from '@/types/database';

const Schema = z.object({
  name: z.string().min(2).max(200),
  logo_url: z
    .string()
    .optional()
    .default('')
    .refine((v) => v === '' || /^https?:\/\//i.test(v), 'Must be a valid URL'),
  website_url: z
    .string()
    .optional()
    .default('')
    .refine((v) => v === '' || /^https?:\/\//i.test(v), 'Must be a valid URL'),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof Schema>;

export interface SponsorFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: SponsorRow | null;
}

export function SponsorFormDialog({
  open,
  onOpenChange,
  initial,
}: SponsorFormDialogProps) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: initial?.name ?? '',
      logo_url: initial?.logo_url ?? '',
      website_url: initial?.website_url ?? '',
      sort_order: initial?.sort_order ?? 0,
      is_active: initial?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    reset({
      name: initial?.name ?? '',
      logo_url: initial?.logo_url ?? '',
      website_url: initial?.website_url ?? '',
      sort_order: initial?.sort_order ?? 0,
      is_active: initial?.is_active ?? true,
    });
  }, [initial, reset]);

  const onSubmit = async (values: FormValues) => {
    setPending(true);
    try {
      const payload = {
        name: values.name,
        logo_url: values.logo_url || null,
        website_url: values.website_url || null,
        sort_order: values.sort_order,
        is_active: values.is_active,
      };
      const result = initial
        ? await updateSponsor(initial.id, payload)
        : await createSponsor(payload);
      if (!result.ok) {
        toast.error(result.error ?? 'Save failed');
        return;
      }
      toast.success(initial ? 'Sponsor updated' : 'Sponsor created');
      onOpenChange(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  const onLogoUpload = async (files: File[]) => {
    if (!initial) {
      toast.error('Save the sponsor first, then upload a logo.');
      return;
    }
    const file = files[0];
    if (!file) return;
    const result = await uploadSponsorLogo(initial.id, file);
    if (!result.ok) {
      toast.error(result.error ?? 'Upload failed');
      return;
    }
    setValue('logo_url', result.data.logo_url, { shouldDirty: true });
    toast.success('Logo uploaded');
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit sponsor' : 'New sponsor'}</DialogTitle>
          <DialogDescription>
            Logos shown on the sponsors strip. Toggle &ldquo;active&rdquo; to
            hide without deleting.
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              aria-invalid={errors.name ? 'true' : undefined}
              {...register('name')}
            />
            {errors.name ? (
              <p className="text-xs text-error" role="alert">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" type="url" {...register('logo_url')} />
            {initial ? (
              <div className="mt-2">
                <ImageUploader
                  onUpload={onLogoUpload}
                  multiple={false}
                  accept="image/*"
                  maxSizeMB={2}
                  label="Upload or replace logo"
                />
              </div>
            ) : (
              <p className="text-xs text-muted">
                Save the sponsor first to enable direct logo upload.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="website_url">Website URL</Label>
            <Input id="website_url" type="url" {...register('website_url')} />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2 pt-6">
              <input
                id="is_active"
                type="checkbox"
                className="size-4 rounded border-border text-burgundy focus:ring-burgundy"
                {...register('is_active')}
              />
              <Label htmlFor="is_active" className="text-xs normal-case tracking-normal">
                Active (public)
              </Label>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sort_order">Sort order</Label>
              <Input
                id="sort_order"
                type="number"
                min={0}
                {...register('sort_order', { valueAsNumber: true })}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : initial ? 'Save changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
