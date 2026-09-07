"use client";

import { useState } from "react";
import type { Locale, Dictionary } from "@/lib/i18n";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-espresso/15 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-espresso";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-cocoa">
            {dict.contact.name} *
          </span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-cocoa">
            {dict.contact.phone} *
          </span>
          <input
            required
            type="tel"
            placeholder="+998 __ ___ __ __"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-cocoa">
          {dict.contact.email}
        </span>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-cocoa">
          {dict.contact.message} *
        </span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-espresso py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-espresso-light disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "sending" ? dict.contact.sending : dict.contact.send}
      </button>

      {status === "success" && (
        <p className="text-sm font-medium text-green-700">{dict.contact.success}</p>
      )}
      {status === "error" && (
        <p className="text-sm font-medium text-brand-red">{dict.contact.error}</p>
      )}
    </form>
  );
}
