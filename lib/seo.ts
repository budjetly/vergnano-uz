import type { Metadata } from "next";
import { locales, type Locale } from "./i18n";
import { site } from "./site";

export const SITE_URL = "https://caffevergnano1882.uz";

export const siteName: Record<Locale, string> = {
  uz: "Caffè Vergnano Uzbekistan",
  ru: "Caffè Vergnano Узбекистан",
  en: "Caffè Vergnano Uzbekistan",
};

export const ogLocale: Record<Locale, string> = { uz: "uz_UZ", ru: "ru_RU", en: "en_US" };

export const defaultSeo: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  uz: {
    title: "Caffè Vergnano Uzbekistan — Rasmiy distribyutor | Italiya qahvasi 1882-yildan",
    description:
      "Caffè Vergnano 1882 (Turin, Italiya) qahvasining O'zbekistondagi rasmiy importchisi va distribyutori. Donali va maydalangan qahva, Nespresso kapsulalari, chaldalar — Toshkentda kafe, restoran, ofis va uy uchun. Yetkazib berish va ulgurji narxlar.",
    keywords: ["Caffè Vergnano", "Caffe Vergnano Uzbekistan", "Vergnano O'zbekiston", "Vergnano Toshkent", "italyan qahvasi", "espresso", "qahva Toshkent", "donali qahva", "Nespresso kapsulalari", "Caffè Vergnano 1882 rasmiy distribyutor"],
  },
  ru: {
    title: "Caffè Vergnano Узбекистан — Официальный дистрибьютор | Итальянский кофе с 1882 года",
    description:
      "Официальный импортёр и дистрибьютор кофе Caffè Vergnano 1882 (Турин, Италия) в Узбекистане. Зерновой и молотый кофе, капсулы Nespresso, чалды — для кафе, ресторанов, офисов и дома в Ташкенте. Доставка и оптовые цены.",
    keywords: ["Caffè Vergnano", "Кафе Верньяно", "Vergnano Узбекистан", "Vergnano Ташкент", "итальянский кофе", "эспрессо", "кофе Ташкент", "кофе в зёрнах", "капсулы Nespresso", "Caffè Vergnano 1882 официальный дистрибьютор"],
  },
  en: {
    title: "Caffè Vergnano Uzbekistan — Official Distributor | Italian Coffee since 1882",
    description:
      "Official importer and distributor of Caffè Vergnano 1882 (Turin, Italy) in Uzbekistan. Whole bean and ground coffee, Nespresso-compatible capsules and ESE pods — for cafés, restaurants, offices and home in Tashkent. Delivery and wholesale pricing.",
    keywords: ["Caffè Vergnano", "Caffe Vergnano Uzbekistan", "Vergnano Tashkent", "Italian coffee Uzbekistan", "espresso Tashkent", "coffee beans Tashkent", "Nespresso compatible capsules", "Caffè Vergnano 1882 official distributor"],
  },
};

/** Canonical + hreflang + OpenGraph for one page (`path` is locale-less, e.g. "/products"). */
export function pageMeta(
  locale: Locale,
  opts: { title: string; description: string; path: string; image?: string; type?: "website" | "article" }
): Metadata {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}${opts.path}`;
  languages["x-default"] = `/uz${opts.path}`;
  const image = opts.image ?? "/og.jpg";
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: `/${locale}${opts.path}`, languages },
    openGraph: {
      type: opts.type ?? "website",
      siteName: siteName[locale],
      title: opts.title,
      description: opts.description,
      url: `/${locale}${opts.path}`,
      locale: ogLocale[locale],
      images: [{ url: image, alt: opts.title }],
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [image] },
  };
}

// ---- JSON-LD -----------------------------------------------------------------

const orgId = `${SITE_URL}/#organization`;

export function organizationJsonLd(locale: Locale) {
  const t = defaultSeo[locale];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteName[locale],
        alternateName: ["Caffè Vergnano Uz", "Caffe Vergnano 1882 Uzbekistan", "Vergnano Uzbekistan"],
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo-vergnano.png`,
        image: `${SITE_URL}/og.jpg`,
        description: t.description,
        telephone: site.phoneHref.replace("tel:", ""),
        email: site.email,
        sameAs: [`https://t.me/${site.telegram}`, `https://instagram.com/${site.instagram}`],
        address: { "@type": "PostalAddress", addressLocality: "Tashkent", addressCountry: "UZ" },
        areaServed: { "@type": "Country", name: "Uzbekistan" },
        brand: { "@type": "Brand", name: "Caffè Vergnano 1882" },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phoneHref.replace("tel:", ""),
          contactType: "sales",
          availableLanguage: ["uz", "ru", "en"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: siteName[locale],
        publisher: { "@id": orgId },
        inLanguage: locale,
      },
      {
        "@type": "Store",
        "@id": `${SITE_URL}/#store`,
        name: siteName[locale],
        url: `${SITE_URL}/${locale}`,
        image: `${SITE_URL}/og.jpg`,
        telephone: site.phoneHref.replace("tel:", ""),
        priceRange: "UZS",
        currenciesAccepted: "UZS",
        paymentAccepted: "Payme, Click, Uzum, Paynet, bank transfer",
        address: { "@type": "PostalAddress", addressLocality: "Tashkent", addressCountry: "UZ" },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "18:00",
        },
        parentOrganization: { "@id": orgId },
      },
    ],
  };
}

export function productJsonLd(
  locale: Locale,
  p: { id: string; name: string; description: string; image: string; price: number; packSize: string; collection: string | null },
  collectionName: string | null
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/${locale}/products/${p.id}#product`,
    name: `Caffè Vergnano ${p.name}`,
    description: p.description,
    image: `${SITE_URL}${p.image}`,
    sku: p.id,
    brand: { "@type": "Brand", name: "Caffè Vergnano 1882" },
    category: collectionName ?? undefined,
    size: p.packSize,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/${locale}/products/${p.id}`,
      price: p.price,
      priceCurrency: "UZS",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": orgId },
      areaServed: "UZ",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.url}`,
    })),
  };
}

/** Serialise for a <script type="application/ld+json"> without breaking out of the tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
