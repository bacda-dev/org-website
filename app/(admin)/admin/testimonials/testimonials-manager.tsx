'use client';

/**
 * TestimonialsManager — card grid + add/edit dialog + reorder + delete.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { TestimonialFormDialog } from './testimonial-form-dialog';
import {
  deleteTestimonial,
  reorderTestimonials,
} from '@/lib/actions/testimonials';
import type { TestimonialRow } from '@/types/database';

export interface TestimonialsManagerProps {
  testimonials: TestimonialRow[];
}

export function TestimonialsManager({ testimonials }: TestimonialsManagerProps) {
  const router = useRouter();
  const [items, setItems] = React.useState(testimonials);
  const [editing, setEditing] = React.useState<TestimonialRow | null>(null);
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    setItems(testimonials);
  }, [testimonials]);

  const swap = async (index: number, direction: 'up' | 'down') => {
    const j = direction === 'up' ? index - 1 : index + 1;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    const a = next[index];
    const b = next[j];
    if (!a || !b) return;
    next[index] = b;
    next[j] = a;
    setItems(next);
    const result = await reorderTestimonials(next.map((t) => t.id));
    if (!result.ok) {
      toast.error(result.error ?? 'Reorder failed');
      setItems(items);
      return;
    }
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTestimonial(id);
    if (!result.ok) {
      toast.error(result.error ?? 'Delete failed');
      return;
    }
    toast.success('Testimonial deleted');
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          {items.length} testimonial{items.length === 1 ? '' : 's'}
        </p>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden="true" />
          New testimonial
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted">
            No testimonials yet. Click &ldquo;New testimonial&rdquo; to add
            the first one.
          </CardContent>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((t, i) => (
            <li key={t.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{t.author_name}</CardTitle>
                      {t.author_title ? (
                        <CardDescription>{t.author_title}</CardDescription>
                      ) : null}
                    </div>
                    {t.is_featured ? <Badge variant="default">Featured</Badge> : null}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <blockquote className="line-clamp-4 border-l-2 border-burgundy pl-3 text-sm italic text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="flex flex-wrap items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Move up"
                      disabled={i === 0}
                      onClick={() => swap(i, 'up')}
                    >
                      <ArrowUp className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Move down"
                      disabled={i === items.length - 1}
                      onClick={() => swap(i, 'down')}
                    >
                      <ArrowDown className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(t)}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Edit
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          Delete
                        </Button>
                      }
                      title={`Delete testimonial from "${t.author_name}"?`}
                      description="This cannot be undone."
                      confirmLabel="Delete"
                      onConfirm={() => handleDelete(t.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <TestimonialFormDialog
        open={creating}
        onOpenChange={(v) => setCreating(v)}
        initial={null}
      />
      <TestimonialFormDialog
        open={editing !== null}
        onOpenChange={(v) => {
          if (!v) setEditing(null);
        }}
        initial={editing}
      />
    </div>
  );
}
