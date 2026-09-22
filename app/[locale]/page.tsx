import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const featured = [
    products.find((p) => p.id === "beans-granaroma"),
    products.find((p) => p.id === "caps-cremoso"),
    products.find((p) => p.id === "ground-arabica-tin"),
    products.find((p) => p.id === "caps-oro-50"),
  ].filter((p) => p !== undefined);

  const categoryImages: { key: keyof typeof dict.products.categories; image: string; href: string }[] = [
    { key: "beans", image: "/products/beans-granaroma.png", href: `/${locale}/caffe-in-grani` },
    { key: "ground", image: "/products/ground-arabica-tin.png", href: `/${locale}/caffe-macinato` },
    { key: "capsules", image: "/products/caps-cremoso.png", href: `/${locale}/products#catalog` },
    { key: "pods", image: "/products/pods-oro-150.png", href: `/${locale}/products#catalog` },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-espresso text-cream">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-spot.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero-cover.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative mx-auto flex min-h-svh max-w-7xl flex-col items-center justify-center px-4 py-24 text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
          <h1
            className="animate-fade-up max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "120ms" }}
          >
            {dict.hero.title}
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-2xl text-base leading-relaxed text-cream/80 sm:text-lg"
            style={{ animationDelay: "240ms" }}
          >
            {dict.hero.subtitle}
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              href={`/${locale}/products`}
              className="rounded-full bg-cream px-8 py-3.5 text-sm font-semibold tracking-wide text-espresso transition-transform hover:scale-105"
            >
              {dict.hero.ctaProducts}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="rounded-full border border-cream/40 px-8 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-cream/10"
            >
              {dict.hero.ctaContact}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-espresso/10 bg-paper">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 px-4 py-12 text-center">
          {[
            { value: "140+", label: dict.home.statsYears },
            { value: "90+", label: dict.home.statsCountries },
            { value: "17+", label: dict.home.statsProducts },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 120}>
              <p className="font-display text-4xl font-bold sm:text-5xl">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-cocoa sm:text-sm">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {dict.home.categoriesTitle}
          </h2>
          <p className="mt-3 text-cocoa">{dict.home.categoriesSubtitle}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoryImages.map(({ key, image, href }, i) => (
            <Reveal key={key} delay={i * 100}>
              <Link
                href={href}
                className="group flex flex-col items-center rounded-2xl bg-white p-8 shadow-[0_2px_16px_rgba(42,27,18,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(42,27,18,0.12)]"
              >
                <div className="relative h-36 w-full">
                  <Image
                    src={image}
                    alt={dict.products.categories[key]}
                    fill
                    sizes="200px"
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="mt-5 font-display text-lg font-bold">
                  {dict.products.categories[key]}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* B2B */}
      <section className="bg-espresso text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/b2b-accademia.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-tan">
              HoReCa · B2B
            </p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              {dict.home.b2bTitle}
            </h2>
            <p className="mt-5 leading-relaxed text-cream/80">{dict.home.b2bText}</p>
            <Link
              href={`/${locale}/contact`}
              className="mt-8 inline-block rounded-full bg-tan px-8 py-3.5 text-sm font-semibold tracking-wide text-espresso transition-transform hover:scale-105"
            >
              {dict.home.b2bCta}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {dict.home.featuredTitle}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={i * 100}>
              <ProductCard product={product} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/products`}
            className="inline-block rounded-full bg-espresso px-8 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-espresso-light"
          >
            {dict.home.featuredCta}
          </Link>
        </div>
      </section>

      {/* About teaser */}
      <section className="border-t border-espresso/10 bg-cream-dark/50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-red">
              1882
            </p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              {dict.home.aboutTitle}
            </h2>
            <p className="mt-5 leading-relaxed text-cocoa">{dict.home.aboutText}</p>
            <Link
              href={`/${locale}/about`}
              className="mt-8 inline-block rounded-full border border-espresso/25 px-8 py-3.5 text-sm font-semibold tracking-wide transition-colors hover:border-espresso"
            >
              {dict.home.aboutCta}
            </Link>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/story-family.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
