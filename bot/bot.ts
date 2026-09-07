import { Bot, InlineKeyboard, InputFile, type Context } from "grammy";
import type { InputMediaPhoto } from "grammy/types";
import path from "path";
import {
  getOrder,
  saveOrder,
  setActiveOrder,
  getActiveOrder,
  clearActiveOrder,
  setChatLocale,
  getChatLocale,
  type Order,
} from "@/lib/orders";
import { paymentCards } from "@/lib/payment";
import { botDicts, botLocales, asBotLocale, type BotLocale } from "./i18n";

const SITE_URL = process.env.SITE_URL || "";
const ADMIN_CHAT_ID = Number(process.env.TELEGRAM_CHAT_ID || 0);

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function dictFor(locale: string | null | undefined) {
  return botDicts[asBotLocale(locale)];
}

/** Product image as a URL (deployed) or a local file from public/ (dev/VPS). */
function imageSource(publicPath: string): string | InputFile {
  if (SITE_URL) return `${SITE_URL.replace(/\/$/, "")}${publicPath}`;
  return new InputFile(path.join(process.cwd(), "public", publicPath));
}

function orderSummaryText(order: Order, locale: BotLocale): string {
  const t = botDicts[locale];
  const lines = [t.orderTitle, ""];
  for (const item of order.items) {
    lines.push(t.itemLine(esc(item.name), esc(item.packSize), item.qty, fmt(item.price * item.qty)));
  }
  lines.push("", t.total(fmt(order.total)));
  return lines.join("\n");
}

