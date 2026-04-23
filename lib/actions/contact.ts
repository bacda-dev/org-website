'use server';

/**
 * Public contact-form server action.
 *
 * Flow:
 *   1. Zod-validate input — bounded name/email/subject/message.
 *   2. Rate-limit by IP (3 per hour, sliding window, in-memory).
 *   3. Insert into `contact_submissions` (public — RLS allows).
 *   4. Best-effort Resend send. Gracefully skip when `RESEND_API_KEY` unset.
 *   5. Always return `{ ok: true }` on successful DB insert, even if the
 *      email send fails — we don't want a transient Resend hiccup to block
 *      the visitor's submission UX.
 *
 * Rate-limit hits return `{ ok: false, error: '…', code: 'RATE_LIMITED' }`.
 * The API route maps that to HTTP 429.
 */

import { rateLimit } from '@/lib/rate-limit';
import {
  ContactFormSchema,
  type ContactForm,
} from '@/lib/validators/contact';
import { adminDb } from './db';
import { actionError, validationError, type ActionResult } from './types';

const HOUR_MS = 60 * 60 * 1000;

// Shared limiter instance — module-scoped so re-invocations share counters.
const contactRateLimit = rateLimit({ windowMs: HOUR_MS, max: 3 });

export interface ContactContext {
  ip: string | null;
  userAgent: string | null;
}

export type ContactActionResult =
  | { ok: true; data: { id: string | null } }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
      code?: 'RATE_LIMITED' | 'VALIDATION' | 'AUTH' | 'SERVER';
    };

/**
 * Call from server components / actions / route handlers. The caller is
 * responsible for extracting IP + user-agent from the request headers so
 * this function stays transport-agnostic.
 */
export async function submitContactForm(
  input: unknown,
  context: ContactContext = { ip: null, userAgent: null },
): Promise<ContactActionResult> {
  try {
    const parsed = ContactFormSchema.safeParse(input);
    if (!parsed.success) {
      const err = validationError(parsed.error);
      return { ok: false, error: err.error, fieldErrors: err.fieldErrors, code: 'VALIDATION' };
    }

    // Rate-limit key = IP, with a safe fallback so misconfigured proxies
    // don't collapse every request into one bucket.
    const rateKey = context.ip ?? 'unknown';
    const check = contactRateLimit(rateKey);
    if (!check.ok) {
      const waitMinutes = Math.max(
        1,
        Math.ceil((check.resetAt - Date.now()) / 60000),
      );
      return {
        ok: false,
        error: `Too many submissions. Please try again in about ${waitMinutes} minute${waitMinutes === 1 ? '' : 's'}.`,
        code: 'RATE_LIMITED',
      };
    }

    const supabase = adminDb();
    const { data: inserted, error: dbErr } = await supabase
      .from('contact_submissions')
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject ?? null,
        message: parsed.data.message,
        ip_address: context.ip,
        user_agent: context.userAgent,
      })
      .select('id')
      .maybeSingle();
    if (dbErr) {
      console.error('[contact] insert failed:', dbErr.message);
      return { ok: false, error: 'Unable to save your message. Please try again.', code: 'SERVER' };
    }

    // Best-effort email send — never fail the user flow on email errors.
    await sendResendEmail(parsed.data).catch((e: unknown) => {
      console.error('[contact] resend send failed:', e);
    });

    return {
      ok: true,
      data: { id: (inserted as { id: string } | null)?.id ?? null },
    };
  } catch (err) {
    const base = actionError(err);
    return { ...base, code: 'SERVER' };
  }
}

async function sendResendEmail(form: ContactForm): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Graceful fallback: log the submission so it's visible in dev / preview
    // logs. The DB row is still saved, so nothing is lost.
    console.info('[contact] RESEND_API_KEY not set — skipping email. Submission:', {
      name: form.name,
      email: form.email,
      subject: form.subject ?? null,
    });
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@bayareacreativedancers.org';
  const to =
    process.env.RESEND_CONTACT_TO_EMAIL ?? 'contactus@bayareacreativedancers.org';

  // Dynamic import so `resend` is only loaded when we actually need it —
  // keeps cold-start smaller when the key is absent (e.g. local dev).
  const { Resend } = await import('resend');
  const client = new Resend(key);

  const subjectLine = form.subject?.trim()
    ? `[BACDA] ${form.subject.trim()}`
    : '[BACDA] New contact form submission';

  const text = [
    `Name:    ${form.name}`,
    `Email:   ${form.email}`,
    `Subject: ${form.subject ?? '(none)'}`,
    '',
    form.message,
  ].join('\n');

  const { error } = await client.emails.send({
    from,
    to,
    replyTo: form.email,
    subject: subjectLine,
    text,
  });
  if (error) {
    throw new Error(error.message || 'Resend send failed');
  }
}

/**
 * Re-exported so other server code (e.g. an API route) can share the same
 * ActionResult-shaped response while still signalling rate-limit hits.
 */
export type { ActionResult };
