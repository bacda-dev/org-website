import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          404
        </p>
        <h1 className="mt-6 font-display text-4xl font-medium md:text-5xl">
          We can&apos;t find that page
        </h1>
        <p className="mt-4 text-muted">
          The page you&apos;re looking for may have moved or never existed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-md border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-cream"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
