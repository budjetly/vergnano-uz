import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import type { Locale, Dictionary } from "@/lib/i18n";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const year = new Date().getFullYear();

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="bg-espresso text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image
              src="/images/logo-vergnano.png"
              alt="Caffè Vergnano 1882"
              width={48}
              height={48}
              className="h-12 w-12 shrink-0"
            />
            <div className="leading-none">
              <p className="font-display text-2xl font-bold">Caffè Vergnano 1882</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.35em] text-tan">
                Uzbekistan
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-cream/70">
            {dict.footer.aboutText}
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg italic text-tan">
            {dict.footer.linksTitle}
          </h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-cream/70 transition-colors hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg italic text-tan">
            {dict.footer.contactTitle}
          </h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>
              <a href={site.phoneHref} className="transition-colors hover:text-cream">
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://t.me/${site.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-cream"
              >
                Telegram: @{site.telegram}
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${site.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-cream"
              >
                Instagram: @{site.instagram}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="transition-colors hover:text-cream"
              >
                {site.email}
              </a>
            </li>
            <li>{site.address[locale]}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-cream/50 sm:flex-row">
          <p>
            © {year} {site.name}. {dict.footer.rights}
          </p>
          <p>{dict.footer.officialNote}</p>
        </div>
      </div>
    </footer>
  );
}
