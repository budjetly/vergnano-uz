"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/products";
import type { Dictionary } from "@/lib/i18n";

export default function ProductBuyBox({
  product,
  dict,
}: {
  product: Product;
  dict: Dictionary;
}) {
  const { add, setQty: setCartQty, items, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      setCartQty(product.id, existing.qty + qty);
    } else {
      add(product.id);
      if (qty > 1) setCartQty(product.id, qty);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    openCart();
  }

  const addButton = (extraClass = "") => (
    <button
      onClick={handleAdd}
      className={`rounded-full bg-espresso px-8 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-espresso-light ${extraClass}`}
    >
      {justAdded ? `✓ ${dict.products.added}` : dict.products.addToCart}
    </button>
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(42,27,18,0.08)]">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-cocoa">
              {product.packSize}
            </p>
            <p className="font-display text-3xl font-bold">
              {formatPrice(product.price)}{" "}
              <span className="text-sm font-normal text-cocoa">{dict.currency}</span>
            </p>
          </div>
          <div className="flex items-center rounded-full border border-espresso/15">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-4 py-2 text-lg"
              aria-label="−"
            >
              −
            </button>
            <span className="min-w-8 text-center font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="px-4 py-2 text-lg"
              aria-label="+"
            >
              +
            </button>
          </div>
        </div>
        {addButton("mt-5 w-full")}
    </div>
  );
}
