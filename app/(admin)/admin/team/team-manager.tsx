'use client';

/**
 * TeamManager — grid of team member cards + add/edit dialog.
 */

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { TeamFormDialog } from './team-form-dialog';
import { deleteTeamMember } from '@/lib/actions/team';
import type { TeamMemberRow } from '@/types/database';

export interface TeamManagerProps {
  members: TeamMemberRow[];
}

export function TeamManager({ members }: TeamManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<TeamMemberRow | null>(null);
  const [creating, setCreating] = React.useState(false);

  const handleDelete = async (id: string) => {
    const result = await deleteTeamMember(id);
    if (!result.ok) {
      toast.error(result.error ?? 'Delete failed');
      return;
    }
    toast.success('Team member removed');
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-cream/55">
          {members.length} member{members.length === 1 ? '' : 's'}
        </p>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden="true" />
          New member
        </Button>
      </div>

      {members.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-cream/55">
            No team members yet.
          </CardContent>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <li key={m.id}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-cream/10 bg-ink-100">
                      {m.photo_url ? (
                        <Image
                          src={m.photo_url}
                          alt={m.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg">{m.name}</CardTitle>
                      <CardDescription>{m.role}</CardDescription>
                      {m.is_lead ? (
                        <Badge variant="default" className="mt-2">
                          Lead
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(m)}>
                    <Pencil className="size-4" aria-hidden="true" />
                    Edit
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete
                      </Button>
                    }
                    title={`Remove ${m.name}?`}
                    description="This cannot be undone."
                    confirmLabel="Remove"
                    onConfirm={() => handleDelete(m.id)}
                  />
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <TeamFormDialog
        open={creating}
        onOpenChange={(v) => setCreating(v)}
        initial={null}
        allMembers={members}
      />
      <TeamFormDialog
        open={editing !== null}
        onOpenChange={(v) => {
          if (!v) setEditing(null);
        }}
        initial={editing}
        allMembers={members}
      />
    </div>
  );
}
