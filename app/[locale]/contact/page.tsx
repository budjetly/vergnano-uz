import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.contact.title };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const info = [
    { label: dict.contact.phoneLabel, value: site.phone, href: site.phoneHref },
    {
      label: dict.contact.telegramLabel,
      value: `@${site.telegram}`,
      href: `https://t.me/${site.telegram}`,
    },
    { label: dict.contact.emailLabel, value: site.email, href: `mailto:${site.email}` },
    { label: dict.contact.addressLabel, value: site.address[locale] },
    { label: dict.contact.hoursLabel, value: dict.contact.hours },
  ];

  return (
    <>
      <section className="bg-espresso py-16 text-center text-cream">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="animate-fade-up font-display text-4xl font-bold sm:text-5xl">
            {dict.contact.title}
          </h1>
          <p
            className="animate-fade-up mt-4 text-cream/75"
            style={{ animationDelay: "120ms" }}
          >
            {dict.contact.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <div className="rounded-2xl bg-white p-8 shadow-[0_2px_16px_rgba(42,27,18,0.06)]">
            <h2 className="mb-6 font-display text-2xl font-bold">
              {dict.contact.formTitle}
            </h2>
            <ContactForm locale={locale} dict={dict} />
          </div>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-2">
          <div className="rounded-2xl bg-espresso p-8 text-cream">
            <h2 className="mb-6 font-display text-2xl font-bold text-tan">
              {dict.contact.infoTitle}
            </h2>
            <ul className="space-y-5">
              {info.map((item) => (
                <li key={item.label}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-tan">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="mt-1 block text-lg transition-colors hover:text-tan"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-lg">{item.value}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-espresso/10 bg-cream-dark/60 p-8">
            <h3 className="font-display text-xl font-bold">{dict.contact.b2bTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cocoa">
              {dict.contact.b2bText}
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
