import { Bot, InlineKeyboard, type Context } from "grammy";
import {
  getOrder,
  saveOrder,
  setActiveOrder,
  getActiveOrder,
  clearActiveOrder,
  setChatLocale,
  getChatLocale,
} from "@/lib/orders";
import { botDicts, asBotLocale, type BotLocale } from "./i18n";
import {
  ADMIN_CHAT_ID,
  SITE_URL,
  dictFor,
  mainMenu,
  sendOrderSummary,
  sendPaymentInstructions,
  adminOrderCaption,
} from "./shared";
import { registerCatalog } from "./catalog";

const langKeyboard = () =>
  new InlineKeyboard().text("🇺🇿 O'zbekcha", "lang:uz").text("🇷🇺 Русский", "lang:ru").text("🇬🇧 English", "lang:en");

async function sendWelcome(ctx: Context, locale: BotLocale) {
  const t = botDicts[locale];
  const kb = new InlineKeyboard().text(t.menuCatalog, "catalog");
  if (SITE_URL) kb.row().url(t.websiteBtn, `${SITE_URL}/${locale}/products`);
  await ctx.reply(t.welcome, { parse_mode: "HTML", reply_markup: mainMenu(locale) });
  await ctx.reply("👇", { reply_markup: kb });
}

export function createBot(token: string): Bot {
  const bot = new Bot(token);

  // /start — with an order payload (o_CV-XXXX) from the website, or plain
  bot.command("start", async (ctx) => {
    const payload = ctx.match?.trim();
    const chatId = ctx.chat.id;

    if (payload?.startsWith("o_")) {
      const order = await getOrder(payload.slice(2));
      if (!order) {
        await ctx.reply(dictFor(await getChatLocale(chatId)).unknownOrder);
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
      await ctx.reply(botDicts.uz.chooseLang, { reply_markup: langKeyboard() });
      return;
    }
    await sendWelcome(ctx, asBotLocale(saved));
  });

  bot.command("lang", (ctx) => ctx.reply(botDicts.uz.chooseLang, { reply_markup: langKeyboard() }));

  bot.callbackQuery(/^lang:(uz|ru|en)$/, async (ctx) => {
    const locale = ctx.match[1] as BotLocale;
    await setChatLocale(ctx.chat!.id, locale);
    await ctx.answerCallbackQuery();
    try {
      await ctx.editMessageText(botDicts[locale].langSaved);
    } catch {
      /* already edited */
    }
    await sendWelcome(ctx, locale);
  });

  // Customer confirms the order -> payment details
  bot.callbackQuery(/^confirm:(.+)$/, async (ctx) => {
    const order = await getOrder(ctx.match[1]);
    const t = dictFor(order?.locale ?? (await getChatLocale(ctx.chat!.id)));
    await ctx.answerCallbackQuery();
    if (!order) return void (await ctx.reply(t.unknownOrder));
    if (order.status !== "awaiting_confirmation" && order.status !== "awaiting_payment") {
      return void (await ctx.reply(t.alreadyDone));
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
    if (ctx.chat?.id !== ADMIN_CHAT_ID) return void (await ctx.answerCallbackQuery({ text: "Not allowed" }));
    const action = ctx.match[1];
    const order = await getOrder(ctx.match[2]);
    if (!order) return void (await ctx.answerCallbackQuery({ text: "Order not found" }));
    if (order.status !== "awaiting_review") return void (await ctx.answerCallbackQuery({ text: "Already processed" }));
    order.status = action === "approve" ? "confirmed" : "rejected";
    await saveOrder(order);
    await ctx.answerCallbackQuery({ text: action === "approve" ? "✅ Confirmed" : "❌ Rejected" });
    const mark = action === "approve" ? "\n\n✅ <b>TASDIQLANDI</b>" : "\n\n❌ <b>RAD ETILDI</b>";
    try {
      await ctx.editMessageCaption({ caption: adminOrderCaption(order) + mark, parse_mode: "HTML" });
    } catch {
      /* cosmetic */
    }
    if (order.customerChatId) {
      const t = dictFor(order.locale);
      await bot.api.sendMessage(order.customerChatId, action === "approve" ? t.confirmed(order.id) : t.rejected(order.id), { parse_mode: "HTML" });
      if (action === "approve") await clearActiveOrder(order.customerChatId);
    }
  });

  // Payment screenshot (photo or image document)
  bot.on([":photo", ":document"], async (ctx) => {
    if (ctx.chat.id === ADMIN_CHAT_ID) return;
    const t = dictFor(await getChatLocale(ctx.chat.id));
    const order = await getActiveOrder(ctx.chat.id);
    if (!order || (order.status !== "awaiting_payment" && order.status !== "awaiting_review")) {
      return void (await ctx.reply(t.noActiveOrder));
    }
    const photo = ctx.message?.photo?.at(-1);
    const doc = ctx.message?.document;
    if (!photo && !doc?.mime_type?.startsWith("image/")) {
      return void (await ctx.reply(t.notAPhoto, { parse_mode: "HTML" }));
    }
    order.status = "awaiting_review";
    order.screenshotFileId = photo?.file_id ?? doc!.file_id;
    await saveOrder(order);
    await ctx.reply(t.screenshotReceived(order.id), { parse_mode: "HTML" });
    if (ADMIN_CHAT_ID) {
      const kb = new InlineKeyboard().text("✅ Tasdiqlash", `approve:${order.id}`).text("❌ Rad etish", `reject:${order.id}`);
      const caption = adminOrderCaption(order);
      const sent = photo
        ? await bot.api.sendPhoto(ADMIN_CHAT_ID, order.screenshotFileId, { caption, parse_mode: "HTML", reply_markup: kb })
        : await bot.api.sendDocument(ADMIN_CHAT_ID, order.screenshotFileId, { caption, parse_mode: "HTML", reply_markup: kb });
      order.adminMessageId = sent.message_id;
      await saveOrder(order);
    }
  });

  // Catalog, cart and checkout (menu buttons + checkout answers are handled here first)
  registerCatalog(bot);

  // Any other text from a customer
  bot.on("message:text", async (ctx) => {
    if (ctx.chat.id === ADMIN_CHAT_ID) return;
    const locale = asBotLocale(await getChatLocale(ctx.chat.id));
    const t = botDicts[locale];
    const order = await getActiveOrder(ctx.chat.id);
    if (order && order.status === "awaiting_payment") {
      await ctx.reply(t.notAPhoto, { parse_mode: "HTML" });
    } else {
      await sendWelcome(ctx, locale);
    }
  });

  bot.catch((err) => console.error("[bot] error:", err.error));
  return bot;
}
