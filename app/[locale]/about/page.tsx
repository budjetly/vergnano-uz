import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.about.title };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const values = [
    { title: dict.about.value1Title, text: dict.about.value1Text },
    { title: dict.about.value2Title, text: dict.about.value2Text },
    { title: dict.about.value3Title, text: dict.about.value3Text },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-espresso text-cream">
        <Image
          src="/images/famiglia-vergnano.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_22%]"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
          <p className="animate-fade-up mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-tan">
            {dict.about.title}
          </p>
          <h1
            className="animate-fade-up max-w-3xl text-4xl font-bold leading-tight sm:text-5xl"
            style={{ animationDelay: "120ms" }}
          >
            {dict.about.heroTitle}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 font-display text-6xl font-bold text-tan">1882</p>
            <p className="text-lg leading-relaxed">{dict.about.p1}</p>
            <p className="mt-5 text-lg leading-relaxed">{dict.about.p2}</p>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/images/roastery-quality.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-espresso text-cream">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-tan">
              {dict.about.missionTitle}
            </p>
            <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">
              «{dict.about.missionText}»
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {dict.about.valuesTitle}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 120}>
              <div className="h-full rounded-2xl bg-white p-8 shadow-[0_2px_16px_rgba(42,27,18,0.06)]">
                <p className="font-display text-4xl font-bold text-tan">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-xl font-bold">{value.title}</h3>
                <p className="mt-2 leading-relaxed text-cocoa">{value.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* B2B CTA */}
      <section className="border-t border-espresso/10 bg-cream-dark/50">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              {dict.about.b2bTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-cocoa">
              {dict.about.b2bText}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="mt-8 inline-block rounded-full bg-espresso px-8 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-espresso-light"
            >
              {dict.home.b2bCta}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
