"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { formatPhone, isValidPhone } from "@/lib/phone";
import type { Locale, Dictionary } from "@/lib/i18n";

type Step = "cart" | "form" | "success" | "error";

export default function CartDrawer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { isOpen, closeCart, resolved, setQty, remove, total, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [sending, setSending] = useState(false);
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", company: "", comment: "" });

  useEffect(() => {
    if (isOpen) setStep("cart");
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: formatPhone(form.phone),
          locale,
          items: resolved.map(({ product, qty }) => ({ id: product.id, qty })),
        }),
      });
      if (!res.ok) throw new Error("order failed");
      const data = (await res.json()) as { payUrl?: string | null };
      setPayUrl(data.payUrl ?? null);
      clear();
      setStep("success");
    } catch {
      setStep("error");
    } finally {
      setSending(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close"
        onClick={closeCart}
        className="absolute inset-0 bg-espresso/50 backdrop-blur-sm"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-espresso/10 px-6 py-4">
          <h2 className="font-display text-xl font-bold">
            {step === "form" ? dict.cart.orderTitle : dict.cart.title}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close"
            className="rounded-full p-2 transition-colors hover:bg-cream"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {step === "cart" && (
          <>
            {resolved.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="font-display text-lg font-bold">{dict.cart.empty}</p>
                <p className="text-sm text-cocoa">{dict.cart.emptyText}</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {resolved.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="flex gap-4 border-b border-espresso/8 py-4"
                    >
                      <div className="relative h-20 w-16 shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{product.name}</p>
                        <p className="text-xs text-cocoa">{product.packSize}</p>
                        <p className="mt-1 text-sm font-medium">
                          {formatPrice(product.price)} {dict.currency}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center rounded-full border border-espresso/15">
                            <button
                              onClick={() => setQty(product.id, qty - 1)}
                              className="px-3 py-1 text-sm"
                              aria-label="−"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-sm">{qty}</span>
                            <button
                              onClick={() => setQty(product.id, qty + 1)}
                              className="px-3 py-1 text-sm"
                              aria-label="+"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => remove(product.id)}
                            className="text-xs text-brand-red underline-offset-2 hover:underline"
                          >
                            {dict.cart.remove}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-espresso/10 px-6 py-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-cocoa">{dict.cart.total}</span>
                    <span className="font-display text-xl font-bold">
                      {formatPrice(total)} {dict.currency}
                    </span>
                  </div>
                  <button
                    onClick={() => setStep("form")}
                    className="w-full rounded-full bg-espresso py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-espresso-light"
                  >
                    {dict.cart.checkout}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {step === "form" && (
          <form onSubmit={submitOrder} className="flex flex-1 flex-col overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-cocoa">
                  {dict.cart.name} *
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-espresso"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-cocoa">
                  {dict.cart.phone} *
                </span>
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  placeholder="+998 99 123 45 67"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                  onInvalid={(e) => e.currentTarget.setCustomValidity(isValidPhone(form.phone) ? "" : "+998 99 123 45 67")}
                  onInput={(e) => e.currentTarget.setCustomValidity("")}
                  pattern="\+998 \d{2} \d{3} \d{2} \d{2}"
                  className="w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-espresso"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-cocoa">
                  {dict.cart.company}
                </span>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-espresso"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-cocoa">
                  {dict.cart.comment}
                </span>
                <textarea
                  rows={3}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full resize-none rounded-xl border border-espresso/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-espresso"
                />
              </label>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-espresso/10 pt-4">
              <span className="text-sm text-cocoa">{dict.cart.total}</span>
              <span className="font-display text-xl font-bold">
                {formatPrice(total)} {dict.currency}
              </span>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="mt-4 w-full rounded-full bg-brand-red py-3.5 text-sm font-semibold tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {sending ? dict.cart.sending : dict.cart.submit}
            </button>
          </form>
        )}

        {(step === "success" || step === "error") && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            {step === "success" ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-espresso text-cream">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-display text-xl font-bold">{dict.cart.successTitle}</p>
                <p className="text-sm text-cocoa">
                  {payUrl ? dict.cart.payHint : dict.cart.successText}
                </p>
                {payUrl && (
                  <a
                    href={payUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full rounded-full bg-[#2AABEE] py-3.5 text-center text-sm font-semibold tracking-wide text-white transition-opacity hover:opacity-90"
                  >
                    {dict.cart.payInTelegram}
                  </a>
                )}
              </>
            ) : (
              <p className="text-sm text-brand-red">{dict.cart.errorText}</p>
            )}
            <button
              onClick={closeCart}
              className="mt-3 rounded-full border border-espresso/20 px-6 py-2.5 text-sm font-medium transition-colors hover:border-espresso"
            >
              {dict.cart.continueShopping}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
