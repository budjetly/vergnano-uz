import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playfair_Display, Jost } from "next/font/google";
import { locales, isLocale, getDictionary } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "cyrillic"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SITE_URL = "https://caffevergnano1882.uz";

const seo: Record<string, { title: string; description: string; ogLocale: string }> = {
  uz: {
    title: "Caffè Vergnano Uz — 1882-yildan beri Italiya qahva an'anasi",
    description:
      "Caffè Vergnano 1882 (Turin, Italiya) brendining O'zbekistondagi rasmiy importchisi va distribyutori. Donali va maydalangan qahva, kapsulalar, chaldalar — kafe, restoran, ofis va uy uchun.",
    ogLocale: "uz_UZ",
  },
  ru: {
    title: "Caffè Vergnano Uz — итальянская кофейная традиция с 1882 года",
    description:
      "Официальный импортёр и дистрибьютор Caffè Vergnano 1882 (Турин, Италия) в Узбекистане. Зерновой и молотый кофе, капсулы, чалды — для кафе, ресторанов, офисов и дома.",
    ogLocale: "ru_RU",
  },
  en: {
    title: "Caffè Vergnano Uz — Italian coffee tradition since 1882",
    description:
      "Official importer and distributor of Caffè Vergnano 1882 (Turin, Italy) in Uzbekistan. Whole beans, ground coffee, capsules and pods — for cafés, restaurants, offices and home.",
    ogLocale: "en_US",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = seo[locale] ?? seo.uz;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.title, template: "%s | Caffè Vergnano Uz" },
    description: t.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { uz: "/uz", ru: "/ru", en: "/en" },
    },
    openGraph: {
      type: "website",
      siteName: "Caffè Vergnano Uz",
      title: t.title,
      description: t.description,
      url: `/${locale}`,
      locale: t.ogLocale,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Caffè Vergnano Uz" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: ["/og.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${playfair.variable} ${jost.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <Header locale={locale} dict={dict} />
          <main>{children}</main>
          <Footer locale={locale} dict={dict} />
          <CartDrawer locale={locale} dict={dict} />
        </CartProvider>
      </body>
    </html>
  );
}
