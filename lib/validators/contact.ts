/**
 * Zod schemas for the public contact form.
 *
 * `ContactFormSchema` — the payload the client sends.
 * `ContactSubmissionSchema` — the full row shape (client payload + server-side
 *   ip_address + user_agent captured from request headers).
 */

import { z } from 'zod';

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .describe('Visitor name'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(320, 'Email must be at most 320 characters')
    .describe('Reply-to email address'),
  subject: z
    .string()
    .max(200, 'Subject must be at most 200 characters')
    .nullish()
    .describe('Optional subject line'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be at most 2000 characters')
    .describe('Message body'),
});

export type ContactForm = z.infer<typeof ContactFormSchema>;

/**
 * Full contact submission shape inserted into `contact_submissions`.
 * `ip_address` is Postgres `inet`; we pass it as a string and let PG validate.
 */
export const ContactSubmissionSchema = ContactFormSchema.extend({
  ip_address: z
    .string()
    .max(64, 'ip_address must be at most 64 characters')
    .nullish()
    .describe('Submitter IP (from x-forwarded-for / x-real-ip)'),
  user_agent: z
    .string()
    .max(1000, 'user_agent must be at most 1000 characters')
    .nullish()
    .describe('Raw User-Agent header'),
});

export type ContactSubmission = z.infer<typeof ContactSubmissionSchema>;
