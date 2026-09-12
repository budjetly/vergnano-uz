import type { Locale } from "./i18n";

export type NoteKey =
  | "caramel"
  | "chocolate"
  | "milkChocolate"
  | "cocoa"
  | "vanilla"
  | "citrus"
  | "redFruits"
  | "yellowFruit"
  | "nuts"
  | "spices"
  | "tea"
  | "biscuit"
  | "flowers"
  | "liquorice"
  | "pastry";

export type Roast = "medium" | "dark";

export interface ProductDetail {
  subtitle: Record<Locale, string>;
  blend: string | null; // universal string, e.g. "Arabica + Robusta"
  body: number | null; // corposità 1–10
  roast: Roast | null;
  notes: NoteKey[];
}

export const productDetails: Record<string, ProductDetail> = {
  "rt-nobile": {
    subtitle: { uz: "Yumshoq va muvozanatli", ru: "Мягкий и сбалансированный", en: "Smooth & balanced" },
    blend: "Arabica + Robusta", body: 7, roast: "medium", notes: ["cocoa", "pastry", "caramel"],
  },
  "rt-arabica": {
    subtitle: { uz: "Nozik va xushbo'y", ru: "Деликатный и ароматный", en: "Delicate & aromatic" },
    blend: "100% Arabica", body: 5, roast: "medium", notes: ["milkChocolate", "caramel", "liquorice", "nuts"],
  },
  "rt-cremoso": {
    subtitle: { uz: "Kuchli va to'liq tanali", ru: "Интенсивный и полнотелый", en: "Intense & full-bodied" },
    blend: "Arabica + Robusta", body: 9, roast: "dark", notes: ["cocoa", "spices", "nuts"],
  },
  "rt-caps-nobile": {
    subtitle: { uz: "Yumshoq va muvozanatli", ru: "Мягкий и сбалансированный", en: "Smooth & balanced" },
    blend: "Arabica + Robusta", body: 7, roast: "medium", notes: ["cocoa", "pastry", "caramel"],
  },
  "rt-caps-arabica": {
    subtitle: { uz: "Nozik va xushbo'y", ru: "Деликатный и ароматный", en: "Delicate & aromatic" },
    blend: "100% Arabica", body: 5, roast: "medium", notes: ["milkChocolate", "caramel", "liquorice", "nuts"],
  },
  "rt-caps-cremoso": {
    subtitle: { uz: "Kuchli va to'liq tanali", ru: "Интенсивный и полнотелый", en: "Intense & full-bodied" },
    blend: "Arabica + Robusta", body: 9, roast: "dark", notes: ["cocoa", "spices", "nuts"],
  },
  "beans-antica-bottega": {
    subtitle: { uz: "Shirin va nafis", ru: "Сладкий и изысканный", en: "Sweet and refined" },
    blend: "Arabica + Robusta",
    body: 6,
    roast: "medium",
    notes: ["vanilla", "biscuit", "nuts"],
  },
  "beans-espresso": {
    subtitle: { uz: "To'liq tanali klassika", ru: "Полнотелая классика", en: "Full-bodied classic" },
    blend: "Arabica + Robusta",
    body: 7,
    roast: "medium",
    notes: ["yellowFruit", "cocoa", "caramel"],
  },
  "beans-granaroma": {
    subtitle: { uz: "Shokoladli va kuchli", ru: "Шоколадный и интенсивный", en: "Chocolaty and intense" },
    blend: "Arabica + Robusta",
    body: 8,
    roast: "dark",
    notes: ["chocolate", "cocoa", "spices"],
  },
  "beans-arabica": {
    subtitle: { uz: "Nozik va xushbo'y", ru: "Деликатный и ароматный", en: "Delicate and aromatic" },
    blend: "100% Arabica",
    body: 4,
    roast: "medium",
    notes: ["yellowFruit", "flowers", "vanilla"],
  },
  "ground-granaroma": {
    subtitle: { uz: "Har kungi boy ta'm", ru: "Богатый вкус на каждый день", en: "Rich everyday taste" },
    blend: "Arabica + Robusta",
    body: 7,
    roast: "dark",
    notes: ["chocolate", "cocoa", "biscuit"],
  },
  "ground-antica-bottega": {
    subtitle: { uz: "Yumshoq va mayin", ru: "Мягкий и нежный", en: "Smooth and gentle" },
    blend: "Arabica + Robusta",
    body: 5,
    roast: "medium",
    notes: ["vanilla", "nuts", "biscuit"],
  },
  "ground-espressocasa": {
    subtitle: { uz: "Uydagi haqiqiy espresso", ru: "Настоящий эспрессо дома", en: "True espresso at home" },
    blend: "Arabica + Robusta",
    body: 8,
    roast: "dark",
    notes: ["spices", "cocoa", "caramel"],
  },
  "ground-arabica-tin": {
    subtitle: { uz: "Afsonaviy bankada", ru: "В легендарной банке", en: "In the iconic tin" },
    blend: "100% Arabica",
    body: 6,
    roast: "medium",
    notes: ["yellowFruit", "caramel", "flowers"],
  },
  "caps-cremoso": {
    subtitle: { uz: "Baxmal krema", ru: "Бархатная крема", en: "Velvety crema" },
    blend: "Arabica + Robusta",
    body: 7,
    roast: "medium",
    notes: ["nuts", "cocoa", "caramel"],
  },
  "caps-intenso": {
    subtitle: { uz: "Qat'iy va to'yingan", ru: "Решительный и насыщенный", en: "Bold and decisive" },
    blend: "100% Arabica",
    body: 8,
    roast: "dark",
    notes: ["chocolate", "spices", "cocoa"],
  },
  "caps-arabica": {
    subtitle: { uz: "Muvozanat san'ati", ru: "Искусство баланса", en: "The art of balance" },
    blend: "100% Arabica",
    body: 5,
    roast: "medium",
    notes: ["yellowFruit", "vanilla", "caramel", "milkChocolate"],
  },
  "caps-decaf": {
    subtitle: { uz: "Kofeinsiz lazzat", ru: "Вкус без кофеина", en: "Flavour without caffeine" },
    blend: "Arabica + Robusta (decaf)",
    body: 5,
    roast: "medium",
    notes: ["citrus", "redFruits", "tea", "milkChocolate"],
  },
  "caps-oro-50": {
    subtitle: { uz: "Nozik va muvozanatli", ru: "Деликатный и сбалансированный", en: "Delicate and balanced" },
    blend: "Arabica + Robusta",
    body: 6,
    roast: "medium",
    notes: ["yellowFruit", "vanilla", "caramel", "milkChocolate"],
  },
  "pods-espresso-150": {
    subtitle: { uz: "Quyuq krema, kuchli aromat", ru: "Плотная крема, интенсивный аромат", en: "Dense crema, intense aroma" },
    blend: "Arabica + Robusta",
    body: 8,
    roast: "dark",
    notes: ["cocoa", "caramel", "nuts"],
  },
  "pods-oro-150": {
    subtitle: { uz: "Yumshoq va yorqin", ru: "Мягкий и выразительный", en: "Smooth and expressive" },
    blend: "Arabica + Robusta",
    body: 6,
    roast: "medium",
    notes: ["vanilla", "yellowFruit", "caramel"],
  },
  "acc-moka-nera": {
    subtitle: { uz: "Klassik italyan mokasi", ru: "Классическая итальянская мока", en: "The classic Italian moka" },
    blend: null,
    body: null,
    roast: null,
    notes: [],
  },
  "acc-tazzine-rosse": {
    subtitle: { uz: "1882 bar uslubi", ru: "Фирменный стиль бара 1882", en: "The signature 1882 bar style" },
    blend: null,
    body: null,
    roast: null,
    notes: [],
  },
};
