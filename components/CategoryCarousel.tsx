"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { collections, collectionImages } from "@/lib/products";
import type { Locale, Dictionary } from "@/lib/i18n";

// Infinite carousel: the card set is rendered three times and the scroll
// position is kept inside the middle copy, so swiping either way loops.
export default function CategoryCarousel({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const track = useRef<HTMLDivElement>(null);
  const t = dict.products;
  const sets = [0, 1, 2];

  // Keep the scroll position inside the middle copy. Detection is done with
  // an IntersectionObserver (fires for any scroll source: swipe, wheel,
  // arrows) so it does not depend on scroll events.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const setWidth = () => el.scrollWidth / 3;
    el.scrollLeft = setWidth();

    const recenter = () => {
      const w = setWidth();
      const x = el.scrollLeft;
      if (x < w * 0.5) el.scrollLeft = x + w;
      else if (x > w * 2.5 - el.clientWidth) el.scrollLeft = x - w;
    };
    const io = new IntersectionObserver(recenter, { root: el, threshold: 0 });
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => io.observe(c));
    el.addEventListener("scrollend", recenter);
    // cheap safety net for browsers that throttle observers (two reads, 4×/s)
    const tick = window.setInterval(recenter, 250);
    return () => {
      io.disconnect();
      el.removeEventListener("scrollend", recenter);
      window.clearInterval(tick);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const delta = dir * ((card?.offsetWidth ?? 360) + 16);
    // jump a full set before animating so the animation itself never crosses
    // the wrap point
    const w = el.scrollWidth / 3;
    const target = el.scrollLeft + delta;
    if (target < w * 0.5) el.scrollLeft += w;
    else if (target > w * 2.5 - el.clientWidth) el.scrollLeft -= w;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="py-4">
      <div
        ref={track}
        className="flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sets.map((set) =>
          collections.map((c) => (
            <Link
              key={`${set}-${c}`}
              data-card
              href={`/${locale}/${c}`}
              aria-hidden={set !== 1}
              tabIndex={set === 1 ? 0 : -1}
              className="group relative aspect-[4/3] w-[78vw] shrink-0 overflow-hidden rounded-2xl sm:w-[360px] lg:w-[380px]"
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
          ))
        )}
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between px-4">
        <button
          onClick={() => step(-1)}
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-tan/40 text-espresso transition-colors hover:bg-tan"
        >
          ←
        </button>
        <a
          href="#catalog"
          className="rounded-full bg-tan px-7 py-3 text-sm font-semibold text-espresso transition-transform hover:scale-105"
        >
          {t.seeAll}
        </a>
        <button
          onClick={() => step(1)}
          aria-label="Next"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-tan/40 text-espresso transition-colors hover:bg-tan"
        >
          →
        </button>
      </div>
    </section>
  );
}
