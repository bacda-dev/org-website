import type { Metadata } from 'next';
import { Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { ContactForm } from '@/components/sections/contact-form';
import { BreadcrumbSchema } from '@/lib/seo/json-ld';
import { cn } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const CONTACT_EMAIL = 'contactus@bayareacreativedancers.org';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Bay Area Creative Dancers for collaborations, bookings, workshops, or press inquiries. Based in Fremont, California.',
  alternates: { canonical: SITE_URL + '/contact' },
  openGraph: {
    title: 'Contact — Bay Area Creative Dancers',
    description:
      'Get in touch with Bay Area Creative Dancers for collaborations, bookings, and inquiries.',
    url: SITE_URL + '/contact',
    type: 'website',
  },
};

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/BayAreaCreativeDanceAcademy',
    Icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/bayareacreativedanceacademy',
    Icon: Instagram,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UCPYZ8dOpCwy-bFLRqoiX90g',
    Icon: Youtube,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 md:pt-40">
        <div className="container">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
            Say hello
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium italic leading-[1.05] md:text-6xl lg:text-7xl">
            Get in touch
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            For collaborations, bookings, workshops, or press inquiries — send
            us a note and we&apos;ll be in touch.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid gap-16 md:grid-cols-12 md:gap-12">
            {/* Form */}
            <div className="md:col-span-7">
              <h2
                id="contact-intro"
                className="font-display text-2xl font-medium italic md:text-3xl"
              >
                Send a message
              </h2>
              <p className="mt-3 text-sm text-muted">
                We reply to most messages within two business days.
              </p>
              <div className="mt-10">
                <ContactForm />
              </div>
            </div>

            {/* Info column */}
            <aside className="md:col-span-5 md:pl-8">
              <div className="space-y-10 rounded-md border border-border bg-white p-8 md:p-10">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
                    Reach us
                  </p>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="inline-flex items-center gap-2 text-ink hover:text-burgundy"
                      >
                        <Mail className="size-4" aria-hidden="true" />
                        {CONTACT_EMAIL}
                      </a>
                    </li>
                    <li className="inline-flex items-center gap-2 text-ink/80">
                      <MapPin className="size-4" aria-hidden="true" />
                      Based in Fremont, CA
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
                    Follow along
                  </p>
                  <div className="mt-4 flex gap-2">
                    {SOCIALS.map(({ label, href, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={cn(
                          'inline-flex h-10 w-10 items-center justify-center rounded-full',
                          'border border-border text-ink/70 transition-all',
                          'hover:border-burgundy hover:text-burgundy',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2'
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
                    On the map
                  </p>
                  <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-md border border-border">
                    <iframe
                      title="Fremont, California map"
                      src="https://www.google.com/maps?q=Fremont,CA+94539&output=embed"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full border-0"
                      rel="nofollow"
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL + '/' },
          { name: 'Contact', url: SITE_URL + '/contact' },
        ]}
      />
    </>
  );
}
