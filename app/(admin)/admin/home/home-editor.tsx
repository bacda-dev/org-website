'use client';

/**
 * HomeEditor — client-side form around `updateHomeContent` server action.
 *
 * RHF + Zod; markdown editor for mission statement. Save button uses
 * `useTransition` so the UI stays responsive during the action round-trip.
 * Sonner toasts for success/error.
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarkdownEditor } from '@/components/admin/markdown-editor';
import { HomeContentInputSchema } from '@/lib/validators/home';
import { updateHomeContent } from '@/lib/actions/home';

// Relax the schema for form input — empty strings are common from
// controlled inputs. We normalize to null before sending to the action.
import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .max(1000, 'URL must be at most 1000 characters')
  .refine((v) => v === '' || /^https?:\/\//i.test(v), 'Must be a valid URL');

const HomeFormSchema = HomeContentInputSchema.extend({
  hero_subheadline: z.string().max(500).optional().default(''),
  hero_image_url: optionalUrl.optional().default(''),
  hero_video_url: optionalUrl.optional().default(''),
  featured_event_id: z.string().optional().default(''),
  mission_statement: z.string().max(5000).optional().default(''),
  donate_url: optionalUrl.optional().default(''),
});

type HomeFormValues = z.infer<typeof HomeFormSchema>;

export interface HomeEditorProps {
  initial: HomeFormValues;
  upcomingEvents: ReadonlyArray<{ id: string; title: string }>;
}

export function HomeEditor({ initial, upcomingEvents }: HomeEditorProps) {
  const [pending, startTransition] = React.useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HomeFormValues>({
    resolver: zodResolver(HomeFormSchema),
    defaultValues: initial,
  });

  const mission = watch('mission_statement') ?? '';
  const featuredId = watch('featured_event_id') ?? '';

  const onSubmit = (values: HomeFormValues) => {
    startTransition(async () => {
      const payload = {
        hero_headline: values.hero_headline,
        hero_subheadline: values.hero_subheadline || null,
        hero_image_url: values.hero_image_url || null,
        hero_video_url: values.hero_video_url || null,
        featured_event_id: values.featured_event_id || null,
        mission_statement: values.mission_statement || null,
        donate_url: values.donate_url || null,
      };
      const result = await updateHomeContent(payload);
      if (result.ok) {
        toast.success('Home content saved');
      } else {
        toast.error(result.error ?? 'Save failed');
      }
    });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-3xl flex-col gap-8"
    >
      <section className="flex flex-col gap-4 rounded-md border border-border bg-white p-6">
        <h2 className="font-display text-xl font-medium">Hero</h2>

        <div className="space-y-1.5">
          <Label htmlFor="hero_headline">Hero headline *</Label>
          <Input
            id="hero_headline"
            aria-invalid={errors.hero_headline ? 'true' : undefined}
            {...register('hero_headline')}
          />
          {errors.hero_headline ? (
            <p className="text-xs text-error" role="alert">
              {errors.hero_headline.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hero_subheadline">Hero subheadline</Label>
          <Input id="hero_subheadline" {...register('hero_subheadline')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hero_image_url">Hero image URL</Label>
          <Input
            id="hero_image_url"
            type="url"
            placeholder="https://…/gallery/hero/slider1.jpg"
            aria-invalid={errors.hero_image_url ? 'true' : undefined}
            {...register('hero_image_url')}
          />
          {errors.hero_image_url ? (
            <p className="text-xs text-error" role="alert">
              {errors.hero_image_url.message}
            </p>
          ) : null}
          <p className="text-xs text-muted">
            Paste a public URL from the <em>gallery</em> bucket, or leave
            blank to use the default hero slider.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hero_video_url">Hero video URL (optional)</Label>
          <Input
            id="hero_video_url"
            type="url"
            placeholder="https://…/hero-loop.mp4"
            aria-invalid={errors.hero_video_url ? 'true' : undefined}
            {...register('hero_video_url')}
          />
          {errors.hero_video_url ? (
            <p className="text-xs text-error" role="alert">
              {errors.hero_video_url.message}
            </p>
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-md border border-border bg-white p-6">
        <h2 className="font-display text-xl font-medium">Mission statement</h2>
        <MarkdownEditor
          id="mission_statement"
          ariaLabel="Mission statement"
          value={mission}
          onChange={(next) =>
            setValue('mission_statement', next, { shouldDirty: true })
          }
          height={280}
        />
      </section>

      <section className="flex flex-col gap-4 rounded-md border border-border bg-white p-6">
        <h2 className="font-display text-xl font-medium">Featured event</h2>
        <div className="space-y-1.5">
          <Label htmlFor="featured_event_id">Highlighted on the home page</Label>
          <select
            id="featured_event_id"
            className="block w-full border-0 border-b border-border bg-transparent py-2 text-base text-ink focus:border-burgundy focus:border-b-2 focus:outline-none"
            value={featuredId}
            onChange={(e) =>
              setValue('featured_event_id', e.target.value, {
                shouldDirty: true,
              })
            }
          >
            <option value="">— None (use events.is_featured) —</option>
            {upcomingEvents.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted">
            Overrides the <code className="font-mono">is_featured</code> flag
            on events.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-md border border-border bg-white p-6">
        <h2 className="font-display text-xl font-medium">Donate</h2>
        <div className="space-y-1.5">
          <Label htmlFor="donate_url">Donate URL</Label>
          <Input
            id="donate_url"
            type="url"
            placeholder="https://www.zeffy.com/… or https://donorbox.org/…"
            aria-invalid={errors.donate_url ? 'true' : undefined}
            {...register('donate_url')}
          />
          {errors.donate_url ? (
            <p className="text-xs text-error" role="alert">
              {errors.donate_url.message}
            </p>
          ) : null}
          <p className="text-xs text-muted">
            Leave empty to hide the Donate button in nav/footer.
          </p>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
