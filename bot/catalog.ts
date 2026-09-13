import { InlineKeyboard, Keyboard, type Bot, type Context } from "grammy";
import { products, collections, type Collection, type Product } from "@/lib/products";
import { productDetails } from "@/lib/product-details";
import { getDictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { formatPhone, isValidPhone } from "@/lib/phone";
import {
  getBotCart,
  setBotCart,
  getChatState,
  setChatState,
  getChatLocale,
  saveOrder,
  setActiveOrder,
  generateOrderId,
  type Order,
  type BotCartItem,
} from "@/lib/orders";
import { botDicts, asBotLocale, type BotLocale } from "./i18n";
import { fmt, esc, imageSource, mainMenu, sendOrderSummary, notifyAdminNewOrder, ADMIN_CHAT_ID } from "./shared";

const PAGE = 8;
type Cat = Collection | "all";

const isCat = (v: string): v is Cat => v === "all" || (collections as string[]).includes(v);
const inCat = (cat: Cat) => (cat === "all" ? products : products.filter((p) => p.collection === cat));

async function localeOf(ctx: Context): Promise<BotLocale> {
  return asBotLocale(ctx.chat ? await getChatLocale(ctx.chat.id) : null);
}

// ---- keyboards --------------------------------------------------------------

function categoryKeyboard(locale: BotLocale) {
  const names = getDictionary(locale).products.collections;
  const kb = new InlineKeyboard();
  collections.forEach((c, i) => {
    kb.text(names[c], `cat:${c}`);
    if (i % 2 === 1) kb.row();
  });
  if (collections.length % 2 === 1) kb.row();
  kb.text(`📦 ${names.all}`, "cat:all");
  return kb;
}

function productListKeyboard(cat: Cat, page: number, locale: BotLocale) {
  const t = botDicts[locale];
  const dict = getDictionary(locale);
  const list = inCat(cat);
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const p = Math.min(Math.max(0, page), pages - 1);
  const kb = new InlineKeyboard();
  for (const prod of list.slice(p * PAGE, (p + 1) * PAGE)) {
    kb.text(`${prod.name} · ${fmt(prod.price)} ${dict.currency}`, `p:${prod.id}:${cat}:${p}`).row();
  }
  if (pages > 1) {
    kb.text(p > 0 ? t.prev : " ", p > 0 ? `pg:${cat}:${p - 1}` : "noop")
      .text(`${p + 1} / ${pages}`, "noop")
      .text(p < pages - 1 ? t.next : " ", p < pages - 1 ? `pg:${cat}:${p + 1}` : "noop")
      .row();
  }
  kb.text(t.back, "catalog");
  return { kb, list, page: p };
}

function productKeyboard(prod: Product, qty: number, cat: Cat, page: number, locale: BotLocale) {
  const t = botDicts[locale];
  return new InlineKeyboard()
    .text("−", `q:${prod.id}:${Math.max(1, qty - 1)}:${cat}:${page}`)
    .text(`${qty}`, "noop")
    .text("+", `q:${prod.id}:${Math.min(99, qty + 1)}:${cat}:${page}`)
    .row()
    .text(t.addToCart, `add:${prod.id}:${qty}:${cat}:${page}`)
    .row()
    .text(t.back, `pg:${cat}:${page}`)
    .text(t.viewCart, "cart");
}

function productCaption(prod: Product, locale: BotLocale) {
  const t = botDicts[locale];
  const dict = getDictionary(locale);
  const d = productDetails[prod.id];
  const lines = [`<b>${esc(prod.name)}</b>`];
  if (prod.collection) lines.push(`<i>${esc(dict.products.collections[prod.collection])}</i>`);
  lines.push("", esc(prod.description[locale]), "");
  if (d && d.notes.length) lines.push(`🍫 ${d.notes.map((n) => dict.products.detail.notes[n]).join(" · ")}`);
  if (prod.intensity !== null) lines.push(`🔥 ${t.intensity}: ${prod.intensity}/10`);
  lines.push(`📦 ${t.format}: ${esc(prod.packSize)}`, "", `💰 <b>${fmt(prod.price)} ${dict.currency}</b>`);
  return lines.join("\n");
}

// ---- views ------------------------------------------------------------------

async function showCategories(ctx: Context, edit = false) {
  const locale = await localeOf(ctx);
  const t = botDicts[locale];
  const opts = { parse_mode: "HTML" as const, reply_markup: categoryKeyboard(locale) };
  if (edit) {
    try {
      await ctx.editMessageText(t.chooseCategory, opts);
      return;
    } catch {
      /* original was a photo — fall through to a new message */
    }
  }
  await ctx.reply(t.chooseCategory, opts);
}

async function showProductList(ctx: Context, cat: Cat, page: number, edit = false) {
  const locale = await localeOf(ctx);
  const t = botDicts[locale];
  const names = getDictionary(locale).products.collections;
  const { kb, list, page: p } = productListKeyboard(cat, page, locale);
  const text = list.length ? t.categoryTitle(esc(names[cat]), list.length) : t.emptyCategory;
  const opts = { parse_mode: "HTML" as const, reply_markup: kb };
  if (edit) {
    try {
      await ctx.editMessageText(text, opts);
      return;
    } catch {
      /* fall through */
    }
  }
  void p;
  await ctx.reply(text, opts);
}

async function showProduct(ctx: Context, prod: Product, qty: number, cat: Cat, page: number) {
  const locale = await localeOf(ctx);
  try {
    await ctx.replyWithPhoto(imageSource(prod.image), {
      caption: productCaption(prod, locale),
      parse_mode: "HTML",
      reply_markup: productKeyboard(prod, qty, cat, page, locale),
    });
  } catch (err) {
    console.error("[bot] product photo failed:", err);
    await ctx.reply(productCaption(prod, locale), {
      parse_mode: "HTML",
      reply_markup: productKeyboard(prod, qty, cat, page, locale),
    });
  }
}

function cartLines(items: BotCartItem[], locale: BotLocale) {
  const t = botDicts[locale];
  const rows: string[] = [];
  let total = 0;
  for (const it of items) {
    const p = products.find((x) => x.id === it.productId);
    if (!p) continue;
    total += p.price * it.qty;
    rows.push(t.cartLine(esc(p.name), it.qty, fmt(p.price * it.qty)));
  }
  return { rows, total };
}

async function showCart(ctx: Context, edit = false) {
  const chatId = ctx.chat!.id;
  const locale = await localeOf(ctx);
  const t = botDicts[locale];
  const items = await getBotCart(chatId);
  const { rows, total } = cartLines(items, locale);
  let text: string;
  let kb: InlineKeyboard;
  if (rows.length === 0) {
    text = t.cartEmpty;
    kb = new InlineKeyboard().text(t.menuCatalog, "catalog");
  } else {
    text = [t.cartTitle, "", ...rows, "", t.total(fmt(total))].join("\n");
    kb = new InlineKeyboard();
    for (const it of items) {
      const p = products.find((x) => x.id === it.productId);
      if (!p) continue;
      kb.text("−", `cq:${p.id}:${it.qty - 1}`).text(`${p.name.slice(0, 22)} × ${it.qty}`, "noop").text("+", `cq:${p.id}:${it.qty + 1}`).row();
    }
    kb.text(t.checkout, "checkout").row().text(t.continueShopping, "catalog").text(t.clearCart, "clearcart");
  }
  const opts = { parse_mode: "HTML" as const, reply_markup: kb };
  if (edit) {
    try {
      await ctx.editMessageText(text, opts);
      return;
    } catch {
      /* fall through */
    }
  }
  await ctx.reply(text, opts);
}

// ---- checkout ---------------------------------------------------------------

async function createOrderFromCart(ctx: Context, bot: Bot, name: string, phone: string) {
  const chatId = ctx.chat!.id;
  const locale = await localeOf(ctx);
  const t = botDicts[locale];
  const cart = await getBotCart(chatId);
  const items = cart
    .map((it) => {
      const p = products.find((x) => x.id === it.productId);
      return p ? { id: p.id, name: p.name, packSize: p.packSize, qty: it.qty, price: p.price, image: p.image } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  if (items.length === 0) {
    await setChatState(chatId, null);
    await ctx.reply(t.cartEmpty, { reply_markup: mainMenu(locale) });
    return;
  }
  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: "awaiting_confirmation",
    locale,
    name,
    phone,
    items,
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    customerChatId: chatId,
  };
  await saveOrder(order);
  await setActiveOrder(chatId, order.id);
  await setBotCart(chatId, []);
  await setChatState(chatId, null);
  await notifyAdminNewOrder(bot.api, order, "bot");
  await ctx.reply(t.orderCreated, { reply_markup: mainMenu(locale) });
  await sendOrderSummary(ctx, order, locale);
}

// ---- registration -----------------------------------------------------------

export function registerCatalog(bot: Bot) {
  const notAdmin = (ctx: Context) => ctx.chat?.id !== ADMIN_CHAT_ID;

  bot.command("catalog", (ctx) => showCategories(ctx));
  bot.command("cart", (ctx) => showCart(ctx));

  bot.callbackQuery("noop", (ctx) => ctx.answerCallbackQuery());
  bot.callbackQuery("catalog", async (ctx) => {
    await ctx.answerCallbackQuery();
    await showCategories(ctx, true);
  });
  bot.callbackQuery("cart", async (ctx) => {
    await ctx.answerCallbackQuery();
    await showCart(ctx, true);
  });

  bot.callbackQuery(/^cat:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const cat = ctx.match[1];
    if (isCat(cat)) await showProductList(ctx, cat, 0, true);
  });
  bot.callbackQuery(/^pg:([^:]+):(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const cat = ctx.match[1];
    if (isCat(cat)) await showProductList(ctx, cat, Number(ctx.match[2]), true);
  });

  bot.callbackQuery(/^p:([^:]+):([^:]+):(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const prod = products.find((p) => p.id === ctx.match[1]);
    const cat = ctx.match[2];
    if (prod && isCat(cat)) await showProduct(ctx, prod, 1, cat, Number(ctx.match[3]));
  });

  bot.callbackQuery(/^q:([^:]+):(\d+):([^:]+):(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const prod = products.find((p) => p.id === ctx.match[1]);
    const cat = ctx.match[3];
    if (!prod || !isCat(cat)) return;
    const locale = await localeOf(ctx);
    try {
      await ctx.editMessageReplyMarkup({
        reply_markup: productKeyboard(prod, Number(ctx.match[2]), cat, Number(ctx.match[4]), locale),
      });
    } catch {
      /* same markup */
    }
  });

  bot.callbackQuery(/^add:([^:]+):(\d+):([^:]+):(\d+)$/, async (ctx) => {
    const prod = products.find((p) => p.id === ctx.match[1]);
    const qty = Number(ctx.match[2]);
    const cat = ctx.match[3];
    const locale = await localeOf(ctx);
    const t = botDicts[locale];
    if (!prod || !isCat(cat)) {
      await ctx.answerCallbackQuery();
      return;
    }
    const chatId = ctx.chat!.id;
    const cart = await getBotCart(chatId);
    const line = cart.find((c) => c.productId === prod.id);
    if (line) line.qty = Math.min(99, line.qty + qty);
    else cart.push({ productId: prod.id, qty });
    await setBotCart(chatId, cart);
    await ctx.answerCallbackQuery({ text: t.addedToast(prod.name), show_alert: false });
    const kb = new InlineKeyboard().text(t.viewCart, "cart").text(t.continueShopping, `pg:${cat}:${ctx.match[4]}`);
    await ctx.reply(t.addedToast(prod.name), { reply_markup: kb });
  });

  bot.callbackQuery(/^cq:([^:]+):(-?\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const chatId = ctx.chat!.id;
    const qty = Number(ctx.match[2]);
    const cart = await getBotCart(chatId);
    const next = qty <= 0 ? cart.filter((c) => c.productId !== ctx.match[1]) : cart.map((c) => (c.productId === ctx.match[1] ? { ...c, qty: Math.min(99, qty) } : c));
    await setBotCart(chatId, next);
    await showCart(ctx, true);
  });

  bot.callbackQuery("clearcart", async (ctx) => {
    const locale = await localeOf(ctx);
    await setBotCart(ctx.chat!.id, []);
    await ctx.answerCallbackQuery({ text: botDicts[locale].cartCleared });
    await showCart(ctx, true);
  });

  bot.callbackQuery("checkout", async (ctx) => {
    await ctx.answerCallbackQuery();
    const chatId = ctx.chat!.id;
    const locale = await localeOf(ctx);
    const t = botDicts[locale];
    if ((await getBotCart(chatId)).length === 0) {
      await showCart(ctx, true);
      return;
    }
    await setChatState(chatId, { step: "name" });
    await ctx.reply(t.askName, { parse_mode: "HTML", reply_markup: { remove_keyboard: true } });
  });

  // Shared phone via the "share my number" button
  bot.on("message:contact", async (ctx) => {
    if (!notAdmin(ctx)) return;
    const state = await getChatState(ctx.chat.id);
    if (state?.step !== "phone" || !state.name) return;
    const phone = ctx.message.contact.phone_number;
    const locale = await localeOf(ctx);
    if (!isValidPhone(phone)) {
      await ctx.reply(botDicts[locale].invalidPhone, { parse_mode: "HTML" });
      return;
    }
    await createOrderFromCart(ctx, bot, state.name, formatPhone(phone));
  });

  /**
   * Text handling for the catalog: menu buttons and checkout answers.
   * Returns true when the message was consumed.
   */
  bot.use(async (ctx, next) => {
    if (!ctx.message?.text || !ctx.chat || !notAdmin(ctx) || ctx.message.text.startsWith("/")) return next();
    const text = ctx.message.text.trim();
    const chatId = ctx.chat.id;
    const locale = await localeOf(ctx);
    const t = botDicts[locale];

    // menu buttons (any language, in case the user switched)
    const all = Object.values(botDicts);
    if (all.some((d) => d.menuCatalog === text)) return showCategories(ctx);
    if (all.some((d) => d.menuCart === text)) return showCart(ctx);
    if (all.some((d) => d.menuContact === text)) {
      await ctx.reply(t.contactText(site.phone, site.telegram), { parse_mode: "HTML", reply_markup: mainMenu(locale) });
      return;
    }

    const state = await getChatState(chatId);
    if (state?.step === "name") {
      await setChatState(chatId, { step: "phone", name: text.slice(0, 80) });
      const kb = new Keyboard().requestContact(t.sharePhone).resized().oneTime();
      await ctx.reply(t.askPhone, { parse_mode: "HTML", reply_markup: kb });
      return;
    }
    if (state?.step === "phone" && state.name) {
      if (!isValidPhone(text)) {
        await ctx.reply(t.invalidPhone, { parse_mode: "HTML" });
        return;
      }
      await createOrderFromCart(ctx, bot, state.name, formatPhone(text));
      return;
    }
    return next();
  });
}
