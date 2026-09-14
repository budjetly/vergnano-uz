import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMeta, breadcrumbJsonLd, jsonLd, siteName } from "@/lib/seo";
import { products, collections, collectionImages, type Collection, type Product } from "@/lib/products";
import { productDetails } from "@/lib/product-details";
import { lineContent } from "@/lib/lines";
import ProductBuyBox from "@/components/ProductBuyBox";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return collections.map((collection) => ({ collection }));
}

function isCollection(v: string): v is Collection {
  return (collections as string[]).includes(v);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; collection: string }>;
}): Promise<Metadata> {
  const { locale, collection } = await params;
  const l = isLocale(locale) ? locale : "uz";
  if (!isCollection(collection)) return { title: "Caffè Vergnano" };
  const dict = getDictionary(l);
  const name = dict.products.collections[collection];
  const content = lineContent[collection];
  const count = products.filter((p) => p.collection === collection).length;
  const title = `${name} — Caffè Vergnano`;
  const description = `${content?.tagline[l] ?? name}. ${content?.intro[0]?.[l] ?? ""} ${count} ${dict.products.items}. ${siteName[l]}.`.replace(/\s+/g, " ").trim();
  return pageMeta(l, { title, description, path: `/${collection}`, image: collectionImages[collection] });
}

export default async function LinePage({
  params,
}: {
  params: Promise<{ locale: string; collection: string }>;
}) {
  const { locale, collection } = await params;
  if (!isLocale(locale) || !isCollection(collection)) notFound();
  const dict = getDictionary(locale);
  const t = dict.products;
  const content = lineContent[collection];
  const title = t.collections[collection];
  const items = products.filter((p) => p.collection === collection);
  const beans = items.filter((p) => p.category !== "capsules");
  const capsules = items.filter((p) => p.category === "capsules");

  const Block = ({ product, index }: { product: Product; index: number }) => {
    const d = productDetails[product.id];
    const accent = content?.accents?.[product.id];
    const flip = index % 2 === 1;
    return (
      <Reveal>
        <div className={`grid items-center gap-10 lg:grid-cols-2 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-dark/40">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-contain p-6"
            />
          </div>
          <div>
            <h3
              className="font-display text-3xl font-bold uppercase tracking-[0.12em] sm:text-4xl"
              style={accent ? { color: accent } : undefined}
            >
              {product.name.replace(/^Riserva Torino\s*/i, "").replace(/\s*—\s*Capsule$/i, "")}
            </h3>
            {d && (
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em]" style={accent ? { color: accent } : undefined}>
                {d.subtitle[locale]}
              </p>
            )}
            <p className="mt-6 leading-relaxed text-espresso">{product.description[locale]}</p>

            {d && d.notes.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">{t.detail.tasteNotes}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.notes.map((n) => (
                    <span key={n} className="rounded-full border border-espresso/15 bg-white px-4 py-2 text-sm">
                      {t.detail.notes[n]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <dl className="mt-6 divide-y divide-espresso/10 border-y border-espresso/10 text-sm">
              {product.intensity !== null && (
                <div className="flex justify-between py-3">
                  <dt className="font-semibold uppercase tracking-[0.15em] text-cocoa">{t.intensity}</dt>
                  <dd>{product.intensity} / 10</dd>
                </div>
              )}
              <div className="flex justify-between py-3">
                <dt className="font-semibold uppercase tracking-[0.15em] text-cocoa">{t.line.format}</dt>
                <dd>{product.packSize}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <ProductBuyBox product={product} dict={dict} />
            </div>
            <Link href={`/${locale}/products/${product.id}`} className="mt-3 inline-block text-sm text-cocoa underline-offset-4 hover:underline">
              {t.line.discover} →
            </Link>
          </div>
        </div>
      </Reveal>
    );
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbJsonLd([
              { name: dict.nav.home, url: `/${locale}` },
              { name: dict.nav.products, url: `/${locale}/products` },
              { name: title, url: `/${locale}/${collection}` },
            ])
          ),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-espresso text-cream">
        {content?.heroVideo ? (
          <video autoPlay muted loop playsInline preload="metadata" poster={content.heroPoster} className="absolute inset-0 h-full w-full object-cover">
            <source src={content.heroVideo} type="video/mp4" />
          </video>
        ) : (
          <Image src={collectionImages[collection]} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-end px-4 pb-14 [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
          <h1 className="animate-fade-up font-display text-5xl font-bold sm:text-6xl">{title}</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Reveal>
          {content && (
            <h2 className="font-display text-3xl font-bold sm:text-5xl">{content.tagline[locale]}</h2>
          )}
          {content?.intro.map((p, i) => (
            <p key={i} className="mx-auto mt-5 max-w-3xl leading-relaxed text-cocoa">{p[locale]}</p>
          ))}
          {capsules.length > 0 && (
            <p className="mt-5 text-xs italic text-cocoa">{t.line.trademark}</p>
          )}
        </Reveal>
      </section>

      {/* Formats */}
      {content?.formats && (
        <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 md:grid-cols-2">
          {content.formats.map((f, i) => (
            <Reveal key={f.anchor} delay={i * 120}>
              <a href={`#${f.anchor}`} className="group block text-center">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream-dark/50">
                  <Image src={f.image} alt={f.label[locale]} fill sizes="(max-width: 768px) 90vw, 45vw" className="object-contain p-8 transition-transform duration-500 group-hover:scale-105" />
                </div>
                <span className="mt-5 inline-block rounded-xl bg-tan px-8 py-3 text-sm font-semibold text-espresso">{f.label[locale]}</span>
              </a>
            </Reveal>
          ))}
        </section>
      )}

      {/* Products */}
      {items.length === 0 ? (
        <section className="mx-auto max-w-md px-4 pb-20 text-center">
          <p className="font-display text-2xl font-bold">{t.comingSoon}</p>
          <p className="mt-2 text-sm text-cocoa">{t.comingSoonText}</p>
        </section>
      ) : (
        <>
          <section id="beans" className="mx-auto max-w-7xl scroll-mt-24 space-y-24 px-4 pb-24">
            {capsules.length > 0 && (
              <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">{t.line.beans}</h2>
            )}
            {beans.map((p, i) => <Block key={p.id} product={p} index={i} />)}
          </section>
          {capsules.length > 0 && (
            <section id="capsules" className="mx-auto max-w-7xl scroll-mt-24 space-y-24 px-4 pb-24">
              <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">{t.line.capsules}</h2>
              {capsules.map((p, i) => <Block key={p.id} product={p} index={i} />)}
            </section>
          )}
        </>
      )}

      {/* Full video */}
      {content?.fullVideo && (
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">{t.line.watchVideo}</h2>
              <video controls playsInline preload="metadata" poster={content.heroPoster} className="mt-10 aspect-video w-full rounded-2xl bg-black">
                <source src={content.fullVideo} type="video/mp4" />
              </video>
            </Reveal>
          </div>
        </section>
      )}

      <section className="py-14 text-center">
        <Link href={`/${locale}/products`} className="rounded-full border border-espresso/25 px-8 py-3.5 text-sm font-semibold transition-colors hover:border-espresso">
          {t.line.backToCatalog}
        </Link>
      </section>
    </>
  );
}
