/**
 * Admin Dashboard — landing screen after sign-in.
 *
 * Aggregates a few quick stats + recent activity. All reads hit the anon
 * server client (RLS-respecting) — the signed-in user's session cookie is
 * enough to satisfy the admin RLS policies per db-architect's migrations.
 *
 * Per user directive #4 (no newsletter), the "unread subscribers" card is
 * replaced with # testimonials and # contact submissions.
 */

import Link from 'next/link';
import { Plus, Mail, Calendar, Users, MessageSquare } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { createAnonServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface ActivityItem {
  table: 'events' | 'testimonials' | 'team_members';
  id: string;
  label: string;
  updatedAt: string;
  href: string;
}

async function loadStats(): Promise<{
  upcomingEvents: number;
  submissions: number;
  testimonials: number;
  draftEvents: number;
}> {
  const supabase = createAnonServerClient();
  const [upcoming, submissions, testimonials, drafts] = await Promise.all([
    supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'upcoming'),
    supabase
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('testimonials')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'draft'),
  ]);
  return {
    upcomingEvents: upcoming.count ?? 0,
    submissions: submissions.count ?? 0,
    testimonials: testimonials.count ?? 0,
    draftEvents: drafts.count ?? 0,
  };
}

async function loadActivity(): Promise<ActivityItem[]> {
  const supabase = createAnonServerClient();
  const [events, testimonials, team] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5),
    supabase
      .from('testimonials')
      .select('id, author_name, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5),
    supabase
      .from('team_members')
      .select('id, name, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5),
  ]);

  const items: ActivityItem[] = [];
  for (const row of (events.data ?? []) as Array<{
    id: string;
    title: string;
    updated_at: string;
  }>) {
    items.push({
      table: 'events',
      id: row.id,
      label: `Event — ${row.title}`,
      updatedAt: row.updated_at,
      href: `/admin/events/${row.id}`,
    });
  }
  for (const row of (testimonials.data ?? []) as Array<{
    id: string;
    author_name: string;
    updated_at: string;
  }>) {
    items.push({
      table: 'testimonials',
      id: row.id,
      label: `Testimonial — ${row.author_name}`,
      updatedAt: row.updated_at,
      href: `/admin/testimonials`,
    });
  }
  for (const row of (team.data ?? []) as Array<{
    id: string;
    name: string;
    updated_at: string;
  }>) {
    items.push({
      table: 'team_members',
      id: row.id,
      label: `Team — ${row.name}`,
      updatedAt: row.updated_at,
      href: `/admin/team`,
    });
  }

  items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return items.slice(0, 5);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  const [stats, activity] = await Promise.all([loadStats(), loadActivity()]);

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-3 border-b border-cream/10 pb-10">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-burgundy">
          Dashboard
        </p>
        <h1 className="font-display text-4xl font-normal leading-[1.05] text-cream md:text-5xl">
          {session?.user.email
            ? `Welcome back.`
            : 'Welcome.'}
        </h1>
        {session?.user.email && (
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-cream/55">
            Signed in as {session.user.email}
          </p>
        )}
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-cream/70">
          What&rsquo;s upcoming, pending, and recently updated. Use the nav
          above to manage content.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Calendar className="size-5" aria-hidden="true" />}
          label="Upcoming events"
          value={stats.upcomingEvents}
          href="/admin/events"
        />
        <StatCard
          icon={<Mail className="size-5" aria-hidden="true" />}
          label="Contact submissions"
          value={stats.submissions}
          href="/admin/submissions"
        />
        <StatCard
          icon={<MessageSquare className="size-5" aria-hidden="true" />}
          label="Testimonials"
          value={stats.testimonials}
          href="/admin/testimonials"
        />
        <StatCard
          icon={<Users className="size-5" aria-hidden="true" />}
          label="Drafts"
          value={stats.draftEvents}
          href="/admin/events"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-sm border border-cream/10 bg-ink-50 p-6 lg:col-span-2">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-burgundy">
            Recent activity
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight text-cream">
            Last five edits.
          </h2>
          <p className="mt-1 text-sm text-cream/55">
            Across events, testimonials, and team.
          </p>
          <div className="mt-6">
            {activity.length === 0 ? (
              <p className="text-sm text-cream/55">No activity yet.</p>
            ) : (
              <ul className="divide-y divide-cream/10">
                {activity.map((item) => (
                  <li key={`${item.table}-${item.id}`}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between gap-4 rounded-sm py-4 text-sm transition-colors hover:bg-cream/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50"
                    >
                      <span className="text-cream/85 group-hover:text-cream">
                        {item.label}
                      </span>
                      <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-cream/45">
                        {formatDate(item.updatedAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-sm border border-cream/10 bg-ink-50 p-6">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-burgundy">
            Quick actions
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight text-cream">
            Start a fresh entry.
          </h2>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/admin/events/new"
              className="group inline-flex items-center justify-between gap-2 rounded-full bg-burgundy px-5 py-3 text-xs font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-burgundy-dark"
            >
              <span className="flex items-center gap-2">
                <Plus className="size-4" aria-hidden="true" />
                New event
              </span>
            </Link>
            <Link
              href="/admin/testimonials"
              className="group inline-flex items-center justify-between gap-2 rounded-full border border-cream/25 px-5 py-3 text-xs font-medium uppercase tracking-[0.22em] text-cream/85 transition-colors hover:border-cream/60 hover:text-cream"
            >
              <span className="flex items-center gap-2">
                <Plus className="size-4" aria-hidden="true" />
                New testimonial
              </span>
            </Link>
            <Link
              href="/admin/home"
              className="inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-cream"
            >
              <span className="border-b border-cream/30 pb-0.5 group-hover:border-cream">
                Edit home content →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-sm border border-cream/10 bg-ink-50 p-6 transition-all hover:border-burgundy/40 hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-cream/50">
          {label}
        </p>
        <span className="text-burgundy transition-transform group-hover:scale-110">
          {icon}
        </span>
      </div>
      <p className="mt-4 font-display text-5xl leading-none text-cream">
        {value}
      </p>
    </Link>
  );
}
