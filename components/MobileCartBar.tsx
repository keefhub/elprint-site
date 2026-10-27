"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/catalog";
import { cartStore, useStore } from "@/lib/store";
import { Icon } from "./Icon";

/** Persistent bottom bar on shop listing pages (mobile only). Product pages bring their own. */
export function MobileCartBar() {
  const pathname = usePathname();
  const count = useStore(cartStore).length;
  const parts = pathname.split("/").filter(Boolean);
  const onListing =
    pathname === "/shop/" || (parts[0] === "shop" && parts.length === 2 && categories.some((c) => c.id === parts[1]));
  if (!onListing) return null;
  return (
    <>
      <div className="h-16 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-line bg-paper px-4 py-2 shadow-[0_-4px_12px_rgb(0_0_0/0.06)] md:hidden">
        <p className="flex items-center gap-2 font-semibold">
          <Icon name="cart" className="text-ink" />
          {count} {count === 1 ? "item" : "items"} in cart
        </p>
        <Link href="/cart/" className="btn btn-primary">View cart</Link>
      </div>
    </>
  );
}
