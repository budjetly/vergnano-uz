import { NextResponse } from "next/server";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { sendContactEmail } from "@/lib/email";
import { formatPhone, isValidPhone } from "@/lib/phone";

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

  const { name, phone, email, message } = payload;
  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }
  const phoneFmt = formatPhone(phone);

  const lines = [
    "✉️ <b>Yangi xabar / Новое сообщение</b>",
    "",
    `👤 <b>${escapeHtml(name.trim())}</b>`,
    `📞 ${escapeHtml(phoneFmt)}`,
  ];
  if (payload.email?.trim()) lines.push(`📧 ${escapeHtml(payload.email.trim())}`);
  lines.push("", escapeHtml(message.trim()), "", `🌐 ${payload.locale}`);

  const [tgOk, mailOk] = await Promise.all([
    sendTelegramMessage(lines.join("\n")),
    sendContactEmail({
      name: name.trim(),
      phone: phoneFmt,
      email: email.trim(),
      message: message.trim(),
      locale: payload.locale,
    }),
  ]);
  // Telegram is the primary channel; email is best-effort until configured
  if (!tgOk && !mailOk) {
    return NextResponse.json({ error: "Failed to deliver message" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
