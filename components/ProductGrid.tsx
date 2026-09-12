"use client";

import Link from "next/link";
import { products, collections, type Collection } from "@/lib/products";
import ProductCard from "./ProductCard";
import type { Locale, Dictionary } from "@/lib/i18n";

export default function ProductGrid({
  locale,
  dict,
  active,
}: {
  locale: Locale;
  dict: Dictionary;
  active: Collection | "all";
}) {
  const t = dict.products;
  const filtered =
    active === "all" ? products : products.filter((p) => p.collection === active);
  const chips: (Collection | "all")[] = [...collections, "all"];

  return (
    <section id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14">
      <div className="flex flex-wrap justify-center gap-2">
        {chips.map((c) => (
          <Link
            key={c}
            href={`/${locale}/products?category=${c}#catalog`}
            scroll={false}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              active === c
                ? "bg-espresso text-cream"
                : "bg-white text-espresso hover:bg-cream-dark"
            }`}
          >
            {t.collections[c]}
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          {t.collections[active]}
        </h2>
        <p className="mt-2 text-sm text-cocoa">
          {filtered.length} {t.items} · {t.priceNote}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mx-auto mt-12 max-w-md rounded-2xl bg-white p-10 text-center shadow-[0_2px_16px_rgba(42,27,18,0.06)]">
          <p className="font-display text-2xl font-bold">{t.comingSoon}</p>
          <p className="mt-2 text-sm text-cocoa">{t.comingSoonText}</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </section>
  );
}
