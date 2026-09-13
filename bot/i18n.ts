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
  // in-bot catalog
  menuCatalog: string;
  menuCart: string;
  menuContact: string;
  chooseCategory: string;
  categoryTitle: (name: string, count: number) => string;
  emptyCategory: string;
  intensity: string;
  format: string;
  qty: string;
  addToCart: string;
  addedToast: (name: string) => string;
  viewCart: string;
  continueShopping: string;
  back: string;
  prev: string;
  next: string;
  cartTitle: string;
  cartEmpty: string;
  cartLine: (name: string, qty: number, sum: string) => string;
  checkout: string;
  clearCart: string;
  cartCleared: string;
  askName: string;
  askPhone: string;
  sharePhone: string;
  invalidPhone: string;
  orderCreated: string;
  contactText: (phone: string, telegram: string) => string;
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
    `Buyurtma raqami: <b>${orderId}</b>\nTo'lov summasi: <b>${total} so'm</b>`,
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
  menuCatalog: "🛍 Katalog",
  menuCart: "🛒 Savat",
  menuContact: "☎️ Aloqa",
  chooseCategory: "🛍 <b>Katalog</b>\n\nToifani tanlang:",
  categoryTitle: (name, count) => `<b>${name}</b> · ${count} ta mahsulot\n\nMahsulotni tanlang:`,
  emptyCategory: "Bu toifada hozircha mahsulot yo'q.",
  intensity: "Intensivlik",
  format: "Format",
  qty: "Miqdor",
  addToCart: "🛒 Savatga qo'shish",
  addedToast: (name) => `✅ ${name} savatga qo'shildi`,
  viewCart: "🛒 Savatni ko'rish",
  continueShopping: "🛍 Xaridni davom ettirish",
  back: "⬅️ Orqaga",
  prev: "◀️",
  next: "▶️",
  cartTitle: "🛒 <b>Savatingiz</b>",
  cartEmpty: "Savatingiz bo'sh. Katalogdan mahsulot tanlang 🛍",
  cartLine: (name, qty, sum) => `• ${name} × ${qty} — ${sum} so'm`,
  checkout: "✅ Buyurtma berish",
  clearCart: "🗑 Tozalash",
  cartCleared: "Savat tozalandi.",
  askName: "Buyurtmani rasmiylashtiramiz.\n\n👤 <b>Ismingizni yozing:</b>",
  askPhone: "📞 <b>Telefon raqamingizni yozing</b> yoki quyidagi tugma orqali ulashing:",
  sharePhone: "📱 Raqamni ulashish",
  invalidPhone: "Raqam noto'g'ri. Namuna: <code>+998 99 123 45 67</code>",
  orderCreated: "Rahmat! Buyurtmangiz shakllantirildi 👇",
  contactText: (phone, telegram) => `☎️ <b>Aloqa</b>\n\nTelefon: <a href="tel:${phone.replace(/\s/g, "")}">${phone}</a>\nTelegram: @${telegram}\n\nDushanba – Shanba, 9:00 – 18:00`,
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
    `Номер заказа: <b>${orderId}</b>\nСумма к оплате: <b>${total} сум</b>`,
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
  menuCatalog: "🛍 Каталог",
  menuCart: "🛒 Корзина",
  menuContact: "☎️ Контакты",
  chooseCategory: "🛍 <b>Каталог</b>\n\nВыберите категорию:",
  categoryTitle: (name, count) => `<b>${name}</b> · ${count} товаров\n\nВыберите товар:`,
  emptyCategory: "В этой категории пока нет товаров.",
  intensity: "Интенсивность",
  format: "Формат",
  qty: "Количество",
  addToCart: "🛒 В корзину",
  addedToast: (name) => `✅ ${name} добавлен в корзину`,
  viewCart: "🛒 Открыть корзину",
  continueShopping: "🛍 Продолжить покупки",
  back: "⬅️ Назад",
  prev: "◀️",
  next: "▶️",
  cartTitle: "🛒 <b>Ваша корзина</b>",
  cartEmpty: "Корзина пуста. Выберите товары в каталоге 🛍",
  cartLine: (name, qty, sum) => `• ${name} × ${qty} — ${sum} сум`,
  checkout: "✅ Оформить заказ",
  clearCart: "🗑 Очистить",
  cartCleared: "Корзина очищена.",
  askName: "Оформляем заказ.\n\n👤 <b>Напишите ваше имя:</b>",
  askPhone: "📞 <b>Напишите номер телефона</b> или поделитесь им кнопкой ниже:",
  sharePhone: "📱 Поделиться номером",
  invalidPhone: "Неверный номер. Пример: <code>+998 99 123 45 67</code>",
  orderCreated: "Спасибо! Ваш заказ сформирован 👇",
  contactText: (phone, telegram) => `☎️ <b>Контакты</b>\n\nТелефон: <a href="tel:${phone.replace(/\s/g, "")}">${phone}</a>\nTelegram: @${telegram}\n\nПонедельник – Суббота, 9:00 – 18:00`,
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
    `Order number: <b>${orderId}</b>\nAmount due: <b>${total} UZS</b>`,
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
  menuCatalog: "🛍 Catalog",
  menuCart: "🛒 Cart",
  menuContact: "☎️ Contact",
  chooseCategory: "🛍 <b>Catalog</b>\n\nChoose a category:",
  categoryTitle: (name, count) => `<b>${name}</b> · ${count} products\n\nPick a product:`,
  emptyCategory: "No products in this category yet.",
  intensity: "Intensity",
  format: "Format",
  qty: "Quantity",
  addToCart: "🛒 Add to cart",
  addedToast: (name) => `✅ ${name} added to cart`,
  viewCart: "🛒 View cart",
  continueShopping: "🛍 Continue shopping",
  back: "⬅️ Back",
  prev: "◀️",
  next: "▶️",
  cartTitle: "🛒 <b>Your cart</b>",
  cartEmpty: "Your cart is empty. Pick something from the catalog 🛍",
  cartLine: (name, qty, sum) => `• ${name} × ${qty} — ${sum} UZS`,
  checkout: "✅ Place order",
  clearCart: "🗑 Clear",
  cartCleared: "Cart cleared.",
  askName: "Let's complete your order.\n\n👤 <b>Please type your name:</b>",
  askPhone: "📞 <b>Type your phone number</b> or share it with the button below:",
  sharePhone: "📱 Share my number",
  invalidPhone: "That number doesn't look right. Example: <code>+998 99 123 45 67</code>",
  orderCreated: "Thank you! Your order is ready 👇",
  contactText: (phone, telegram) => `☎️ <b>Contact</b>\n\nPhone: <a href="tel:${phone.replace(/\s/g, "")}">${phone}</a>\nTelegram: @${telegram}\n\nMonday – Saturday, 9:00 – 18:00`,
};

export const botDicts: Record<BotLocale, BotDict> = { uz, ru, en };
