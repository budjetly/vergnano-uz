import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import CategoryCarousel from "@/components/CategoryCarousel";
import ProductGrid from "@/components/ProductGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "uz";
  const dict = getDictionary(l);
  return pageMeta(l, { title: `${dict.products.title} — Caffè Vergnano 1882`, description: `${dict.products.heroLead} ${dict.products.heroAccent}. ${dict.products.heroSubtitle} ${dict.products.subtitle}.`, path: "/products" });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <section className="bg-paper pb-6 pt-16 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {dict.products.heroLead}
            <br />
            <span className="italic font-normal">{dict.products.heroAccent}</span>
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-cocoa"
            style={{ animationDelay: "120ms" }}
          >
            {dict.products.heroSubtitle}
          </p>
        </div>
      </section>
      <div className="bg-paper pb-10">
        <CategoryCarousel locale={locale} dict={dict} />
      </div>
      <ProductGrid locale={locale} dict={dict} />
    </>
  );
}
