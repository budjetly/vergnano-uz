"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { collections, collectionImages, type Collection } from "@/lib/products";
import type { Locale, Dictionary } from "@/lib/i18n";

export default function CategoryCarousel({
  locale,
  dict,
  active,
}: {
  locale: Locale;
  dict: Dictionary;
  active: Collection | "all";
}) {
  const track = useRef<HTMLDivElement>(null);
  const t = dict.products;

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 360) + 16), behavior: "smooth" });
  };

  const cards: (Collection | "all")[] = [...collections, "all"];

  return (
    <section className="py-4">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((c) => (
          <Link
            key={c}
            data-card
            href={`/${locale}/products?category=${c}#catalog`}
            scroll={false}
            className={`group relative aspect-[4/3] w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[360px] lg:w-[380px] ${
              active === c ? "ring-2 ring-espresso ring-offset-2 ring-offset-cream" : ""
            }`}
          >
            <Image
              src={collectionImages[c]}
              alt={t.collections[c]}
              fill
              sizes="(max-width: 640px) 78vw, 380px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 font-display text-2xl font-semibold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
              {t.collections[c]}
            </p>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between px-4">
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-tan/40 text-espresso transition-colors hover:bg-tan"
        >
          ←
        </button>
        <Link
          href={`/${locale}/products?category=all#catalog`}
          scroll={false}
          className="rounded-full bg-tan px-7 py-3 text-sm font-semibold text-espresso transition-transform hover:scale-105"
        >
          {t.seeAll}
        </Link>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Next"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-tan/40 text-espresso transition-colors hover:bg-tan"
        >
          →
        </button>
      </div>
    </section>
  );
}
