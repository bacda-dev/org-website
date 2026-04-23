/**
 * Admin — Team members CRUD.
 */

import { getTeamMembers } from '@/lib/fetchers/team';
import { TeamManager } from './team-manager';

export const dynamic = 'force-dynamic';

export default async function AdminTeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Admin · Team
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          Team
        </h1>
        <p className="mt-1 text-sm text-muted">
          Artistic lead, coordinators, and collaborators.
        </p>
      </div>

      <TeamManager members={members} />
    </div>
  );
}
