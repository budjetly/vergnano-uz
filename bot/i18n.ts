export type BotLocale = "uz" | "ru" | "en";

export const botLocales: BotLocale[] = ["uz", "ru", "en"];

export function asBotLocale(value: string | null | undefined): BotLocale {
  return value === "ru" || value === "en" ? value : "uz";
}

interface BotDict {
  chooseLang: string;
  welcome: string; // /start without an order
  websiteBtn: string;
  orderTitle: string;
  itemLine: (name: string, packSize: string, qty: number, sum: string) => string;
  total: (sum: string) => string;
  confirmBtn: string;
  cancelBtn: string;
  cancelled: string;
  payTitle: string;
  payInstructions: (orderId: string, total: string) => string;
  cardLine: (label: string, number: string, holder: string) => string;
  afterPay: string;
  screenshotReceived: (orderId: string) => string;
  confirmed: (orderId: string) => string;
  rejected: (orderId: string) => string;
  unknownOrder: string;
  noActiveOrder: string;
  notAPhoto: string;
  alreadyDone: string;
  langSaved: string;
}

const uz: BotDict = {
  chooseLang: "Tilni tanlang · Выберите язык · Choose a language",
  welcome:
    "Assalomu alaykum! ☕️\n\nBu — <b>Caffè Vergnano Uz</b> rasmiy buyurtma boti.\nMahsulotlarni saytimizdan tanlang, to'lov shu yerda amalga oshiriladi.",
  websiteBtn: "🛍 Katalogni ochish",
  orderTitle: "🛒 <b>Sizning buyurtmangiz</b>",
  itemLine: (name, packSize, qty, sum) => `• ${name} (${packSize}) × ${qty} — ${sum} so'm`,
  total: (sum) => `💰 <b>Jami: ${sum} so'm</b>`,
  confirmBtn: "✅ Buyurtmani tasdiqlash",
  cancelBtn: "❌ Bekor qilish",
  cancelled: "Buyurtma bekor qilindi. Yana kutamiz! ☕️",
  payTitle: "💳 <b>To'lov ma'lumotlari</b>",
  payInstructions: (orderId, total) =>
    `Buyurtma raqami: <b>${orderId}</b>\nTo'lov summasi: <b>${total} so'm</b>\n\nQuyidagi kartaga <b>Payme</b> yoki <b>Click</b> orqali o'tkazma qiling:`,
  cardLine: (label, number, holder) => `<b>${label}</b>\n<code>${number}</code>\n${holder}`,
  afterPay:
    "✅ To'lovni amalga oshirgach, <b>to'lov chekini (skrinshot)</b> shu yerga yuboring — buyurtmangiz shundan so'ng qabul qilinadi.\n\n💡 Karta raqamiga bosib nusxalash mumkin.",
  screenshotReceived: (orderId) =>
    `📸 Rahmat! <b>${orderId}</b> buyurtmangiz uchun to'lov cheki qabul qilindi.\n\nOperatorlarimiz to'lovni tekshirib, tez orada tasdiqlaydi. Xabar shu yerga keladi.`,
  confirmed: (orderId) =>
    `🎉 <b>${orderId}</b> buyurtmangiz tasdiqlandi!\n\nTez orada siz bilan yetkazib berish bo'yicha bog'lanamiz. Xaridingiz uchun rahmat! ☕️`,
  rejected: (orderId) =>
    `⚠️ Afsuski, <b>${orderId}</b> buyurtmangiz bo'yicha to'lovni tasdiqlay olmadik.\n\nIltimos, to'lov chekini qayta yuboring yoki biz bilan bog'laning.`,
  unknownOrder:
    "Kechirasiz, bu buyurtma topilmadi yoki eskirgan. Iltimos, saytdan qaytadan buyurtma bering.",
  noActiveOrder:
    "Sizda faol buyurtma yo'q. Saytimizdan mahsulot tanlab, buyurtma bering. 🛍",
  notAPhoto:
    "Iltimos, to'lov chekini <b>rasm (skrinshot)</b> ko'rinishida yuboring.",
  alreadyDone: "Bu buyurtma allaqachon ko'rib chiqilgan.",
  langSaved: "Til saqlandi: O'zbekcha ✅",
};

