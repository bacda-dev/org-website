/**
 * Public POST /api/contact — accepts JSON or form-encoded payloads and
 * forwards to the `submitContactForm` server action.
 *
 *  - 200 on success
 *  - 400 on Zod validation failure
 *  - 429 when the IP is rate-limited
 *  - 500 on server error
 *
 * This runs on the Node.js runtime (default for route handlers) so that
 * `createServerClient()` (service-role) can read `SUPABASE_SERVICE_ROLE_KEY`.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { submitContactForm } from '@/lib/actions/contact';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function extractIp(req: NextRequest): string | null {
  // Standard proxy header first.
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list; the client IP is first.
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return null;
}

async function parseBody(req: NextRequest): Promise<unknown> {
  const type = (req.headers.get('content-type') ?? '').toLowerCase();
  if (type.includes('application/json')) {
    try {
      return (await req.json()) as unknown;
    } catch {
      return null;
    }
  }
  if (
    type.includes('application/x-www-form-urlencoded') ||
    type.includes('multipart/form-data')
  ) {
    try {
      const form = await req.formData();
      const out: Record<string, string> = {};
      for (const [k, v] of form.entries()) {
        if (typeof v === 'string') out[k] = v;
      }
      return out;
    } catch {
      return null;
    }
  }
  // Last-ditch: try JSON anyway (some clients forget to set the header).
  try {
    return (await req.json()) as unknown;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await parseBody(req);
  if (body === null) {
    return NextResponse.json(
      { ok: false, error: 'Invalid request body' },
      { status: 400 },
    );
  }

  const result = await submitContactForm(body, {
    ip: extractIp(req),
    userAgent: req.headers.get('user-agent'),
  });

  if (result.ok) {
    return NextResponse.json(result, { status: 200 });
  }

  const status =
    result.code === 'RATE_LIMITED'
      ? 429
      : result.code === 'VALIDATION'
        ? 400
        : result.code === 'AUTH'
          ? 401
          : 500;
  return NextResponse.json(result, { status });
}

export function GET(): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'Method Not Allowed' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
