import { products } from "@/lib/products";
import ProductCard from "./ProductCard";
import type { Locale, Dictionary } from "@/lib/i18n";

export default function ProductGrid({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.products;
  return (
    <section id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{t.collections.all}</h2>
        <p className="mt-2 text-sm text-cocoa">
          {products.length} {t.items} · {t.priceNote}
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
        ))}
      </div>
    </section>
  );
}
