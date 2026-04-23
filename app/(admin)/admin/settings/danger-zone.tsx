'use client';

/**
 * DangerZone — "Sign out of all sessions" button. Calls supabase.auth
 * signOut with `scope: 'global'` which revokes all refresh tokens.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { createClient } from '@/lib/supabase/client';

export function DangerZone() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const handleGlobalSignOut = async () => {
    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        toast.error(error.message || 'Sign out failed');
        return;
      }
      toast.success('All sessions signed out');
      router.push('/admin/login');
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive" disabled={pending}>
          <LogOut className="size-4" aria-hidden="true" />
          Sign out all sessions
        </Button>
      }
      title="Sign out of every device?"
      description="This ends your session on every browser and device where this account is signed in. You will need to sign in again."
      confirmLabel="Sign out everywhere"
      onConfirm={handleGlobalSignOut}
    />
  );
}
