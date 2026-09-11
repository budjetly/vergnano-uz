"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";

const copy = {
  uz: { title: "Sahifa topilmadi", text: "Siz izlagan sahifa mavjud emas yoki ko'chirilgan.", home: "Bosh sahifaga qaytish", products: "Mahsulotlarni ko'rish" },
  ru: { title: "Страница не найдена", text: "Страница, которую вы ищете, не существует или была перемещена.", home: "На главную", products: "Смотреть продукцию" },
  en: { title: "Page not found", text: "The page you're looking for doesn't exist or has moved.", home: "Back to home", products: "Browse products" },
};

export default function NotFound() {
  const pathname = usePathname();
  const first = pathname.split("/")[1];
  const locale = isLocale(first) ? first : "uz";
  const t = copy[locale];
  const dict = getDictionary(locale);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-7xl font-bold text-tan">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{t.title}</h1>
      <p className="mt-4 text-cocoa">{t.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/${locale}`}
          className="rounded-full bg-espresso px-7 py-3 text-sm font-semibold text-cream transition-colors hover:bg-espresso-light"
        >
          {t.home}
        </Link>
        <Link
          href={`/${locale}/products`}
          className="rounded-full border border-espresso/25 px-7 py-3 text-sm font-semibold transition-colors hover:border-espresso"
        >
          {t.products}
        </Link>
      </div>
      <p className="mt-10 text-xs uppercase tracking-[0.25em] text-cocoa">{dict.tagline}</p>
    </section>
  );
}
