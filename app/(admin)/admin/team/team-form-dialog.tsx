'use client';

/**
 * TeamFormDialog — modal for creating / editing a team member.
 *
 * When `is_lead` is toggled ON for this member, every OTHER member currently
 * marked as lead is toggled OFF (one lead at a time rule).
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
import { MarkdownEditor } from '@/components/admin/markdown-editor';
import { TagInput } from '@/components/admin/tag-input';
import {
  createTeamMember,
  updateTeamMember,
  uploadTeamPhoto,
} from '@/lib/actions/team';
import type { TeamMemberRow } from '@/types/database';

const Schema = z.object({
  name: z.string().min(2).max(200),
  role: z.string().min(2).max(200),
  bio: z.string().max(10000).optional().default(''),
  photo_url: z
    .string()
    .optional()
    .default('')
    .refine((v) => v === '' || /^https?:\/\//i.test(v), 'Must be a valid URL'),
  credits: z.array(z.string().min(1).max(300)).max(50).default([]),
  is_lead: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
});

type FormValues = z.infer<typeof Schema>;

export interface TeamFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: TeamMemberRow | null;
  allMembers: ReadonlyArray<TeamMemberRow>;
}

export function TeamFormDialog({
  open,
  onOpenChange,
  initial,
  allMembers,
}: TeamFormDialogProps) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: initial?.name ?? '',
      role: initial?.role ?? '',
      bio: initial?.bio ?? '',
      photo_url: initial?.photo_url ?? '',
      credits: initial?.credits ?? [],
      is_lead: initial?.is_lead ?? false,
      sort_order: initial?.sort_order ?? 0,
    },
  });

  React.useEffect(() => {
    reset({
      name: initial?.name ?? '',
      role: initial?.role ?? '',
      bio: initial?.bio ?? '',
      photo_url: initial?.photo_url ?? '',
      credits: initial?.credits ?? [],
      is_lead: initial?.is_lead ?? false,
      sort_order: initial?.sort_order ?? 0,
    });
  }, [initial, reset]);

  const onSubmit = async (values: FormValues) => {
    setPending(true);
    try {
      const payload = {
        name: values.name,
        role: values.role,
        bio: values.bio || null,
        photo_url: values.photo_url || null,
        credits: values.credits,
        is_lead: values.is_lead,
        sort_order: values.sort_order,
      };

      const result = initial
        ? await updateTeamMember(initial.id, payload)
        : await createTeamMember(payload);

      if (!result.ok) {
        toast.error(result.error ?? 'Save failed');
        return;
      }

      // Single-lead rule: if we're marking lead true, unmark any others.
      if (values.is_lead) {
        const savedId = initial?.id ?? result.data.id;
        const othersToClear = allMembers.filter(
          (m) => m.is_lead && m.id !== savedId
        );
        for (const other of othersToClear) {
          await updateTeamMember(other.id, { is_lead: false });
        }
      }

      toast.success(initial ? 'Member updated' : 'Member created');
      onOpenChange(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  const onPhotoUpload = async (files: File[]) => {
    if (!initial) {
      toast.error('Save the member first, then upload a photo.');
      return;
    }
    const file = files[0];
    if (!file) return;
    const result = await uploadTeamPhoto(initial.id, file);
    if (!result.ok) {
      toast.error(result.error ?? 'Upload failed');
      return;
    }
    setValue('photo_url', result.data.photo_url, { shouldDirty: true });
    toast.success('Photo uploaded');
    router.refresh();
  };

  const bio = watch('bio') ?? '';
  const credits = watch('credits') ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit member' : 'New member'}</DialogTitle>
          <DialogDescription>
            Team profiles shown on the About page.
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                aria-invalid={errors.role ? 'true' : undefined}
                {...register('role')}
              />
              {errors.role ? (
                <p className="text-xs text-error" role="alert">
                  {errors.role.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <MarkdownEditor
              id="bio"
              ariaLabel="Member bio"
              value={bio}
              onChange={(next) => setValue('bio', next, { shouldDirty: true })}
              height={220}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="photo_url">Photo URL</Label>
            <Input id="photo_url" type="url" {...register('photo_url')} />
            {initial ? (
              <div className="mt-2">
                <ImageUploader
                  onUpload={onPhotoUpload}
                  multiple={false}
                  accept="image/*"
                  maxSizeMB={5}
                  label="Upload or replace headshot"
                />
              </div>
            ) : (
              <p className="text-xs text-cream/55">
                Save the member first to enable direct photo upload.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="credits">Credits</Label>
            <TagInput
              id="credits"
              value={credits}
              onChange={(next) => setValue('credits', next, { shouldDirty: true })}
              placeholder="Add credit and press Enter"
              maxLength={300}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2 pt-6">
              <input
                id="is_lead"
                type="checkbox"
                className="size-4 rounded border-cream/10 text-burgundy focus:ring-burgundy"
                {...register('is_lead')}
              />
              <Label htmlFor="is_lead" className="text-xs normal-case tracking-normal">
                Artistic lead (only one at a time)
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
