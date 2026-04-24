/**
 * Admin — Settings: password + session + read-only config.
 */

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getHomeContent } from '@/lib/fetchers/home';
import { ChangePasswordForm } from './change-password-form';
import { DangerZone } from './danger-zone';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const home = await getHomeContent();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '—';
  const youtubeChannelId = 'UCPYZ8dOpCwy-bFLRqoiX90g';
  const donateUrl = home?.donate_url ?? '';

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cream/55">
          Admin · Settings
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          Settings
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Updates your Supabase Auth password. Enter your new password twice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Read-only values. To change them, update environment variables or
            the relevant admin screen.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-cream/55">
              Supabase project URL
            </p>
            <p className="break-all font-mono text-xs text-cream">{supabaseUrl}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-cream/55">
              YouTube channel ID
            </p>
            <p className="font-mono text-xs text-cream">{youtubeChannelId}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-cream/55">
              Donate URL
            </p>
            {donateUrl ? (
              <p className="break-all font-mono text-xs text-cream">{donateUrl}</p>
            ) : (
              <p className="text-xs text-cream/55">
                Not set — hidden from nav/footer.{' '}
                <Link href="/admin/home" className="text-burgundy underline-offset-4 hover:underline">
                  Edit on /admin/home
                </Link>
                .
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-error">Danger zone</CardTitle>
          <CardDescription>
            Ends every active admin session on every device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DangerZone />
        </CardContent>
      </Card>
    </div>
  );
}
