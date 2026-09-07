// Local / VPS entry point: runs the bot with long polling.
//   npm run bot
// Reads TELEGRAM_BOT_TOKEN etc. from .env.local
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env.local") });

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error(
      "TELEGRAM_BOT_TOKEN is not set. Create a bot with @BotFather and put the token in .env.local"
    );
    process.exit(1);
  }
  const { createBot } = await import("../bot/bot");
  const bot = createBot(token);
  // Long polling must not run while a webhook is registered
  await bot.api.deleteWebhook({ drop_pending_updates: false });
  console.log("🤖 Caffè Vergnano Uz bot is running (long polling). Ctrl+C to stop.");
  await bot.start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
