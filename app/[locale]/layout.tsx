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

export const metadata: Metadata = {
  title: {
    default: "Caffè Vergnano Uz — Italian coffee tradition since 1882",
    template: "%s | Caffè Vergnano Uz",
  },
  description:
    "Official importer and distributor of Caffè Vergnano 1882 in Uzbekistan. Whole beans, ground coffee, capsules and pods — delivered directly from Turin, Italy.",
};

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