async function sendOrderSummary(ctx: Context, order: Order, locale: BotLocale) {
  const t = botDicts[locale];

  // Product photos as an album (Telegram allows 2–10 per media group)
  const photos: InputMediaPhoto[] = order.items.slice(0, 10).map((item) => ({
    type: "photo",
    media: imageSource(item.image),
  }));
  try {
    if (photos.length >= 2) {
      await ctx.replyWithMediaGroup(photos);
    } else if (photos.length === 1) {
      await ctx.replyWithPhoto(photos[0].media);
    }
  } catch (err) {
    // Photos are decorative — never block the order on them
    console.error("[bot] failed to send product photos:", err);
  }

  const keyboard = new InlineKeyboard()
    .text(t.confirmBtn, `confirm:${order.id}`)
    .row()
    .text(t.cancelBtn, `cancel:${order.id}`);

  await ctx.reply(orderSummaryText(order, locale), {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
}

async function sendPaymentInstructions(ctx: Context, order: Order, locale: BotLocale) {
  const t = botDicts[locale];
  const cards = paymentCards
    .map((c) => t.cardLine(esc(c.label), esc(c.number), esc(c.holder)))
    .join("\n\n");
  const text = [
    t.payTitle,
    "",
    t.payInstructions(order.id, fmt(order.total)),
    "",
    cards,
    "",
    t.afterPay,
  ].join("\n");
  await ctx.reply(text, { parse_mode: "HTML" });
}

function adminOrderCaption(order: Order): string {
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

export function createBot(token: string): Bot {
  const bot = new Bot(token);

  // /start — with an order payload (o_CV-XXXX) or plain
  bot.command("start", async (ctx) => {
    const payload = ctx.match?.trim();
    const chatId = ctx.chat.id;

    if (payload?.startsWith("o_")) {
      const orderId = payload.slice(2);
      const order = await getOrder(orderId);
      if (!order) {
        const t = dictFor(await getChatLocale(chatId));
        await ctx.reply(t.unknownOrder);
        return;
      }
      const locale = asBotLocale(order.locale);
      order.customerChatId = chatId;
      await saveOrder(order);
      await setActiveOrder(chatId, order.id);
      await setChatLocale(chatId, locale);
      await sendOrderSummary(ctx, order, locale);
      return;
    }

    const saved = await getChatLocale(chatId);
    if (!saved) {
      const kb = new InlineKeyboard()
        .text("🇺🇿 O'zbekcha", "lang:uz")
        .text("🇷🇺 Русский", "lang:ru")
        .text("🇬🇧 English", "lang:en");
      await ctx.reply(botDicts.uz.chooseLang, { reply_markup: kb });
      return;
    }
    const t = dictFor(saved);
    const kb = SITE_URL
      ? new InlineKeyboard().url(t.websiteBtn, `${SITE_URL}/${asBotLocale(saved)}/products`)
      : undefined;
    await ctx.reply(t.welcome, { parse_mode: "HTML", reply_markup: kb });
  });

  bot.command("lang", async (ctx) => {
    const kb = new InlineKeyboard()
      .text("🇺🇿 O'zbekcha", "lang:uz")
      .text("🇷🇺 Русский", "lang:ru")
      .text("🇬🇧 English", "lang:en");
    await ctx.reply(botDicts.uz.chooseLang, { reply_markup: kb });
  });

  bot.callbackQuery(/^lang:(uz|ru|en)$/, async (ctx) => {
    const locale = ctx.match[1] as BotLocale;
    const chatId = ctx.chat!.id;
    await setChatLocale(chatId, locale);
    const t = botDicts[locale];
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(t.langSaved);
    const kb = SITE_URL
      ? new InlineKeyboard().url(t.websiteBtn, `${SITE_URL}/${locale}/products`)
      : undefined;
    await ctx.reply(t.welcome, { parse_mode: "HTML", reply_markup: kb });
  });

  // Customer confirms the order -> show payment details
  bot.callbackQuery(/^confirm:(.+)$/, async (ctx) => {
    const order = await getOrder(ctx.match[1]);
    const t = dictFor(order?.locale ?? (await getChatLocale(ctx.chat!.id)));
    await ctx.answerCallbackQuery();
    if (!order) {
      await ctx.reply(t.unknownOrder);
      return;
    }
    if (order.status !== "awaiting_confirmation" && order.status !== "awaiting_payment") {
      await ctx.reply(t.alreadyDone);
      return;
    }
    order.status = "awaiting_payment";
    await saveOrder(order);
    await ctx.editMessageReplyMarkup({ reply_markup: undefined });
    await sendPaymentInstructions(ctx, order, asBotLocale(order.locale));
  });

  bot.callbackQuery(/^cancel:(.+)$/, async (ctx) => {
    const order = await getOrder(ctx.match[1]);
    const t = dictFor(order?.locale ?? (await getChatLocale(ctx.chat!.id)));
    await ctx.answerCallbackQuery();
    if (order && (order.status === "awaiting_confirmation" || order.status === "awaiting_payment")) {
      order.status = "cancelled";
      await saveOrder(order);
      await clearActiveOrder(ctx.chat!.id);
    }
    await ctx.editMessageReplyMarkup({ reply_markup: undefined });
    await ctx.reply(t.cancelled);
  });

  // Admin approves / rejects a payment
  bot.callbackQuery(/^(approve|reject):(.+)$/, async (ctx) => {
    if (ctx.chat?.id !== ADMIN_CHAT_ID) {
      await ctx.answerCallbackQuery({ text: "Not allowed" });
      return;
    }
    const action = ctx.match[1];
    const order = await getOrder(ctx.match[2]);
    if (!order) {
      await ctx.answerCallbackQuery({ text: "Order not found" });
      return;
    }
    if (order.status !== "awaiting_review") {
      await ctx.answerCallbackQuery({ text: "Already processed" });
      return;
    }
    order.status = action === "approve" ? "confirmed" : "rejected";
    await saveOrder(order);
    await ctx.answerCallbackQuery({ text: action === "approve" ? "✅ Confirmed" : "❌ Rejected" });

    const mark = action === "approve" ? "\n\n✅ <b>TASDIQLANDI</b>" : "\n\n❌ <b>RAD ETILDI</b>";
    try {
      await ctx.editMessageCaption({
        caption: adminOrderCaption(order) + mark,
        parse_mode: "HTML",
      });
    } catch {
      // caption edit is cosmetic
    }

    if (order.customerChatId) {
      const t = dictFor(order.locale);
      const text = action === "approve" ? t.confirmed(order.id) : t.rejected(order.id);
      await bot.api.sendMessage(order.customerChatId, text, { parse_mode: "HTML" });
      if (action === "approve") await clearActiveOrder(order.customerChatId);
    }
  });

  // Payment screenshot (photo or image document)
  bot.on([":photo", ":document"], async (ctx) => {
    if (ctx.chat.id === ADMIN_CHAT_ID) return; // ignore media in the admin chat
    const t = dictFor(await getChatLocale(ctx.chat.id));
    const order = await getActiveOrder(ctx.chat.id);
    if (!order || (order.status !== "awaiting_payment" && order.status !== "awaiting_review")) {
      await ctx.reply(t.noActiveOrder);
      return;
    }

    const photo = ctx.message?.photo?.at(-1);
    const doc = ctx.message?.document;
    const isImageDoc = doc?.mime_type?.startsWith("image/");
    if (!photo && !isImageDoc) {
      await ctx.reply(t.notAPhoto, { parse_mode: "HTML" });
      return;
    }

    order.status = "awaiting_review";
    order.screenshotFileId = photo?.file_id ?? doc!.file_id;
    await saveOrder(order);

    await ctx.reply(t.screenshotReceived(order.id), { parse_mode: "HTML" });

    if (ADMIN_CHAT_ID) {
      const kb = new InlineKeyboard()
        .text("✅ Tasdiqlash", `approve:${order.id}`)
        .text("❌ Rad etish", `reject:${order.id}`);
      const caption = adminOrderCaption(order);
      const sent = photo
        ? await bot.api.sendPhoto(ADMIN_CHAT_ID, order.screenshotFileId, {
            caption,
            parse_mode: "HTML",
            reply_markup: kb,
          })
        : await bot.api.sendDocument(ADMIN_CHAT_ID, order.screenshotFileId, {
            caption,
            parse_mode: "HTML",
            reply_markup: kb,
          });
      order.adminMessageId = sent.message_id;
      await saveOrder(order);
    }
  });

  // Any other text from a customer
  bot.on("message:text", async (ctx) => {
    if (ctx.chat.id === ADMIN_CHAT_ID) return;
    const t = dictFor(await getChatLocale(ctx.chat.id));
    const order = await getActiveOrder(ctx.chat.id);
    if (order && order.status === "awaiting_payment") {
      await ctx.reply(t.notAPhoto, { parse_mode: "HTML" });
    } else {
      const kb = SITE_URL
        ? new InlineKeyboard().url(
            t.websiteBtn,
            `${SITE_URL}/${asBotLocale(await getChatLocale(ctx.chat.id))}/products`
          )
        : undefined;
      await ctx.reply(t.welcome, { parse_mode: "HTML", reply_markup: kb });
    }
  });

  bot.catch((err) => {
    console.error("[bot] error:", err.error);
  });

  return bot;
}
