"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { locales, localeNames, type Locale, type Dictionary } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { collections } from "@/lib/products";

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "") || "";

  // Pages that open on a full-bleed dark hero: the header floats over it,
  // transparent, until the visitor scrolls.
  const heroPage =
    pathWithoutLocale === "" ||
    pathWithoutLocale === "/about" ||
    collections.some((c) => pathWithoutLocale === `/${c}`);
  const overlay = heroPage && !scrolled && !menuOpen;
  const ink = overlay ? "text-cream" : "text-espresso";
  const line = overlay ? "border-cream/30" : "border-espresso/15";

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${ink} ${
        overlay
          ? "bg-gradient-to-b from-black/45 to-transparent"
          : scrolled
            ? "bg-paper/95 shadow-[0_2px_20px_rgba(42,27,18,0.08)] backdrop-blur"
            : "bg-paper"
      }`}
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href={`/${locale}`}
          className="group flex shrink-0 items-center gap-3"
        >
          <Image
            src="/images/logo-vergnano.png"
            alt="Caffè Vergnano 1882"
            width={53}
            height={53}
            priority
            className="h-12 w-12 shrink-0 sm:h-[53px] sm:w-[53px]"
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-lg font-bold tracking-wide xl:text-2xl">
              Caffè Vergnano <span className={overlay ? "text-tan" : "text-brand-red"}>1882</span>
            </span>
            <span className={`text-[10px] font-medium uppercase tracking-[0.35em] ${overlay ? "text-tan" : "text-brand-red"}`}>
              Uzbekistan
            </span>
          </span>
        </Link>

          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  overlay
                    ? isActive(link.href) ? "text-tan" : "text-cream hover:text-tan"
                    : isActive(link.href) ? "text-brand-red" : "text-espresso hover:text-brand-red"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 rounded-full border ${line} p-0.5 text-xs`}>
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}${pathWithoutLocale}`}
                title={localeNames[l]}
                className={`rounded-full px-2 py-1 font-medium uppercase transition-colors ${
                  l === locale
                    ? overlay ? "bg-cream text-espresso" : "bg-espresso text-cream"
                    : overlay ? "text-cream/75 hover:text-cream" : "text-cocoa hover:text-espresso"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>

          <button
            onClick={openCart}
            aria-label={dict.nav.cart}
            className={`relative rounded-full border ${line} p-2.5 transition-colors ${overlay ? "hover:border-cream/70" : "hover:border-espresso/40"}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 8H6.2" />
              <circle cx="9.5" cy="20" r="1.2" />
              <circle cx="17" cy="20" r="1.2" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className={`rounded-full border ${line} p-2.5 lg:hidden`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-espresso/10 bg-paper px-4 py-3 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2.5 text-sm font-medium ${
                isActive(link.href) ? "text-brand-red" : "text-espresso"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
    {/* Keeps page content below the fixed header on pages without a hero. */}
    {!heroPage && <div aria-hidden className="h-[80px] sm:h-[85px]" />}
    </>
  );
}
