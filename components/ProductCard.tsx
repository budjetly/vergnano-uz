"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/products";
import type { Locale, Dictionary } from "@/lib/i18n";

export default function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const { add, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    add(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <article className="group flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(42,27,18,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(42,27,18,0.12)]">
      <Link
        href={`/${locale}/products/${product.id}`}
        className="relative mx-auto block h-48 w-full"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa">
          {dict.products.categories[product.category]} · {product.packSize}
        </p>
        <h3 className="mt-1 font-display text-lg font-bold">
          <Link
            href={`/${locale}/products/${product.id}`}
            className="transition-colors hover:text-brand-red"
          >
            {product.name}
          </Link>
        </h3>

        {product.intensity !== null && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wide text-cocoa">
              {dict.products.intensity}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i < (product.intensity ?? 0) ? "bg-espresso" : "bg-espresso/15"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium">{product.intensity}/10</span>
          </div>
        )}

        <p className="mt-2 flex-1 text-sm leading-relaxed text-cocoa">
          {product.description[locale]}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-display text-lg font-bold">
            {formatPrice(product.price)}{" "}
            <span className="text-xs font-normal text-cocoa">{dict.currency}</span>
          </p>
          <button
            onClick={justAdded ? openCart : handleAdd}
            className={`rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
              justAdded
                ? "bg-tan text-espresso"
                : "bg-espresso text-cream hover:bg-espresso-light"
            }`}
          >
            {justAdded ? `✓ ${dict.products.added}` : dict.products.addToCart}
          </button>
        </div>
      </div>
    </article>
  );
}
