import { promises as fs } from "fs";
import path from "path";

export type OrderStatus =
  | "awaiting_confirmation" // created on the website, not yet confirmed in the bot
  | "awaiting_payment" // confirmed in the bot, card details shown
  | "awaiting_review" // screenshot received, waiting for admin approve/reject
  | "confirmed"
  | "rejected"
  | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  packSize: string;
  qty: number;
  price: number;
  image: string; // public path like /products/x.png
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  locale: string;
  name: string;
  phone: string;
  company?: string;
  comment?: string;
  items: OrderItem[];
  total: number;
  customerChatId?: number; // Telegram chat of the buyer, set on /start
  screenshotFileId?: string;
  adminMessageId?: number;
}

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rnd = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `CV-${ts}${rnd}`;
}

// ---------------------------------------------------------------------------
// Storage: Upstash Redis (REST) when configured, local JSON files otherwise.
// Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN on Vercel; locally
// orders live in .orders/ (gitignored).
// ---------------------------------------------------------------------------

const ORDER_TTL_SECONDS = 60 * 60 * 24 * 30; // keep orders 30 days

interface Store {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
}

function upstashStore(url: string, token: string): Store {
  async function cmd(parts: (string | number)[]): Promise<unknown> {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parts),
    });
    if (!res.ok) throw new Error(`Upstash error ${res.status}`);
    const data = (await res.json()) as { result: unknown };
    return data.result;
  }
  return {
    async get(key) {
      const result = await cmd(["GET", key]);
      return typeof result === "string" ? result : null;
    },
    async set(key, value) {
      await cmd(["SET", key, value, "EX", ORDER_TTL_SECONDS]);
    },
    async del(key) {
      await cmd(["DEL", key]);
    },
  };
}

function fileStore(): Store {
  const dir = path.join(process.cwd(), ".orders");
  const fileFor = (key: string) =>
    path.join(dir, key.replace(/[^a-zA-Z0-9_-]/g, "_") + ".json");
  return {
    async get(key) {
      try {
        return await fs.readFile(fileFor(key), "utf8");
      } catch {
        return null;
      }
    },
    async set(key, value) {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fileFor(key), value, "utf8");
    },
    async del(key) {
      try {
        await fs.unlink(fileFor(key));
      } catch {
        // already gone
      }
    },
  };
}

function getStore(): Store {
  // Vercel's Upstash marketplace integration injects KV_REST_API_*; direct
  // Upstash setups use UPSTASH_REDIS_REST_* — accept either.
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) return upstashStore(url, token);
  return fileStore();
}

export async function saveOrder(order: Order): Promise<void> {
  await getStore().set(`order:${order.id}`, JSON.stringify(order));
}

export async function getOrder(id: string): Promise<Order | null> {
  const raw = await getStore().get(`order:${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

// The buyer's currently active order in the bot (chat id -> order id)
export async function setActiveOrder(chatId: number, orderId: string): Promise<void> {
  await getStore().set(`active:${chatId}`, orderId);
}

export async function getActiveOrder(chatId: number): Promise<Order | null> {
  const id = await getStore().get(`active:${chatId}`);
  return id ? getOrder(id) : null;
}

export async function clearActiveOrder(chatId: number): Promise<void> {
  await getStore().del(`active:${chatId}`);
}

// Per-chat language preference for users who open the bot without an order
export async function setChatLocale(chatId: number, locale: string): Promise<void> {
  await getStore().set(`lang:${chatId}`, locale);
}

export async function getChatLocale(chatId: number): Promise<string | null> {
  return getStore().get(`lang:${chatId}`);
}
