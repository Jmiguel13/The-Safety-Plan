// src/lib/checkout.ts
export async function startDonation(amount: number, quantity = 1): Promise<void> {
  const res = await fetch("/api/checkout/donate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, quantity }),
  });

  const data: { url?: string; error?: string } = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Unable to start donation");
  if (!data.url) throw new Error("No checkout URL returned");
  window.location.href = data.url;
}

export async function buyNow(priceId: string, quantity = 1): Promise<void> {
  const res = await fetch("/api/checkout/kit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      priceId,
      quantity,
      successPath: "/shop/success?session_id={CHECKOUT_SESSION_ID}",
      cancelPath: "/shop",
    }),
  });

  const data: { url?: string; error?: string } = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Unable to start checkout");
  if (!data.url) throw new Error("No checkout URL returned");
  window.location.href = data.url;
}
