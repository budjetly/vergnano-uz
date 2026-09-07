import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";
import ProductGrid from "@/components/ProductGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.products.title };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { category } = await searchParams;

  return (
    <>
      <section className="bg-espresso py-16 text-center text-cream">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="animate-fade-up font-display text-4xl font-bold sm:text-5xl">
            {dict.products.title}
          </h1>
          <p
            className="animate-fade-up mt-4 text-cream/75"
            style={{ animationDelay: "120ms" }}
          >
            {dict.products.subtitle}
          </p>
        </div>
      </section>
      <ProductGrid locale={locale} dict={dict} initialCategory={category} />
    </>
  );
}
