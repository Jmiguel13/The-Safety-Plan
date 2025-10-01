// src/components/KitDisclosure.tsx
export default function KitDisclosure() {
  return (
    <div className="rounded-md border border-yellow-300/40 bg-yellow-50/90 p-3 text-yellow-950">
      <strong className="font-semibold">Important:</strong>{" "}
      Kits are curated by Blank. Consumables included may be purchased from third-party
      manufacturers. If any item is repackaged by Blank, we clearly disclose that on this page
      and on the packing slip. Manufacturer guarantees may not apply once an item is repackaged.
      See <a href="/terms" className="underline">Terms of Sale</a> for details and returns.
    </div>
  );
}
