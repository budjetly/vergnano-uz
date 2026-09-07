import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";
import { products } from "@/lib/products";
import { productDetails } from "@/lib/product-details";
import ProductBuyBox from "@/components/ProductBuyBox";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  return { title: product ? product.name : "Product" };
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white px-5 py-3.5 shadow-[0_2px_12px_rgba(42,27,18,0.05)]">
      <span className="text-sm text-cocoa">{label}</span>
      <span className="flex items-center gap-2.5">
        <span className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < value ? "bg-espresso" : "bg-espresso/15"
              }`}
            />
          ))}
        </span>
        <span className="font-display text-lg font-bold">
          {value}
          <span className="text-xs font-normal text-cocoa">/10</span>
        </span>
      </span>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  const dict = getDictionary(locale);
  const t = dict.products.detail;
  const detail = productDetails[product.id];

  const related = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const sameA = a.category === product.category ? 0 : 1;
      const sameB = b.category === product.category ? 0 : 1;
      return sameA - sameB;
    })
    .slice(0, 4);

  const facts: { label: string; value: string }[] = [];
  if (detail?.blend) facts.push({ label: t.blend, value: detail.blend });
  if (detail?.roast)
    facts.push({
      label: t.roast,
      value: detail.roast === "dark" ? t.roastDark : t.roastMedium,
    });
  facts.push({ label: t.packSize, value: product.packSize });

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-7xl px-4 pt-6 text-sm text-cocoa">
        <Link href={`/${locale}`} className="hover:text-espresso">
          {dict.nav.home}
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/${locale}/products`} className="hover:text-espresso">
          {dict.nav.products}
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/${locale}/products?category=${product.category}`}
          className="hover:text-espresso"
        >
          {dict.products.categories[product.category]}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-espresso">{product.name}</span>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:py-16">
        <Reveal>
          <div className="relative flex items-center justify-center rounded-3xl bg-gradient-to-b from-cream-dark/70 to-paper p-8">
            <div
              aria-hidden
              className="absolute inset-0 overflow-hidden rounded-3xl opacity-[0.08]"
            >
              <svg
                className="h-full w-full"
                viewBox="0 0 400 400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <ellipse cx="70" cy="80" rx="26" ry="38" transform="rotate(-20 70 80)" />
                <path d="M70 46c0 30 0 46 0 68" />
                <ellipse cx="340" cy="90" rx="22" ry="32" transform="rotate(25 340 90)" />
                <path d="M340 62c0 26 0 38 0 56" />
                <ellipse cx="90" cy="330" rx="24" ry="34" transform="rotate(15 90 330)" />
                <path d="M90 300c0 26 0 40 0 60" />
                <ellipse cx="330" cy="320" rx="28" ry="40" transform="rotate(-15 330 320)" />
                <path d="M330 284c0 32 0 46 0 72" />
                <path d="M180 40c40 20 40 60 0 80s-40 60 0 80" strokeDasharray="3 6" />
              </svg>
            </div>
            <div className="relative h-80 w-full sm:h-96">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-contain"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-red">
            {dict.products.categories[product.category]}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            {product.name}
          </h1>
          {detail && (
            <p className="mt-2 font-display text-xl italic text-cocoa">
              {detail.subtitle[locale]}
            </p>
          )}
          <p className="mt-5 leading-relaxed text-cocoa">
            {product.description[locale]}
          </p>

          {(product.intensity !== null || detail?.body != null) && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {detail?.body != null && <Meter label={t.body} value={detail.body} />}
              {product.intensity !== null && (
                <Meter label={dict.products.intensity} value={product.intensity} />
              )}
            </div>
          )}

          <div className="mt-6">
            <ProductBuyBox product={product} dict={dict} />
          </div>
        </Reveal>
      </section>

      {/* Facts + taste notes */}
      <section className="border-y border-espresso/10 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2">
          <Reveal>
            <dl>
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center justify-between border-b border-espresso/10 py-4"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
                    {fact.label}
                  </dt>
                  <dd className="font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          {detail && detail.notes.length > 0 && (
            <Reveal delay={120}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
                {t.tasteNotes}
              </p>
              <div className="flex flex-wrap gap-3">
                {detail.notes.map((note) => (
                  <span
                    key={note}
                    className="flex items-center gap-2 rounded-full border border-espresso/15 bg-white px-5 py-2.5 text-sm font-medium"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-tan" />
                    {t.notes[note]}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Craft band */}
      <section className="relative overflow-hidden bg-espresso text-cream">
        <Image
          src="/images/craft-tazzina.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 to-espresso/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24">
          <Reveal>
            <p className="max-w-xl font-display text-2xl font-bold leading-snug sm:text-3xl">
              {t.craftLine}
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-tan">
              Caffè Vergnano · 1882
            </p>
          </Reveal>
        </div>
      </section>

      {/* Related products */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {t.relatedTitle}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
