/**
 * Resend email wrapper — used by the contact form server action.
 *
 * Graceful degradation: when `RESEND_API_KEY` is absent (local dev without
 * credentials, CI without secrets, preview deploy before env is wired),
 * `sendEmail` logs the payload and returns a synthetic `ok: true` response
 * with a `mock-*` id. This keeps the contact-form flow green end-to-end
 * without creating flaky tests that depend on a live inbox.
 *
 * SERVER-SIDE ONLY — never import from a client component. The Resend
 * constructor holds the secret key; it must never reach the browser bundle.
 */

import { Resend } from 'resend';

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  text?: string;
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

const DEFAULT_FROM = 'BACDA <onboarding@resend.dev>';

/**
 * Sends a transactional email via Resend, or logs + mocks when no key is set.
 *
 * Returns a discriminated union so callers can pattern-match:
 *   const result = await sendEmail({...});
 *   if (!result.ok) { … }
 */
export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const key = process.env.RESEND_API_KEY;
  const fromAddress =
    input.from ?? process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM;

  if (!key) {
    // Structured log so operators can still audit "what would have been sent"
    // in dev. We deliberately don't log the HTML body to keep the logs
    // readable — use the DB row (`contact_submissions`) as the source of truth.
    // eslint-disable-next-line no-console
    console.warn(
      '[resend] RESEND_API_KEY unset; skipping send. to=%s subject=%s',
      input.to,
      input.subject,
    );
    return { ok: true, id: `mock-${Date.now()}` };
  }

  try {
    const client = new Resend(key);
    const { data, error } = await client.emails.send({
      from: fromAddress,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      ...(input.text ? { text: input.text } : {}),
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id ?? 'unknown' };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Resend error',
    };
  }
}

/**
 * Minimal HTML escape. We don't pull in a library because the only user
 * input we render is short-form form fields (name, email, subject, message).
 */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Renders the ops-facing email body for a contact-form submission.
 * Keeps HTML minimal and brand-neutral — this is an operations notification,
 * not marketing. Includes a plaintext counterpart for clients that strip HTML.
 */
export function renderContactFormEmail(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): { html: string; text: string } {
  const subject = input.subject?.trim() || '(no subject)';
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  const html = [
    '<!doctype html>',
    '<html lang="en">',
    '<head><meta charset="utf-8" /></head>',
    '<body style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;color:#1a1a1a;background:#faf7f2;padding:24px;">',
    '<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e8e2d5;border-radius:8px;padding:24px;">',
    '<h1 style="font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6b6b;margin:0 0 16px;border-bottom:1px solid #e8e2d5;padding-bottom:12px;">BACDA Contact Form Submission</h1>',
    '<table cellspacing="0" cellpadding="0" style="width:100%;font-size:14px;line-height:1.5;">',
    `<tr><td style="padding:4px 0;color:#6b6b6b;width:90px;">Name</td><td style="padding:4px 0;">${escapeHtml(name)}</td></tr>`,
    `<tr><td style="padding:4px 0;color:#6b6b6b;">Email</td><td style="padding:4px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#c2570b;text-decoration:none;">${escapeHtml(email)}</a></td></tr>`,
    `<tr><td style="padding:4px 0;color:#6b6b6b;">Subject</td><td style="padding:4px 0;">${escapeHtml(subject)}</td></tr>`,
    '</table>',
    '<div style="margin-top:20px;padding-top:16px;border-top:1px solid #e8e2d5;">',
    '<div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6b6b;margin-bottom:8px;">Message</div>',
    `<div style="white-space:pre-wrap;font-size:14px;line-height:1.6;">${escapeHtml(message)}</div>`,
    '</div>',
    '</div>',
    '</body>',
    '</html>',
  ].join('');

  const text = [
    'BACDA Contact Form Submission',
    '=============================',
    '',
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject}`,
    '',
    'Message',
    '-------',
    message,
    '',
  ].join('\n');

  return { html, text };
}
