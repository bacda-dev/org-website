/**
 * Admin — Social links (read-only per user directive #5).
 *
 * Socials are codebase-constant; admins cannot edit without a code change.
 * Acceptable tradeoff for a volunteer-run small org (from the W2-T2 ticket
 * brief). If this ever needs to become admin-editable, add a `socials`
 * singleton table + extend `home_content`.
 */

import { ExternalLink, Facebook, Instagram, Youtube } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const SOCIALS: ReadonlyArray<{
  name: string;
  handle: string;
  url: string;
  icon: React.ReactNode;
}> = [
  {
    name: 'Instagram',
    handle: '@bayareacreativedanceacademy',
    url: 'https://www.instagram.com/bayareacreativedanceacademy/',
    icon: <Instagram className="size-5" aria-hidden="true" />,
  },
  {
    name: 'YouTube',
    handle: 'UCPYZ8dOpCwy-bFLRqoiX90g',
    url: 'https://www.youtube.com/channel/UCPYZ8dOpCwy-bFLRqoiX90g',
    icon: <Youtube className="size-5" aria-hidden="true" />,
  },
  {
    name: 'Facebook',
    handle: '/BayAreaCreativeDanceAcademy',
    url: 'https://www.facebook.com/BayAreaCreativeDanceAcademy',
    icon: <Facebook className="size-5" aria-hidden="true" />,
  },
];

export default function AdminSocialPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cream/55">
          Admin · Social
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          Social links
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-cream/55">
          Social handles are configured in the codebase per user directive. To
          change any of these, a code update is required — not editable from
          this dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current handles</CardTitle>
          <CardDescription>Read-only for v1.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-cream/10">
            {SOCIALS.map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-burgundy">{s.icon}</span>
                  <div>
                    <p className="font-medium text-cream">{s.name}</p>
                    <p className="font-mono text-xs text-cream/55">{s.handle}</p>
                  </div>
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-burgundy underline-offset-4 hover:underline"
                >
                  Visit
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="text-xs text-cream/55">
        To edit a handle, open a PR against{' '}
        <code className="font-mono">components/sections/footer.tsx</code> (or
        wherever the constant lives) or ask an engineer to add a
        <code className="font-mono"> socials</code> table later.
      </p>
    </div>
  );
}
