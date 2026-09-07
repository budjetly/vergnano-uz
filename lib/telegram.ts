// Sends a message to the company's Telegram via a bot.
//
// Setup (when the bot is ready):
//   1. Create a bot with @BotFather -> get the token
//   2. Add the bot to the orders group/channel (or use a manager's chat)
//   3. Get the chat id (e.g. via https://api.telegram.org/bot<TOKEN>/getUpdates)
//   4. Set env vars in .env.local / Vercel:
//        TELEGRAM_BOT_TOKEN=123456:ABC-...
//        TELEGRAM_CHAT_ID=-1001234567890
//
// Until those are set, messages are logged to the server console so no
// order is silently dropped during development.

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set. Message:\n" + text
    );
    return true;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  if (!res.ok) {
    console.error("[telegram] sendMessage failed:", res.status, await res.text());
    return false;
  }
  return true;
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
