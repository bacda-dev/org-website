import type { Metadata } from 'next';
import { Mail, MapPin, Facebook, Instagram, Youtube, ArrowUpRight } from 'lucide-react';
import { ContactForm } from '@/components/sections/contact-form';
import { Reveal } from '@/components/sections/reveal';
import { BreadcrumbSchema } from '@/lib/seo/json-ld';
import { cn } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const CONTACT_EMAIL = 'contactus@bayareacreativedancers.org';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Bay Area Creative Dance Academy for collaborations, bookings, workshops, or press inquiries. Based in Fremont, California.',
  alternates: { canonical: SITE_URL + '/contact' },
  openGraph: {
    title: 'Contact — Bay Area Creative Dance Academy',
    description:
      'Get in touch with Bay Area Creative Dance Academy for collaborations, bookings, and inquiries.',
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
      <section className="relative bg-ink pt-36 md:pt-44">
        <div className="container">
          <Reveal>
            <span className="label-eyebrow">Say hello</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-[14ch] display-xl italic leading-[0.95] text-cream">
              Let&apos;s stage something together.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-cream/65 md:text-xl">
              For collaborations, bookings, workshops, or press — send us a
              note. We reply to most messages within two business days.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-20 md:py-28" id="contact-intro">
        <div className="container">
          <div className="grid gap-16 md:grid-cols-12 md:gap-16">
            {/* Form */}
            <div className="md:col-span-7">
              <Reveal className="border-t border-cream/10 pt-8">
                <p className="label-eyebrow">Write to us</p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 display-sm italic text-cream md:text-4xl">
                  Send a message
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-10">
                  <ContactForm />
                </div>
              </Reveal>
            </div>

            {/* Info column */}
            <aside className="md:col-span-5">
              <Reveal className="border-t border-cream/10 pt-8">
                <p className="label-eyebrow">Reach us</p>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-6 space-y-5">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="group flex items-start gap-3 text-cream transition-colors hover:text-burgundy"
                  >
                    <Mail
                      className="mt-1 size-4 shrink-0 text-burgundy"
                      aria-hidden="true"
                    />
                    <span className="font-display text-xl italic md:text-2xl">
                      {CONTACT_EMAIL}
                    </span>
                  </a>
                  <div className="flex items-start gap-3 text-cream/75">
                    <MapPin
                      className="mt-1 size-4 shrink-0 text-burgundy"
                      aria-hidden="true"
                    />
                    <span className="font-display text-xl italic md:text-2xl">
                      Fremont, California
                    </span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-10 border-t border-cream/10 pt-8">
                  <p className="label-eyebrow-muted">Follow along</p>
                  <div className="mt-5 flex gap-2">
                    {SOCIALS.map(({ label, href, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={cn(
                          'inline-flex h-11 w-11 items-center justify-center rounded-full',
                          'border border-cream/20 text-cream/75 transition-all',
                          'hover:border-burgundy hover:text-burgundy',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Map */}
              <Reveal delay={0.15}>
                <div className="mt-10 border-t border-cream/10 pt-8">
                  <p className="label-eyebrow-muted">On the map</p>
                  <div className="mt-6 relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-cream/10 bg-ink-100">
                    <iframe
                      title="Fremont, California map"
                      src="https://www.google.com/maps?q=Fremont,CA+94539&output=embed"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 h-full w-full border-0 opacity-80 contrast-95 invert-[0.92] hue-rotate-180"
                      rel="nofollow"
                    />
                  </div>
                </div>
              </Reveal>
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
