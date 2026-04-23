/**
 * Admin — Contact form submissions viewer (read-only table).
 */

import { createServerClient } from '@/lib/supabase/server';
import { SubmissionsViewer } from './submissions-viewer';
import type { ContactSubmissionRow } from '@/types/database';

export const dynamic = 'force-dynamic';

async function loadSubmissions(): Promise<ContactSubmissionRow[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) return [];
  return (data ?? []) as ContactSubmissionRow[];
}

export default async function AdminSubmissionsPage() {
  const submissions = await loadSubmissions();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Admin · Submissions
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          Contact submissions
        </h1>
        <p className="mt-1 text-sm text-muted">
          Messages from the public contact form. Click a row to read the
          full message. Read-state is tracked locally in your browser.
        </p>
      </div>

      <SubmissionsViewer submissions={submissions} />
    </div>
  );
}
