'use client';

/**
 * ChangePasswordForm — calls `supabase.auth.updateUser({ password })`.
 *
 * Note: the Supabase JS SDK's `updateUser` does NOT require the current
 * password when the user is already signed in. We still ask for it to
 * confirm intent + avoid accidental changes, by re-authenticating via
 * signInWithPassword using the stored email from the session.
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

const Schema = z
  .object({
    current: z.string().min(6, 'Password must be at least 6 characters'),
    next: z.string().min(8, 'New password must be at least 8 characters').max(72),
    confirm: z.string().min(8),
  })
  .refine((v) => v.next === v.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  });

type FormValues = z.infer<typeof Schema>;

export function ChangePasswordForm() {
  const [pending, setPending] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { current: '', next: '', confirm: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setPending(true);
    try {
      const supabase = createClient();
      const { data: userRes } = await supabase.auth.getUser();
      const email = userRes?.user?.email;
      if (!email) {
        toast.error('Could not confirm identity — please sign out and back in');
        return;
      }

      const { error: verifyErr } = await supabase.auth.signInWithPassword({
        email,
        password: values.current,
      });
      if (verifyErr) {
        toast.error('Current password is incorrect');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: values.next,
      });
      if (error) {
        toast.error(error.message || 'Password update failed');
        return;
      }
      toast.success('Password updated');
      reset();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Password update failed';
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="current">Current password</Label>
        <Input
          id="current"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.current ? 'true' : undefined}
          {...register('current')}
        />
        {errors.current ? (
          <p className="text-xs text-error" role="alert">
            {errors.current.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="next">New password</Label>
        <Input
          id="next"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.next ? 'true' : undefined}
          {...register('next')}
        />
        {errors.next ? (
          <p className="text-xs text-error" role="alert">
            {errors.next.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirm new password</Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.confirm ? 'true' : undefined}
          {...register('confirm')}
        />
        {errors.confirm ? (
          <p className="text-xs text-error" role="alert">
            {errors.confirm.message}
          </p>
        ) : null}
      </div>

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? 'Updating…' : 'Update password'}
        </Button>
      </div>
    </form>
  );
}
