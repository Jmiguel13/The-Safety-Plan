"use client";

type Item = { sku: string; qty?: number };

export default function CopySkus({ items }: { items: Item[] }) {
  const text = items.map(i => `${i.sku} x${i.qty ?? 1}`).join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("All SKUs copied.");
    } catch {
      // ignore
    }
  };

  return (
    <button onClick={copy} className="btn btn-ghost">
      Copy All SKUs
    </button>
  );
}
