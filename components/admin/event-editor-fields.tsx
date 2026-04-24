'use client';

/**
 * EventFields — the core grid of event fields (title, dates, venue,
 * ticket, status, featured, collaborators). Extracted from EventEditor
 * to keep each file under the 300-line soft cap.
 */

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TagInput } from '@/components/admin/tag-input';
import { cn } from '@/lib/utils';

export interface EventFieldsValues {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  event_date: string;
  end_date: string;
  venue_name: string;
  venue_address: string;
  venue_map_url: string;
  ticket_url: string;
  ticket_cta: string;
  status: 'draft' | 'upcoming' | 'past';
  is_featured: boolean;
  collaborators: string[];
}

export interface EventFieldsProps {
  register: UseFormRegister<EventFieldsValues>;
  errors: FieldErrors<EventFieldsValues>;
  slugManual: boolean;
  setSlugManual: (manual: boolean) => void;
  collaborators: string[];
  onCollaboratorsChange: (next: string[]) => void;
}

export function EventFields({
  register,
  errors,
  slugManual,
  setSlugManual,
  collaborators,
  onCollaboratorsChange,
}: EventFieldsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 rounded-md border border-cream/10 bg-ink-50 p-6 md:grid-cols-2">
      <div className="md:col-span-2 space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          aria-invalid={errors.title ? 'true' : undefined}
          {...register('title')}
        />
        {errors.title ? (
          <p className="text-xs text-error" role="alert">
            {errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="md:col-span-2 space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <div className="flex items-center gap-2">
          <Input
            id="slug"
            aria-invalid={errors.slug ? 'true' : undefined}
            {...register('slug', {
              onChange: () => setSlugManual(true),
            })}
            readOnly={!slugManual}
            className={cn(!slugManual && 'opacity-70')}
          />
          <button
            type="button"
            onClick={() => setSlugManual(!slugManual)}
            className="whitespace-nowrap text-xs text-burgundy underline-offset-4 hover:underline"
          >
            {slugManual ? 'Auto from title' : 'Edit manually'}
          </button>
        </div>
        {errors.slug ? (
          <p className="text-xs text-error" role="alert">
            {errors.slug.message}
          </p>
        ) : (
          <p className="text-xs text-cream/55">
            Final slug is generated server-side and deduplicated on save.
          </p>
        )}
      </div>

      <div className="md:col-span-2 space-y-1.5">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" {...register('subtitle')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="event_date">Event date *</Label>
        <Input
          id="event_date"
          type="date"
          aria-invalid={errors.event_date ? 'true' : undefined}
          {...register('event_date')}
        />
        {errors.event_date ? (
          <p className="text-xs text-error" role="alert">
            {errors.event_date.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="end_date">End date (optional)</Label>
        <Input id="end_date" type="date" {...register('end_date')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="venue_name">Venue name</Label>
        <Input id="venue_name" {...register('venue_name')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="venue_address">Venue address</Label>
        <Input id="venue_address" {...register('venue_address')} />
      </div>

      <div className="md:col-span-2 space-y-1.5">
        <Label htmlFor="venue_map_url">Venue map URL</Label>
        <Input
          id="venue_map_url"
          type="url"
          aria-invalid={errors.venue_map_url ? 'true' : undefined}
          {...register('venue_map_url')}
        />
        {errors.venue_map_url ? (
          <p className="text-xs text-error" role="alert">
            {errors.venue_map_url.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ticket_url">Ticket URL</Label>
        <Input
          id="ticket_url"
          type="url"
          aria-invalid={errors.ticket_url ? 'true' : undefined}
          {...register('ticket_url')}
        />
        {errors.ticket_url ? (
          <p className="text-xs text-error" role="alert">
            {errors.ticket_url.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ticket_cta">Ticket CTA</Label>
        <Input id="ticket_cta" {...register('ticket_cta')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="block w-full border-0 border-b border-cream/10 bg-transparent py-2 text-base text-cream focus:border-burgundy focus:border-b-2 focus:outline-none"
          {...register('status')}
        >
          <option value="draft">Draft</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

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

      <div className="md:col-span-2 space-y-1.5">
        <Label htmlFor="collaborators">Collaborators</Label>
        <TagInput
          id="collaborators"
          ariaLabel="Collaborators"
          value={collaborators}
          onChange={onCollaboratorsChange}
          placeholder="Add a collaborator and press Enter"
        />
      </div>
    </section>
  );
}
