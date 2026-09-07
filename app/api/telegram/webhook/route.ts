// Production entry point: Telegram webhook (used when deployed, e.g. on Vercel).
// Register it once after deploying:
//   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=<SITE_URL>/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>"
import { webhookCallback } from "grammy";
import { createBot } from "@/bot/bot";

export const dynamic = "force-dynamic";

let handler: ((req: Request) => Promise<Response>) | null = null;

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return new Response("Bot not configured", { status: 503 });
  }
  if (!handler) {
    handler = webhookCallback(createBot(token), "std/http", {
      secretToken: process.env.TELEGRAM_WEBHOOK_SECRET || undefined,
    });
  }
  return handler(req);
}
