// Delivers contact-form messages to the company inbox via Resend
// (https://resend.com — free tier, plain HTTPS API, no SDK needed).
//
// Env vars:
//   RESEND_API_KEY     from the Resend dashboard
//   CONTACT_EMAIL_TO   the Gmail inbox that should receive messages
//   CONTACT_EMAIL_FROM optional; defaults to Resend's onboarding sender until
//                      caffevergnano1882.uz is verified in Resend
//
// Without RESEND_API_KEY the message is relayed through FormSubmit
// (https://formsubmit.co — no account or key; the inbox owner activates the
// address once via an emailed link). Without CONTACT_EMAIL_TO this is a no-op
// and the message still reaches the Telegram group.

export interface ContactEmail {
  name: string;
  phone: string;
  email: string;
  message: string;
  locale: string;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sendViaFormSubmit(to: string, c: ContactEmail): Promise<boolean> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://caffevergnano1882.uz",
        Referer: "https://caffevergnano1882.uz/contact",
      },
      body: JSON.stringify({
        _subject: `Saytdan xabar: ${c.name} (${c.phone})`,
        _replyto: c.email,
        _template: "table",
        _captcha: "false",
        "Ism / Имя": c.name,
        Telefon: c.phone,
        Email: c.email,
        "Til / Язык": c.locale,
        "Xabar / Сообщение": c.message,
      }),
    });
    const data = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
    const ok = res.ok && String(data?.success) === "true";
    if (!ok) console.error("[email] FormSubmit error", res.status, data);
    return ok;
  } catch (err) {
    console.error("[email] FormSubmit failed", err);
    return false;
  }
}

export async function sendContactEmail(c: ContactEmail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!to) return false;
  if (!key) return sendViaFormSubmit(to, c);

  const from =
    process.env.CONTACT_EMAIL_FROM || "Caffè Vergnano Uz <onboarding@resend.dev>";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#2a1b12">
      <h2 style="margin:0 0 16px">Yangi xabar / Новое сообщение — caffevergnano1882.uz</h2>
      <table style="border-collapse:collapse;font-size:15px">
        <tr><td style="padding:4px 12px 4px 0;color:#6b5140">Ism / Имя</td><td><b>${esc(c.name)}</b></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6b5140">Telefon</td><td><a href="tel:${esc(c.phone.replace(/\s+/g, ""))}">${esc(c.phone)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6b5140">Email</td><td><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6b5140">Til / Язык</td><td>${esc(c.locale)}</td></tr>
      </table>
      <p style="margin:20px 0 6px;color:#6b5140">Xabar / Сообщение:</p>
      <div style="white-space:pre-wrap;padding:14px;background:#f7f2e9;border-radius:10px">${esc(c.message)}</div>
      <p style="margin-top:20px;font-size:12px;color:#6b5140">Reply to this email to answer the customer directly.</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: c.email,
        subject: `Saytdan xabar: ${c.name} (${c.phone})`,
        html,
        text: `${c.name}\n${c.phone}\n${c.email}\n\n${c.message}`,
      }),
    });
    if (!res.ok) {
      console.error("[email] Resend error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    return false;
  }
}
