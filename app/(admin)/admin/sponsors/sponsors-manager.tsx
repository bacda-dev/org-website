'use client';

/**
 * SponsorsManager — table + dialog CRUD for sponsors.
 */

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import {
  DataTable,
  DataTableEmpty,
  DataTableHead,
} from '@/components/admin/data-table';
import { SponsorFormDialog } from './sponsor-form-dialog';
import {
  deleteSponsor,
  toggleSponsorActive,
} from '@/lib/actions/sponsors';
import type { SponsorRow } from '@/types/database';

export interface SponsorsManagerProps {
  sponsors: SponsorRow[];
}

export function SponsorsManager({ sponsors }: SponsorsManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<SponsorRow | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  const toggleActive = async (id: string) => {
    setPendingId(id);
    try {
      const result = await toggleSponsorActive(id);
      if (!result.ok) {
        toast.error(result.error ?? 'Could not toggle');
        return;
      }
      toast.success(result.data.is_active ? 'Sponsor shown' : 'Sponsor hidden');
      router.refresh();
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteSponsor(id);
    if (!result.ok) {
      toast.error(result.error ?? 'Delete failed');
      return;
    }
    toast.success('Sponsor deleted');
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          {sponsors.length} sponsor{sponsors.length === 1 ? '' : 's'}
        </p>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden="true" />
          New sponsor
        </Button>
      </div>

      <DataTable caption="Sponsors list">
        <DataTableHead
          columns={[
            { key: 'logo', label: 'Logo' },
            { key: 'name', label: 'Name' },
            { key: 'website', label: 'Website' },
            { key: 'status', label: 'Status' },
            { key: 'sort', label: 'Order' },
            { key: 'actions', label: 'Actions', className: 'text-right' },
          ]}
        />
        <tbody>
          {sponsors.length === 0 ? (
            <DataTableEmpty colSpan={6} message="No sponsors yet." />
          ) : (
            sponsors.map((s) => (
              <tr key={s.id} className="border-b border-border">
                <td className="px-4 py-3">
                  {s.logo_url ? (
                    <div className="relative h-10 w-20 bg-cream">
                      <Image
                        src={s.logo_url}
                        alt={`${s.name} logo`}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {s.website_url ? (
                    <a
                      href={s.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-burgundy hover:underline"
                    >
                      {new URL(s.website_url).hostname}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={pendingId === s.id}
                    onClick={() => toggleActive(s.id)}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
                    aria-label={s.is_active ? 'Hide sponsor' : 'Show sponsor'}
                  >
                    {s.is_active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="outline">Hidden</Badge>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm">{s.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(s)}>
                      <Pencil className="size-4" aria-hidden="true" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      }
                      title={`Delete ${s.name}?`}
                      description="This cannot be undone."
                      confirmLabel="Delete"
                      onConfirm={() => handleDelete(s.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </DataTable>

      <SponsorFormDialog
        open={creating}
        onOpenChange={setCreating}
        initial={null}
      />
      <SponsorFormDialog
        open={editing !== null}
        onOpenChange={(v) => {
          if (!v) setEditing(null);
        }}
        initial={editing}
      />
    </div>
  );
}
