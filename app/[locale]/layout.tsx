import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playfair_Display, Jost } from "next/font/google";
import { locales, isLocale, getDictionary } from "@/lib/i18n";
import { SITE_URL, siteName, defaultSeo, pageMeta, organizationJsonLd, jsonLd } from "@/lib/seo";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "uz";
  const t = defaultSeo[l];
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: siteName[l],
    keywords: t.keywords,
    authors: [{ name: siteName[l], url: SITE_URL }],
    creator: siteName[l],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    },
    ...pageMeta(l, { title: t.title, description: t.description, path: "" }),
    title: { default: t.title, template: `%s | ${siteName[l]}` },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd(locale)) }}
        />
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
