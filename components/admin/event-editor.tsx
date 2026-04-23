'use client';

/**
 * EventEditor — shared editor for /admin/events/new + /admin/events/[id].
 *
 * Top-level orchestration: schema, form state, autosave, save/delete handlers.
 * UI chunks delegated to sibling components (EventFields, PosterSection,
 * PhotosSection, VideosSection) to keep each file under the 300-line cap.
 *
 * LocalStorage auto-save (30s debounce) preserves an unsaved draft across
 * page reloads. Not persisted to the DB — that's the "Save draft" button's
 * job.
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { MarkdownEditor } from '@/components/admin/markdown-editor';
import { EventFields } from './event-editor-fields';
import { PosterSection } from './event-editor-poster';
import { PhotosSection } from './event-editor-photos';
import { VideosSection } from './event-editor-videos';
import { EventStatusEnum } from '@/lib/validators/events';
import { createEvent, deleteEvent, updateEvent } from '@/lib/actions/events';
import { slugify } from '@/lib/utils';
import type {
  EventPhotoRow,
  EventRow,
  EventVideoRow,
} from '@/types/database';

// Form schema — looser than the action schema so controlled inputs can hold
// empty strings. Normalized before submit.
const EventFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  slug: z
    .string()
    .max(200)
    .regex(/^[a-z0-9-]*$/u, 'Lowercase letters, numbers, hyphens only')
    .optional()
    .default(''),
  subtitle: z.string().max(300).optional().default(''),
  description: z.string().max(20000).optional().default(''),
  event_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, 'Must be YYYY-MM-DD'),
  end_date: z
    .string()
    .optional()
    .default('')
    .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/u.test(v), 'Must be YYYY-MM-DD'),
  venue_name: z.string().max(200).optional().default(''),
  venue_address: z.string().max(500).optional().default(''),
  venue_map_url: z
    .string()
    .optional()
    .default('')
    .refine((v) => v === '' || /^https?:\/\//i.test(v), 'Must be a valid URL'),
  ticket_url: z
    .string()
    .optional()
    .default('')
    .refine((v) => v === '' || /^https?:\/\//i.test(v), 'Must be a valid URL'),
  ticket_cta: z.string().min(1).max(50).default('Get Tickets'),
  status: EventStatusEnum,
  is_featured: z.boolean().default(false),
  collaborators: z.array(z.string().min(1).max(200)).max(50).default([]),
});

type EventFormValues = z.infer<typeof EventFormSchema>;

const AUTOSAVE_DEBOUNCE_MS = 30_000;

export interface EventEditorProps {
  event: EventRow | null;
  photos: EventPhotoRow[];
  videos: EventVideoRow[];
  storageUrlFor: (path: string) => string;
}

function defaultsFromEvent(event: EventRow | null): EventFormValues {
  if (!event) {
    return {
      title: '',
      slug: '',
      subtitle: '',
      description: '',
      event_date: new Date().toISOString().slice(0, 10),
      end_date: '',
      venue_name: '',
      venue_address: '',
      venue_map_url: '',
      ticket_url: '',
      ticket_cta: 'Get Tickets',
      status: 'draft',
      is_featured: false,
      collaborators: [],
    };
  }
  return {
    title: event.title,
    slug: event.slug,
    subtitle: event.subtitle ?? '',
    description: event.description ?? '',
    event_date: event.event_date,
    end_date: event.end_date ?? '',
    venue_name: event.venue_name ?? '',
    venue_address: event.venue_address ?? '',
    venue_map_url: event.venue_map_url ?? '',
    ticket_url: event.ticket_url ?? '',
    ticket_cta: event.ticket_cta ?? 'Get Tickets',
    status: event.status,
    is_featured: event.is_featured,
    collaborators: event.collaborators ?? [],
  };
}

export function EventEditor({
  event,
  photos,
  videos,
  storageUrlFor,
}: EventEditorProps) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [slugManual, setSlugManual] = React.useState<boolean>(Boolean(event));

  const autoSaveKey = event ? `admin:event-draft:${event.id}` : 'admin:event-draft:new';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: defaultsFromEvent(event),
  });

  // Restore localStorage draft on mount, if present.
  React.useEffect(() => {
    try {
      const raw =
        typeof window !== 'undefined'
          ? window.localStorage.getItem(autoSaveKey)
          : null;
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      const check = EventFormSchema.safeParse(parsed);
      if (check.success) {
        reset(check.data);
        toast.info('Restored unsaved draft');
      }
    } catch {
      // ignore — draft restore is best-effort.
    }
  }, [autoSaveKey, reset]);

  // Debounced auto-save to localStorage (30s).
  const values = watch();
  React.useEffect(() => {
    if (!isDirty) return;
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(autoSaveKey, JSON.stringify(values));
      } catch {
        // ignore
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [values, isDirty, autoSaveKey]);

  // Auto-slug from title until the user manually edits slug.
  const title = watch('title');
  React.useEffect(() => {
    if (slugManual) return;
    const next = slugify(title ?? '');
    setValue('slug', next, { shouldDirty: false });
  }, [title, slugManual, setValue]);

  const submitWith = (status: 'draft' | 'upcoming' | 'past') =>
    handleSubmit(async (formValues) => {
      setPending(true);
      try {
        const payload = {
          title: formValues.title,
          subtitle: formValues.subtitle || null,
          description: formValues.description || null,
          event_date: formValues.event_date,
          end_date: formValues.end_date || null,
          venue_name: formValues.venue_name || null,
          venue_address: formValues.venue_address || null,
          venue_map_url: formValues.venue_map_url || null,
          ticket_url: formValues.ticket_url || null,
          ticket_cta: formValues.ticket_cta,
          status,
          is_featured: formValues.is_featured,
          collaborators: formValues.collaborators,
        };

        if (event) {
          const result = await updateEvent(event.id, payload);
          if (!result.ok) {
            toast.error(result.error ?? 'Save failed');
            return;
          }
          toast.success('Event saved');
          window.localStorage.removeItem(autoSaveKey);
          router.refresh();
        } else {
          const result = await createEvent(payload);
          if (!result.ok) {
            toast.error(result.error ?? 'Create failed');
            return;
          }
          toast.success('Event created');
          window.localStorage.removeItem(autoSaveKey);
          router.push(`/admin/events/${result.data.id}`);
          router.refresh();
        }
      } finally {
        setPending(false);
      }
    });

  const handleDelete = async () => {
    if (!event) return;
    const result = await deleteEvent(event.id);
    if (!result.ok) {
      toast.error(result.error ?? 'Delete failed');
      return;
    }
    toast.success('Event deleted');
    router.push('/admin/events');
    router.refresh();
  };

  const description = watch('description') ?? '';
  const collaborators = watch('collaborators') ?? [];

  return (
    <div className="flex flex-col gap-8">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/admin" className="hover:text-ink">Admin</Link>
        <span className="mx-1.5">/</span>
        <Link href="/admin/events" className="hover:text-ink">Events</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{event?.title ?? 'New event'}</span>
      </nav>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">
            {event ? event.title : 'New event'}
          </h1>
          {event ? (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span>/events/{event.slug}</span>
              <span aria-hidden="true">·</span>
              <Badge
                variant={
                  event.status === 'upcoming'
                    ? 'default'
                    : event.status === 'draft'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {event.status}
              </Badge>
              {event.is_featured ? <Badge variant="default">Featured</Badge> : null}
            </div>
          ) : null}
        </div>
        {event ? (
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm">
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </Button>
            }
            title={`Delete "${event.title}"?`}
            description="Permanently removes the event and its photos/videos."
            confirmLabel="Delete event"
            onConfirm={handleDelete}
          />
        ) : null}
      </div>

      <form noValidate className="flex flex-col gap-8" onSubmit={submitWith('upcoming')}>
        <EventFields
          register={register}
          errors={errors}
          slugManual={slugManual}
          setSlugManual={setSlugManual}
          collaborators={collaborators}
          onCollaboratorsChange={(next) => setValue('collaborators', next, { shouldDirty: true })}
        />

        <section className="flex flex-col gap-4 rounded-md border border-border bg-white p-6">
          <Label htmlFor="description" className="text-base normal-case tracking-normal">
            Description
          </Label>
          <MarkdownEditor
            id="description"
            ariaLabel="Event description"
            value={description}
            onChange={(next) => setValue('description', next, { shouldDirty: true })}
            height={360}
          />
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={pending}>
            <Save className="size-4" aria-hidden="true" />
            {pending ? 'Saving…' : 'Save & publish'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => submitWith('draft')()}
            disabled={pending}
          >
            Save as draft
          </Button>
          {event ? (
            <Link
              href={`/events/${event.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-burgundy underline-offset-4 hover:underline"
            >
              View on site ↗
            </Link>
          ) : null}
        </div>
      </form>

      {event ? (
        <>
          <PosterSection event={event} />
          <PhotosSection
            eventId={event.id}
            photos={photos}
            storageUrlFor={storageUrlFor}
          />
          <VideosSection eventId={event.id} videos={videos} />
        </>
      ) : (
        <p className="rounded-md border border-dashed border-border bg-white p-6 text-sm text-muted">
          Save this event to unlock poster, photo, and video uploads.
        </p>
      )}
    </div>
  );
}
