'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowUpRight } from 'lucide-react';
import { ContactFormSchema, type ContactForm } from '@/lib/validators/contact';
import { cn } from '@/lib/utils';

/**
 * Public contact form — concert-hall noir.
 *
 * Uses underline-style inputs on the dark ink ground (cream text, cream-30
 * border, amber focus). POSTs JSON to `/api/contact`. Built as an island
 * rather than using the shared <Input> primitive because the dark-theme
 * overrides (border-cream/25 placeholder:text-cream/35) are specific to
 * the public surface.
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
          // ignore
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

  const inputBase = cn(
    'block w-full bg-transparent px-0 py-3 text-base text-cream',
    'border-0 border-b border-cream/20 rounded-none',
    'placeholder:text-cream/30',
    'focus:outline-none focus:border-burgundy focus:border-b-2',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'aria-[invalid=true]:border-error aria-[invalid=true]:focus:border-error',
    'transition-colors duration-300 ease-out-expo'
  );

  const labelBase = 'font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-cream/55';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-8"
      aria-describedby="contact-intro"
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className={labelBase}>
            Your name
          </label>
          <input
            id="contact-name"
            autoComplete="name"
            placeholder="e.g. Dalia Sen"
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? 'err-name' : undefined}
            className={inputBase}
            {...register('name')}
          />
          {errors.name && (
            <p id="err-name" className="text-xs text-error">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-email" className={labelBase}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@studio.com"
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={errors.email ? 'err-email' : undefined}
            className={inputBase}
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
        <label htmlFor="contact-subject" className={labelBase}>
          Subject <span className="text-cream/35">(optional)</span>
        </label>
        <input
          id="contact-subject"
          placeholder="What's this about?"
          aria-invalid={Boolean(errors.subject) || undefined}
          aria-describedby={errors.subject ? 'err-subject' : undefined}
          className={inputBase}
          {...register('subject')}
        />
        {errors.subject && (
          <p id="err-subject" className="text-xs text-error">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className={labelBase}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          placeholder="Tell us what you're thinking…"
          aria-invalid={Boolean(errors.message) || undefined}
          aria-describedby={errors.message ? 'err-message' : undefined}
          className={cn(inputBase, 'resize-y min-h-[140px]')}
          {...register('message')}
        />
        {errors.message && (
          <p id="err-message" className="text-xs text-error">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            'group inline-flex items-center gap-3 rounded-full bg-burgundy py-3 pl-6 pr-3 text-sm font-medium text-ink',
            'transition-colors hover:bg-burgundy-dark',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
            'disabled:pointer-events-none disabled:opacity-60'
          )}
        >
          <span>{submitting ? 'Sending…' : 'Send message'}</span>
          <span
            aria-hidden="true"
            className="inline-flex size-8 items-center justify-center rounded-full bg-ink/15 transition-transform group-hover:translate-x-0.5"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </button>
      </div>
    </form>
  );
}
