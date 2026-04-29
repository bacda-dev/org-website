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
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-md rounded-sm border border-cream/10 bg-ink-50 p-10 shadow-lg">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo size="2xl" priority />
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-burgundy">
            Admin
          </p>
          <h1 className="font-display text-3xl font-normal leading-tight text-cream">
            Sign in.
          </h1>
          <p className="text-sm text-cream/55">
            Authorized BACDA administrators only.
          </p>
        </div>
        <div className="mt-10">
          <LoginForm defaultRedirect={from} />
        </div>
      </div>
    </div>
  );
}
