'use client';

/**
 * TestimonialFormDialog — modal-based create/edit form.
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
import { Textarea } from '@/components/ui/textarea';
import {
  createTestimonial,
  updateTestimonial,
} from '@/lib/actions/testimonials';
import type { TestimonialRow } from '@/types/database';

const Schema = z.object({
  quote: z.string().min(10, 'Quote must be at least 10 characters').max(2000),
  author_name: z.string().min(2).max(200),
  author_title: z.string().max(300).optional().default(''),
  author_photo_url: z
    .string()
    .optional()
    .default('')
    .refine((v) => v === '' || /^https?:\/\//i.test(v), 'Must be a valid URL'),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
});

type FormValues = z.infer<typeof Schema>;

export interface TestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: TestimonialRow | null;
}

export function TestimonialFormDialog({
  open,
  onOpenChange,
  initial,
}: TestimonialFormDialogProps) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      quote: initial?.quote ?? '',
      author_name: initial?.author_name ?? '',
      author_title: initial?.author_title ?? '',
      author_photo_url: initial?.author_photo_url ?? '',
      is_featured: initial?.is_featured ?? false,
      sort_order: initial?.sort_order ?? 0,
    },
  });

  React.useEffect(() => {
    reset({
      quote: initial?.quote ?? '',
      author_name: initial?.author_name ?? '',
      author_title: initial?.author_title ?? '',
      author_photo_url: initial?.author_photo_url ?? '',
      is_featured: initial?.is_featured ?? false,
      sort_order: initial?.sort_order ?? 0,
    });
  }, [initial, reset]);

  const onSubmit = async (values: FormValues) => {
    setPending(true);
    try {
      const payload = {
        quote: values.quote,
        author_name: values.author_name,
        author_title: values.author_title || null,
        author_photo_url: values.author_photo_url || null,
        is_featured: values.is_featured,
        sort_order: values.sort_order,
      };

      const result = initial
        ? await updateTestimonial(initial.id, payload)
        : await createTestimonial(payload);

      if (!result.ok) {
        toast.error(result.error ?? 'Save failed');
        return;
      }
      toast.success(initial ? 'Testimonial updated' : 'Testimonial created');
      onOpenChange(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initial ? 'Edit testimonial' : 'New testimonial'}
          </DialogTitle>
          <DialogDescription>
            Endorsement quote shown on the home carousel and testimonials page.
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="quote">Quote *</Label>
            <Textarea
              id="quote"
              rows={4}
              aria-invalid={errors.quote ? 'true' : undefined}
              {...register('quote')}
            />
            {errors.quote ? (
              <p className="text-xs text-error" role="alert">
                {errors.quote.message}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="author_name">Author name *</Label>
              <Input
                id="author_name"
                aria-invalid={errors.author_name ? 'true' : undefined}
                {...register('author_name')}
              />
              {errors.author_name ? (
                <p className="text-xs text-error" role="alert">
                  {errors.author_name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="author_title">Author title</Label>
              <Input id="author_title" {...register('author_title')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="author_photo_url">Photo URL</Label>
            <Input
              id="author_photo_url"
              type="url"
              aria-invalid={errors.author_photo_url ? 'true' : undefined}
              {...register('author_photo_url')}
            />
            {errors.author_photo_url ? (
              <p className="text-xs text-error" role="alert">
                {errors.author_photo_url.message}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2 pt-6">
              <input
                id="is_featured"
                type="checkbox"
                className="size-4 rounded border-cream/10 text-burgundy focus:ring-burgundy"
                {...register('is_featured')}
              />
              <Label htmlFor="is_featured" className="text-xs normal-case tracking-normal">
                Featured on home
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
