'use client';

/**
 * Admin login form.
 *
 * - React Hook Form + Zod.
 * - Calls `supabase.auth.signInWithPassword` via the browser client.
 * - On success, redirects to the `from` param (validated) or `/admin`.
 * - Forgot password triggers `resetPasswordForEmail`.
 *
 * No public signup link is rendered — per PRD §5.5 + user directive,
 * admins are provisioned manually via the Supabase dashboard.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof LoginSchema>;

/**
 * Guard against open-redirect via the `?from=` query param.
 * Only accept paths that begin with `/admin` and do not contain protocol.
 */
function safeRedirect(input: string | undefined): string {
  if (!input) return '/admin';
  if (!input.startsWith('/admin')) return '/admin';
  if (input.includes('://') || input.startsWith('//')) return '/admin';
  return input;
}

export interface LoginFormProps {
  defaultRedirect?: string;
}

export function LoginForm({ defaultRedirect = '/admin' }: LoginFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  const target = safeRedirect(defaultRedirect);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast.error(error.message || 'Sign in failed');
        return;
      }
      toast.success('Welcome back');
      router.push(target);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onForgot = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error('Enter your email above, then tap "Forgot password"');
      return;
    }
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) {
      toast.error('Enter a valid email first');
      return;
    }
    setResetting(true);
    try {
      const supabase = createClient();
      const origin =
        typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/admin/settings`,
      });
      if (error) {
        toast.error(error.message || 'Could not send reset email');
        return;
      }
      toast.success('Password reset email sent');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not send reset email';
      toast.error(message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <form noValidate className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : undefined}
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-xs text-error" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? 'true' : undefined}
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-xs text-error" role="alert">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? 'Signing in…' : 'Sign In'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onForgot}
          disabled={resetting}
          className="text-sm text-burgundy underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          {resetting ? 'Sending…' : 'Forgot password?'}
        </button>
      </div>
    </form>
  );
}
