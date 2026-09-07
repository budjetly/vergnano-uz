import { NextResponse } from "next/server";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";

interface ContactPayload {
  name: string;
  phone: string;
  email?: string;
  message: string;
  locale: string;
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, message } = payload;
  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const lines = [
    "✉️ <b>Yangi xabar / Новое сообщение</b>",
    "",
    `👤 <b>${escapeHtml(name.trim())}</b>`,
    `📞 ${escapeHtml(phone.trim())}`,
  ];
  if (payload.email?.trim()) lines.push(`📧 ${escapeHtml(payload.email.trim())}`);
  lines.push("", escapeHtml(message.trim()), "", `🌐 ${payload.locale}`);

  const ok = await sendTelegramMessage(lines.join("\n"));
  if (!ok) {
    return NextResponse.json({ error: "Failed to deliver message" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
