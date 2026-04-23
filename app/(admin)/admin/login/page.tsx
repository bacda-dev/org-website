import type { Metadata } from 'next';
import { LoginForm } from './login-form';
import { Logo } from '@/components/brand/logo';

export const metadata: Metadata = {
  title: 'Admin Sign In',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { from?: string };
}) {
  const from = typeof searchParams?.from === 'string' ? searchParams.from : '/admin';
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-16">
      <div className="w-full max-w-md rounded-md border border-border bg-white p-8 shadow-md">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo variant="color" size="md" priority />
          <h1 className="font-display text-2xl font-medium tracking-tight text-ink">
            Admin Sign In
          </h1>
          <p className="text-sm text-muted">
            Authorized BACDA administrators only.
          </p>
        </div>
        <div className="mt-8">
          <LoginForm defaultRedirect={from} />
        </div>
      </div>
    </div>
  );
}
