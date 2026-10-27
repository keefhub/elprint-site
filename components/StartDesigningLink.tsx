"use client";

import Link from "next/link";
import { productBySlug, type MethodId } from "@/lib/catalog";
import { defaultConfig, normaliseConfig } from "@/lib/pricing";
import { draftsStore, labStore } from "@/lib/store";

/** Opens the Design Lab with a product and print method already chosen. */
export function StartDesigningLink({
  slug, method, className = "btn btn-primary btn-lg", children,
}: { slug: string; method?: MethodId; className?: string; children: React.ReactNode }) {
  function prime() {
    const product = productBySlug[slug];
    if (!product) return;
    draftsStore.set((d) => {
      const base = normaliseConfig(product, d[slug]);
      const picked = defaultConfig(product, method);
      return { ...d, [slug]: { ...base, method: picked.method, qty: picked.qty } };
    });
    labStore.set({ slug });
  }
  return <Link href="/design/" onClick={prime} className={className}>{children}</Link>;
}
