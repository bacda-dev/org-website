'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContactFormSchema, type ContactForm } from '@/lib/validators/contact';
import { cn } from '@/lib/utils';

/**
 * Public contact form. POSTs JSON to `/api/contact` (backend-dev's route).
 * On success fires a sonner toast + resets the form; on failure shows the
 * server-side error message (falls back to generic) and leaves the values
 * so the user can retry.
 */
export function ContactForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = async (values: ContactForm) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        let msg = 'Something went wrong. Please try again.';
        try {
          const json = (await res.json()) as { error?: string };
          if (json?.error) msg = json.error;
        } catch {
          // ignore parse error; keep generic
        }
        throw new Error(msg);
      }
      toast.success('Message sent — we will get back to you soon.');
      reset();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-describedby="contact-intro"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? 'err-name' : undefined}
            {...register('name')}
          />
          {errors.name && (
            <p id="err-name" className="text-xs text-error">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={errors.email ? 'err-email' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="err-email" className="text-xs text-error">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject (optional)</Label>
        <Input
          id="contact-subject"
          aria-invalid={Boolean(errors.subject) || undefined}
          aria-describedby={errors.subject ? 'err-subject' : undefined}
          {...register('subject')}
        />
        {errors.subject && (
          <p id="err-subject" className="text-xs text-error">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={6}
          aria-invalid={Boolean(errors.message) || undefined}
          aria-describedby={errors.message ? 'err-message' : undefined}
          {...register('message')}
        />
        {errors.message && (
          <p id="err-message" className="text-xs text-error">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className={cn('pt-2')}>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send message'}
          {!submitting && <Send className="size-4" aria-hidden="true" />}
        </Button>
      </div>
    </form>
  );
}
