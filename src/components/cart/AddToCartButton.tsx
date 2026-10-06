"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import type { CartItem } from "@/types";

export function AddToCartButton({
  item,
  sold,
  className,
}: {
  item: CartItem;
  sold?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const [message, setMessage] = useState<string | null>(null);

  if (sold || item.stock <= 0) {
    return (
      <p className="text-sm uppercase tracking-[0.18em] text-taupe">Móvel vendido</p>
    );
  }

  return (
    <div>
      <Button
        type="button"
        className={className ?? "w-full"}
        onClick={() => {
          const result = addItem(item);
          setMessage(result.message);
        }}
      >
        Adicionar à sacola
      </Button>
      {message ? (
        <p className="mt-3 text-xs tracking-wide text-taupe" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
