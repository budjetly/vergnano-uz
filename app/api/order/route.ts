import { NextResponse } from "next/server";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { products } from "@/lib/products";
import { generateOrderId, saveOrder, type Order, type OrderItem } from "@/lib/orders";
import { formatPhone, isValidPhone } from "@/lib/phone";

interface OrderPayloadItem {
  id: string;
  qty: number;
}

interface OrderPayload {
  name: string;
  phone: string;
  company?: string;
  comment?: string;
  locale: string;
  items: OrderPayloadItem[];
}

export async function POST(request: Request) {
  let payload: OrderPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, items } = payload;
  if (!name?.trim() || !phone?.trim() || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  // Resolve items on the server so prices can't be tampered with client-side
  const resolved: OrderItem[] = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.id);
    const qty = Math.floor(Number(item.qty));
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 999) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }
    resolved.push({
      id: product.id,
      name: product.name,
      packSize: product.packSize,
      qty,
      price: product.price,
      image: product.image,
    });
  }
  const total = resolved.reduce((sum, i) => sum + i.price * i.qty, 0);

  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: "awaiting_confirmation",
    locale: payload.locale || "uz",
    name: name.trim(),
    phone: formatPhone(phone),
    company: payload.company?.trim() || undefined,
    comment: payload.comment?.trim() || undefined,
    items: resolved,
    total,
  };
  await saveOrder(order);

  // Notify the admin chat that a new order was placed (payment comes next in the bot)
  const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);
  const lines = [
    "🛒 <b>Yangi buyurtma / Новый заказ</b>",
    `🆔 <b>${order.id}</b> — to'lov kutilmoqda / ожидается оплата`,
    "",
    `👤 <b>${escapeHtml(order.name)}</b>`,
    `📞 ${escapeHtml(order.phone)}`,
  ];
  if (order.company) lines.push(`🏢 ${escapeHtml(order.company)}`);
  if (order.comment) lines.push(`💬 ${escapeHtml(order.comment)}`);
  lines.push("");
  for (const item of resolved) {
    lines.push(
      `• ${escapeHtml(item.name)} (${escapeHtml(item.packSize)}) × ${item.qty} = ${fmt(item.price * item.qty)} so'm`
    );
  }
  lines.push("", `💰 <b>Jami / Итого: ${fmt(total)} so'm</b>`, `🌐 ${order.locale}`);
  await sendTelegramMessage(lines.join("\n"));

  const botUsername = process.env.TELEGRAM_BOT_USERNAME || "";
  const payUrl = botUsername ? `https://t.me/${botUsername}?start=o_${order.id}` : null;

  return NextResponse.json({ ok: true, orderId: order.id, payUrl });
}
