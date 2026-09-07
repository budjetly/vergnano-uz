import type { Locale } from "./i18n";

export type Category = "beans" | "ground" | "capsules" | "pods" | "accessories";

export interface Product {
  id: string;
  name: string;
  category: Category;
  packSize: string;
  intensity: number | null;
  // Retail price in UZS. Placeholder values — edit freely; the rest of the
  // site (cards, cart, Telegram order message) picks them up automatically.
  price: number;
  image: string;
  description: Record<Locale, string>;
}

export const products: Product[] = [
  {
    id: "beans-antica-bottega",
    name: "Antica Bottega",
    category: "beans",
    packSize: "1 kg",
    intensity: 5,
    price: 420000,
    image: "/products/beans-antica-bottega.png",
    description: {
      uz: "Shirin va nozik aralashma — yengil nordonlik, to'liq tana va mayin, uzoq davom etuvchi krema. Har bir nav an'anaviy usulda alohida sekin qovuriladi.",
      ru: "Сладкая, деликатная смесь — лёгкая кислинка, полное тело и тонкая стойкая крема. Каждый сорт обжаривается отдельно по традиционной технологии.",
      en: "A sweet, delicate blend with light acidity, full body and a fine, persistent crema. Each origin is slow-roasted separately in the traditional style.",
    },
  },
  {
    id: "beans-espresso",
    name: "Espresso",
    category: "beans",
    packSize: "1 kg",
    intensity: 7,
    price: 340000,
    image: "/products/beans-espresso.png",
    description: {
      uz: "To'liq tanali, xushbo'y espresso aralashmasi — shirin, mevali ta'm va jozibali krema. Arabica va Robusta mukammal uyg'unlikda.",
      ru: "Полнотелая ароматная эспрессо-смесь — сладкий фруктовый вкус и аппетитная крема. Арабика и робуста в идеальной гармонии.",
      en: "A full-bodied, fragrant espresso blend with a sweet, fruity taste and an inviting crema. Arabica and Robusta in perfect harmony.",
    },
  },
  {
    id: "beans-granaroma",
    name: "Granaroma",
    category: "beans",
    packSize: "1 kg",
    intensity: 8,
    price: 350000,
    image: "/products/beans-granaroma.png",
    description: {
      uz: "Shokoladli, kuchli klassik aralashma — boy va barqaror ta'm. Har kun uchun ideal tanlov.",
      ru: "Шоколадная, интенсивная классическая смесь — богатый, устойчивый вкус. Идеальный выбор на каждый день.",
      en: "A chocolate-forward, intense classic blend with a rich, persistent taste. The perfect everyday choice.",
    },
  },
  {
    id: "beans-arabica",
    name: "100% Arabica",
    category: "beans",
    packSize: "250 g",
    intensity: 4,
    price: 120000,
    image: "/products/beans-arabica.png",
    description: {
      uz: "Nozik va xushbo'y 100% Arabica — yengil tanali, ammo to'liq aromatli. Yumshoq qahvani sevuvchilar uchun.",
      ru: "Деликатная ароматная 100% арабика — лёгкое тело, но насыщенный аромат. Для тех, кто любит мягкий кофе.",
      en: "A delicate, aromatic 100% Arabica — light in body yet fragrant and full. For those who prefer a gentler cup.",
    },
  },
  {
    id: "ground-granaroma",
    name: "Granaroma Macinato",
    category: "ground",
    packSize: "250 g",
    intensity: 7,
    price: 95000,
    image: "/products/ground-granaroma.png",
    description: {
      uz: "Klassik Granaroma aralashmasi moka uchun maydalangan — boy ta'm va o'ziga xos aromat.",
      ru: "Классическая смесь Granaroma, смолотая для гейзерной кофеварки — богатый вкус и характерный аромат.",
      en: "The classic Granaroma blend ground for the moka pot — rich flavour and a distinctive aroma.",
    },
  },
  {
    id: "ground-antica-bottega",
    name: "Antica Bottega Macinato",
    category: "ground",
    packSize: "250 g",
    intensity: 4,
    price: 110000,
    image: "/products/ground-antica-bottega.png",
    description: {
      uz: "Markaziy Amerika Arabikasi va Robusta aralashmasi, moka uchun. Sekin qovurish unga yumshoq, nozik ta'm beradi.",
      ru: "Смесь центральноамериканской арабики и робусты для моки. Медленная обжарка придаёт мягкий, деликатный вкус.",
      en: "Central American Arabica blended with Robusta, ground for moka. Slow roasting gives a smooth, delicate flavour.",
    },
  },
  {
    id: "ground-espressocasa",
    name: "Espressocasa",
    category: "ground",
    packSize: "250 g",
    intensity: 8,
    price: 105000,
    image: "/products/ground-espressocasa.png",
    description: {
      uz: "Uy espresso mashinalari uchun kremali, ziravorli mayda maydalangan qahva — uyda bar sifatidagi espresso.",
      ru: "Кремовый, пряный тонкий помол для домашних эспрессо-машин — эспрессо барного качества у вас дома.",
      en: "A creamy, spiced fine grind for home espresso machines — bar-quality espresso at home.",
    },
  },
  {
    id: "ground-arabica-tin",
    name: "100% Arabica Lattina",
    category: "ground",
    packSize: "250 g tin",
    intensity: 7,
    price: 150000,
    image: "/products/ground-arabica-tin.png",
    description: {
      uz: "Mashhur Vergnano bankasidagi premium Arabica, espresso uchun maydalangan. Muvozanatli, mevali va yumaloq aromat.",
      ru: "Премиальная арабика в легендарной банке Vergnano, помол для эспрессо. Сбалансированный, фруктовый, округлый вкус.",
      en: "Premium Arabica in the iconic Vergnano tin, ground for espresso. Balanced and fruity with a rounded aroma.",
    },
  },
  {
    id: "caps-cremoso",
    name: "Cremoso",
    category: "capsules",
    packSize: "30 capsules · Nespresso®*",
    intensity: 6,
    price: 195000,
    image: "/products/caps-cremoso.png",
    description: {
      uz: "Yong'oq va kakao notalari bilan mayin, barqaror aralashma — boy, baxmal espresso. Kompostlanadigan kapsulalar.",
      ru: "Мягкая, стойкая смесь с ореховыми и какао-нотами — насыщенный бархатный эспрессо. Компостируемые капсулы.",
      en: "A soft, persistent blend with nutty aromas and cocoa notes — a rich, velvety espresso. Compostable capsules.",
    },
  },
  {
    id: "caps-intenso",
    name: "Intenso Èspresso 1882",
    category: "capsules",
    packSize: "30 capsules · Nespresso®*",
    intensity: 8,
    price: 195000,
    image: "/products/caps-intenso.png",
    description: {
      uz: "Qat'iy va to'liq tanali — shokolad va ziravor notalari Amerika Arabikasi bilan yumshatilgan. Kompostlanadigan kapsulalar.",
      ru: "Решительный и полнотелый — шоколадные и пряные ноты, смягчённые американской арабикой. Компостируемые капсулы.",
      en: "Decisive and full-bodied, with chocolatey, spicy notes softened by smooth American Arabica. Compostable capsules.",
    },
  },
  {
    id: "caps-arabica",
    name: "100% Arabica Capsule",
    category: "capsules",
    packSize: "30 capsules · Nespresso®*",
    intensity: 4,
    price: 195000,
    image: "/products/caps-arabica.png",
    description: {
      uz: "Nozik va muvozanatli — sariq meva, vanil, karamel va sut shokoladi notalari. Kompostlanadigan kapsulalar.",
      ru: "Деликатный и сбалансированный — ноты жёлтых фруктов, ванили, карамели и молочного шоколада. Компостируемые капсулы.",
      en: "Delicate and balanced — notes of yellow fruit, vanilla, caramel and milk chocolate. Compostable capsules.",
    },
  },
  {
    id: "caps-decaf",
    name: "Decaffeinato",
    category: "capsules",
    packSize: "30 capsules · Nespresso®*",
    intensity: 5,
    price: 195000,
    image: "/products/caps-decaf.png",
    description: {
      uz: "Nafis kofeinsiz qahva — sitrus, qizil meva, choy va sut shokoladi notalari. Kompostlanadigan kapsulalar.",
      ru: "Элегантный декаф — ноты цитрусов, красных ягод, чая и молочного шоколада. Компостируемые капсулы.",
      en: "An elegant decaf with bright notes of citrus, red fruits, tea and milk chocolate. Compostable capsules.",
    },
  },
  {
    id: "caps-oro-50",
    name: "Oro",
    category: "capsules",
    packSize: "50 capsules · Nespresso®*",
    intensity: 4,
    price: 280000,
    image: "/products/caps-oro-50.png",
    description: {
      uz: "Nozik, muvozanatli aralashma — meva va vanil notalari, karamel shirinligi. Tejamkor 50 talik quti.",
      ru: "Деликатная сбалансированная смесь — фруктово-ванильные ноты со сладостью карамели. Выгодная упаковка из 50 капсул.",
      en: "A delicate, balanced blend with fruit and vanilla notes plus caramel sweetness. Value 50-pack.",
    },
  },
  {
    id: "pods-espresso-150",
    name: "Espresso Cialde",
    category: "pods",
    packSize: "150 ESE pods",
    intensity: 7,
    price: 590000,
    image: "/products/pods-espresso-150.png",
    description: {
      uz: "Boy va kremali ESE qog'oz chaldalar — to'liq ta'm, kuchli aromat va quyuq krema. Kompostlanadigan.",
      ru: "Насыщенные кремовые чалды ESE — полный вкус, интенсивный аромат и плотная крема. Компостируемые.",
      en: "Rich, creamy ESE paper pods — full-bodied taste, intense aroma and a dense crema. Compostable.",
    },
  },
  {
    id: "pods-oro-150",
    name: "Oro Cialde",
    category: "pods",
    packSize: "150 ESE pods",
    intensity: 5,
    price: 590000,
    image: "/products/pods-oro-150.png",
    description: {
      uz: "Nozik va muvozanatli ESE chaldalar — yumshoq, to'liq ta'm va yorqin aromat. Kompostlanadigan.",
      ru: "Деликатные сбалансированные чалды ESE — мягкий полный вкус и выраженный аромат. Компостируемые.",
      en: "Delicate, balanced ESE pods with a smooth, full taste and pronounced fragrance. Compostable.",
    },
  },
  {
    id: "acc-moka-nera",
    name: "Moka Nera",
    category: "accessories",
    packSize: "3 cups",
    intensity: null,
    price: 450000,
    image: "/products/acc-moka-nera.png",
    description: {
      uz: "Vergnano brendidagi matoviy qora moka — uyda qahva tayyorlashning klassik italyan usuli.",
      ru: "Гейзерная кофеварка Vergnano в матовом чёрном цвете — классический итальянский способ варить кофе дома.",
      en: "A Vergnano-branded matte black stovetop moka pot — the classic Italian way to brew at home.",
    },
  },
  {
    id: "acc-tazzine-rosse",
    name: "Set da 6 Tazzine Rosse",
    category: "accessories",
    packSize: "6 cups + saucers",
    intensity: null,
    price: 650000,
    image: "/products/acc-tazzine-rosse.png",
    description: {
      uz: "Olti dona qizil Caffè Vergnano espresso finjonlari — uyingizda haqiqiy 1882 bar uslubi.",
      ru: "Набор из шести красных эспрессо-чашек Caffè Vergnano — фирменный стиль бара 1882 у вас дома.",
      en: "Set of six red Caffè Vergnano espresso cups with saucers — the signature 1882 bar look at home.",
    },
  },
];

export const categories: Category[] = [
  "beans",
  "ground",
  "capsules",
  "pods",
  "accessories",
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price);
}
