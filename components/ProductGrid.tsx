"use client";

import { useState } from "react";
import { products, categories, type Category } from "@/lib/products";
import ProductCard from "./ProductCard";
import type { Locale, Dictionary } from "@/lib/i18n";

export default function ProductGrid({
  locale,
  dict,
  initialCategory,
}: {
  locale: Locale;
  dict: Dictionary;
  initialCategory?: string;
}) {
  const [active, setActive] = useState<Category | "all">(
    categories.includes(initialCategory as Category)
      ? (initialCategory as Category)
      : "all"
  );

  const filtered =
    active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActive("all")}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
            active === "all"
              ? "bg-espresso text-cream"
              : "bg-white text-espresso hover:bg-cream-dark"
          }`}
        >
          {dict.products.all}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              active === category
                ? "bg-espresso text-cream"
                : "bg-white text-espresso hover:bg-cream-dark"
            }`}
          >
            {dict.products.categories[category]}
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-cocoa">{dict.products.priceNote}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            dict={dict}
          />
        ))}
      </div>
    </section>
  );
}
