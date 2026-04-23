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
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Dashboard
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight">
          Welcome{session?.user.email ? `, ${session.user.email}` : ''}
        </h1>
        <p className="max-w-2xl text-muted">
          Quick overview of what&rsquo;s upcoming, pending, and recently
          updated. Use the nav above to manage content.
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Last 5 content edits across events, testimonials, and team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="text-sm text-muted">No activity yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {activity.map((item) => (
                  <li key={`${item.table}-${item.id}`} className="py-3">
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-4 rounded-sm text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
                    >
                      <span className="text-ink">{item.label}</span>
                      <span className="text-xs text-muted">
                        {formatDate(item.updatedAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump into a fresh entry.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild variant="default">
              <Link href="/admin/events/new">
                <Plus className="size-4" aria-hidden="true" />
                New event
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/testimonials">
                <Plus className="size-4" aria-hidden="true" />
                New testimonial
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/admin/home">Edit home content</Link>
            </Button>
          </CardContent>
        </Card>
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
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <Card className="h-full">
        <CardContent className="flex flex-col gap-2 p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">
              {label}
            </p>
            <span className="text-burgundy">{icon}</span>
          </div>
          <p className="font-display text-4xl font-medium text-ink">{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
