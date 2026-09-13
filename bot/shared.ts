import { InlineKeyboard, InputFile, Keyboard, type Api, type Context } from "grammy";
import type { InputMediaPhoto } from "grammy/types";
import path from "path";
import type { Order } from "@/lib/orders";
import { paymentCards } from "@/lib/payment";
import { botDicts, asBotLocale, type BotLocale } from "./i18n";

export const SITE_URL = process.env.SITE_URL || "";
export const ADMIN_CHAT_ID = Number(process.env.TELEGRAM_CHAT_ID || 0);

export const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function dictFor(locale: string | null | undefined) {
  return botDicts[asBotLocale(locale)];
}

/** Product image as a URL (deployed) or a local file from public/ (dev/VPS). */
export function imageSource(publicPath: string): string | InputFile {
  if (SITE_URL) return `${SITE_URL.replace(/\/$/, "")}${publicPath}`;
  return new InputFile(path.join(process.cwd(), "public", publicPath));
}

/** Persistent bottom menu: Catalog · Cart · Contact */
export function mainMenu(locale: BotLocale) {
  const t = botDicts[locale];
  return new Keyboard().text(t.menuCatalog).text(t.menuCart).row().text(t.menuContact).resized().persistent();
}

export function orderSummaryText(order: Order, locale: BotLocale): string {
  const t = botDicts[locale];
  const lines = [t.orderTitle, ""];
  for (const item of order.items) {
    lines.push(t.itemLine(esc(item.name), esc(item.packSize), item.qty, fmt(item.price * item.qty)));
  }
  lines.push("", t.total(fmt(order.total)));
  return lines.join("\n");
}

export async function sendOrderSummary(ctx: Context, order: Order, locale: BotLocale) {
  const t = botDicts[locale];
  const photos: InputMediaPhoto[] = order.items.slice(0, 10).map((item) => ({
    type: "photo",
    media: imageSource(item.image),
  }));
  try {
    if (photos.length >= 2) await ctx.replyWithMediaGroup(photos);
    else if (photos.length === 1) await ctx.replyWithPhoto(photos[0].media);
  } catch (err) {
    console.error("[bot] failed to send product photos:", err);
  }
  const keyboard = new InlineKeyboard()
    .text(t.confirmBtn, `confirm:${order.id}`)
    .row()
    .text(t.cancelBtn, `cancel:${order.id}`);
  await ctx.reply(orderSummaryText(order, locale), { parse_mode: "HTML", reply_markup: keyboard });
}

export async function sendPaymentInstructions(ctx: Context, order: Order, locale: BotLocale) {
  const t = botDicts[locale];
  const cards = paymentCards
    .map((c) => t.cardLine(esc(c.label), esc(c.number), esc(c.holder)))
    .join("\n\n");
  const text = [t.payTitle, "", t.payInstructions(order.id, fmt(order.total)), "", cards, "", t.afterPay].join("\n");
  await ctx.reply(text, { parse_mode: "HTML" });
}

export function adminOrderCaption(order: Order): string {
  const lines = [
    `📸 <b>To'lov cheki / Чек об оплате</b>`,
    `🆔 <b>${order.id}</b>`,
    "",
    `👤 ${esc(order.name)}`,
    `📞 ${esc(order.phone)}`,
  ];
  if (order.company) lines.push(`🏢 ${esc(order.company)}`);
  if (order.comment) lines.push(`💬 ${esc(order.comment)}`);
  lines.push("");
  for (const item of order.items) {
    lines.push(`• ${esc(item.name)} × ${item.qty} = ${fmt(item.price * item.qty)} so'm`);
  }
  lines.push("", `💰 <b>Jami / Итого: ${fmt(order.total)} so'm</b>`);
  return lines.join("\n");
}

/** Same "new order" notice the website sends, for orders created inside the bot. */
export async function notifyAdminNewOrder(api: Api, order: Order, source: "bot" | "web") {
  if (!ADMIN_CHAT_ID) return;
  const lines = [
    "🛒 <b>Yangi buyurtma / Новый заказ</b>",
    `🆔 <b>${order.id}</b> — to'lov kutilmoqda / ожидается оплата`,
    `📲 ${source === "bot" ? "Telegram bot" : "Sayt / Сайт"}`,
    "",
    `👤 <b>${esc(order.name)}</b>`,
    `📞 ${esc(order.phone)}`,
  ];
  if (order.company) lines.push(`🏢 ${esc(order.company)}`);
  if (order.comment) lines.push(`💬 ${esc(order.comment)}`);
  lines.push("");
  for (const item of order.items) {
    lines.push(`• ${esc(item.name)} (${esc(item.packSize)}) × ${item.qty} = ${fmt(item.price * item.qty)} so'm`);
  }
  lines.push("", `💰 <b>Jami / Итого: ${fmt(order.total)} so'm</b>`, `🌐 ${order.locale}`);
  try {
    await api.sendMessage(ADMIN_CHAT_ID, lines.join("\n"), { parse_mode: "HTML" });
  } catch (err) {
    console.error("[bot] admin notify failed:", err);
  }
}
