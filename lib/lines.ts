import type { Locale } from "./i18n";
import type { Collection } from "./products";

type L = Record<Locale, string>;

export interface LineContent {
  tagline: L; // big serif line under the hero
  intro: L[]; // paragraphs
  heroVideo?: string; // autoplaying loop behind the title
  heroPoster?: string;
  fullVideo?: string; // "Watch the full video" section
  formats?: { image: string; label: L; anchor: string }[]; // Beans / Capsules cards
  accents?: Record<string, string>; // product id -> title colour
}

export const lineContent: Partial<Record<Collection, LineContent>> = {
  "riserva-torino": {
    tagline: {
      uz: "Olijanob. Haqiqiy. Favqulodda.",
      ru: "Благородный. Подлинный. Исключительный.",
      en: "Noble. Authentic. Extraordinary.",
    },
    intro: [
      {
        uz: "Bu liniya — butun dunyoda italyan qahva mukammalligining ramzi bo'lgan Turin shahriga bag'ishlangan.",
        ru: "Эта линия — дань уважения Турину, символу итальянского кофейного совершенства во всём мире.",
        en: "This range is a tribute to the city of Torino, symbol of Italian coffee excellence around the world.",
      },
      {
        uz: "Faqat eng yaxshi qahva navlari sinchkovlik bilan tanlab olinadi va butun aromatik boyligi, o'ziga xos xarakteri va nozik muvozanati ochilishi uchun sekin qovuriladi.",
        ru: "Только лучшие сорта кофе тщательно отбираются и медленно обжариваются, чтобы раскрыть всё ароматическое богатство, характер и утончённый баланс.",
        en: "Only the finest coffee origins are carefully selected and slow-roasted to reveal their full aromatic richness, distinctive character and refined balance.",
      },
      {
        uz: "Yangi maydalangan qahvani sevuvchilar uchun donali, sifat va qulaylikni qadrlaydiganlar uchun esa Nespresso®* uchun mos kapsulalarda.",
        ru: "В зёрнах — для тех, кто любит свежемолотый кофе, и в капсулах, совместимых с Nespresso®*, — для тех, кто ценит качество и удобство.",
        en: "Available as beans for those who love freshly ground coffee, and as Nespresso®*-compatible capsules for those looking for quality and convenience.",
      },
    ],
    heroVideo: "/videos/riserva-hero.mp4",
    heroPoster: "/images/riserva/riserva-torino-hero.jpg",
    fullVideo: "/videos/riserva-full.mp4",
    formats: [
      { image: "/images/riserva/riserva-torino-grani.jpg", label: { uz: "Donali qahva", ru: "Кофе в зёрнах", en: "Beans" }, anchor: "beans" },
      { image: "/images/riserva/capsules.png", label: { uz: "Kapsulalar", ru: "Капсулы", en: "Capsules" }, anchor: "capsules" },
    ],
    accents: {
      "rt-nobile": "#2f6b3f",
      "rt-arabica": "#c9a227",
      "rt-cremoso": "#c0392b",
      "rt-caps-nobile": "#2f6b3f",
      "rt-caps-arabica": "#c9a227",
      "rt-caps-cremoso": "#c0392b",
    },
  },
  "1882-line": {
    tagline: { uz: "Bar uchun yaratilgan", ru: "Создано для бара", en: "Made for the bar" },
    intro: [{
      uz: "1882 Line — Caffè Vergnano'ning eng nufuzli professional aralashmalari, 2,5 kg idishlarda. Kafe va restoranlar uchun barqaror, boy espresso.",
      ru: "1882 Line — самые престижные профессиональные смеси Caffè Vergnano в банках по 2,5 кг. Стабильный, насыщенный эспрессо для кафе и ресторанов.",
      en: "The 1882 Line is Caffè Vergnano's most prestigious professional range, in 2.5 kg jars. A consistent, rich espresso for cafés and restaurants.",
    }],
  },
  "classic-line": {
    tagline: { uz: "Har bir bar uchun aralashma", ru: "Смесь для каждого бара", en: "A blend for every bar" },
    intro: [{
      uz: "Classic Line — 1 kg qadoqdagi olti klassik espresso aralashmasi, 1000 Mille'dan 500 Cinquecento'gacha: har bir ta'm va intensivlik uchun.",
      ru: "Classic Line — шесть классических эспрессо-смесей по 1 кг, от 1000 Mille до 500 Cinquecento: для любого вкуса и интенсивности.",
      en: "The Classic Line is six classic espresso blends in 1 kg bags, from 1000 Mille to 500 Cinquecento — one for every taste and intensity.",
    }],
  },
  "caffe-in-grani": {
    tagline: { uz: "Yangi maydalangan lazzat", ru: "Вкус свежего помола", en: "The taste of freshly ground" },
    intro: [{
      uz: "Uy va ofis uchun donali qahva: Antica Bottega, Espresso, Granaroma va 100% Arabica — Italiyada sekin qovurilgan.",
      ru: "Кофе в зёрнах для дома и офиса: Antica Bottega, Espresso, Granaroma и 100% Arabica — медленной итальянской обжарки.",
      en: "Whole bean coffee for home and office: Antica Bottega, Espresso, Granaroma and 100% Arabica — slow-roasted in Italy.",
    }],
  },
  "single-origin": {
    tagline: { uz: "Bir joy, bir ta'm", ru: "Одно происхождение, один вкус", en: "One origin, one taste" },
    intro: [{
      uz: "Braziliya, Kolumbiya va Gonduras — har biri o'z hududining o'ziga xos xarakterini ochib beruvchi 100% Arabica.",
      ru: "Бразилия, Колумбия и Гондурас — 100% арабика, раскрывающая уникальный характер каждого региона.",
      en: "Brazil, Colombia and Honduras — 100% Arabica, each revealing the distinctive character of its region.",
    }],
  },
  "pink-collection": {
    tagline: { uz: "Women in Coffee", ru: "Women in Coffee", en: "Women in Coffee" },
    intro: [{
      uz: "Pink Collection — qahva plantatsiyalaridagi ayollarni qo'llab-quvvatlovchi Women in Coffee loyihasi mahsulotlari.",
      ru: "Pink Collection — продукция проекта Women in Coffee, поддерживающего женщин на кофейных плантациях.",
      en: "The Pink Collection supports the Women in Coffee project, empowering women on coffee plantations.",
    }],
  },
  "caffe-macinato": {
    tagline: { uz: "Moka uchun mukammal", ru: "Идеально для моки", en: "Perfect for the moka" },
    intro: [{
      uz: "Moka va uy espresso mashinalari uchun maydalangan qahva — afsonaviy bankalarda va vakuum qadoqlarda.",
      ru: "Молотый кофе для моки и домашних эспрессо-машин — в легендарных банках и вакуумных упаковках.",
      en: "Ground coffee for moka pots and home espresso machines — in the iconic tins and vacuum packs.",
    }],
  },
};