const ru: BotDict = {
  chooseLang: "Tilni tanlang · Выберите язык · Choose a language",
  welcome:
    "Здравствуйте! ☕️\n\nЭто официальный бот заказов <b>Caffè Vergnano Uz</b>.\nВыберите продукцию на нашем сайте — оплата проходит здесь.",
  websiteBtn: "🛍 Открыть каталог",
  orderTitle: "🛒 <b>Ваш заказ</b>",
  itemLine: (name, packSize, qty, sum) => `• ${name} (${packSize}) × ${qty} — ${sum} сум`,
  total: (sum) => `💰 <b>Итого: ${sum} сум</b>`,
  confirmBtn: "✅ Подтвердить заказ",
  cancelBtn: "❌ Отменить",
  cancelled: "Заказ отменён. Будем ждать вас снова! ☕️",
  payTitle: "💳 <b>Реквизиты для оплаты</b>",
  payInstructions: (orderId, total) =>
    `Номер заказа: <b>${orderId}</b>\nСумма к оплате: <b>${total} сум</b>\n\nПереведите сумму на карту через <b>Payme</b> или <b>Click</b>:`,
  cardLine: (label, number, holder) => `<b>${label}</b>\n<code>${number}</code>\n${holder}`,
  afterPay:
    "✅ После оплаты отправьте сюда <b>скриншот чека</b> — заказ будет принят после этого.\n\n💡 Нажмите на номер карты, чтобы скопировать.",
  screenshotReceived: (orderId) =>
    `📸 Спасибо! Чек по заказу <b>${orderId}</b> получен.\n\nНаши операторы проверят оплату и подтвердят заказ в ближайшее время. Сообщение придёт сюда.`,
  confirmed: (orderId) =>
    `🎉 Ваш заказ <b>${orderId}</b> подтверждён!\n\nМы скоро свяжемся с вами по доставке. Спасибо за покупку! ☕️`,
  rejected: (orderId) =>
    `⚠️ К сожалению, мы не смогли подтвердить оплату по заказу <b>${orderId}</b>.\n\nПожалуйста, отправьте чек ещё раз или свяжитесь с нами.`,
  unknownOrder:
    "Извините, этот заказ не найден или устарел. Пожалуйста, оформите заказ на сайте заново.",
  noActiveOrder:
    "У вас нет активного заказа. Выберите продукцию на нашем сайте. 🛍",
  notAPhoto: "Пожалуйста, отправьте чек об оплате в виде <b>изображения (скриншота)</b>.",
  alreadyDone: "Этот заказ уже обработан.",
  langSaved: "Язык сохранён: Русский ✅",
};

const en: BotDict = {
  chooseLang: "Tilni tanlang · Выберите язык · Choose a language",
  welcome:
    "Hello! ☕️\n\nThis is the official <b>Caffè Vergnano Uz</b> ordering bot.\nPick your products on our website — payment happens right here.",
  websiteBtn: "🛍 Open the catalog",
  orderTitle: "🛒 <b>Your order</b>",
  itemLine: (name, packSize, qty, sum) => `• ${name} (${packSize}) × ${qty} — ${sum} UZS`,
  total: (sum) => `💰 <b>Total: ${sum} UZS</b>`,
  confirmBtn: "✅ Confirm order",
  cancelBtn: "❌ Cancel",
  cancelled: "Order cancelled. Hope to see you again! ☕️",
  payTitle: "💳 <b>Payment details</b>",
  payInstructions: (orderId, total) =>
    `Order number: <b>${orderId}</b>\nAmount due: <b>${total} UZS</b>\n\nTransfer the amount to this card via <b>Payme</b> or <b>Click</b>:`,
  cardLine: (label, number, holder) => `<b>${label}</b>\n<code>${number}</code>\n${holder}`,
  afterPay:
    "✅ After paying, send the <b>payment confirmation screenshot</b> here — your order is secured once we receive it.\n\n💡 Tap the card number to copy it.",
  screenshotReceived: (orderId) =>
    `📸 Thank you! We received the payment confirmation for order <b>${orderId}</b>.\n\nOur team will verify it and confirm your order shortly. You'll get a message here.`,
  confirmed: (orderId) =>
    `🎉 Your order <b>${orderId}</b> is confirmed!\n\nWe'll contact you about delivery soon. Thank you for your purchase! ☕️`,
  rejected: (orderId) =>
    `⚠️ Unfortunately we couldn't verify the payment for order <b>${orderId}</b>.\n\nPlease resend the confirmation or contact us.`,
  unknownOrder:
    "Sorry, this order was not found or has expired. Please place it again on the website.",
  noActiveOrder: "You have no active order. Pick your products on our website. 🛍",
  notAPhoto: "Please send the payment confirmation as an <b>image (screenshot)</b>.",
  alreadyDone: "This order has already been processed.",
  langSaved: "Language saved: English ✅",
};

export const botDicts: Record<BotLocale, BotDict> = { uz, ru, en };
