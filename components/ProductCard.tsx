"use client";

import Link from "next/link";
import { useState } from "react";
import { methodById, type Product } from "@/lib/catalog";
import { defaultConfig, fromPrice, sgd } from "@/lib/pricing";
import { addToCart } from "@/lib/store";
import { Garment } from "./Garment";

export function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const color = product.colors[0];
  const verb = product.quoteOnly ? "Request quote" : "Add to cart";

  function quickAdd() {
    addToCart(product.slug, defaultConfig(product));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <li className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-white focus-within:border-teal hover:border-teal">
      <div className="relative bg-surface">
        <Garment
          kind={product.kind} color={color.hex} accent={product.accent} placeholder={false}
          label={`${color.name} ${product.name}, front view`} className="aspect-square w-full p-4"
        />
        {product.badges.length > 0 && (
          <ul className="absolute left-3 top-3 flex flex-wrap gap-1" aria-label="Tags">
            {product.badges.slice(0, 2).map((b) => <li key={b} className="badge">{b}</li>)}
          </ul>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg">{product.name}</h3>
        <p className="price text-lg">
          <span className="caption mr-1 font-normal">From</span>{sgd(fromPrice(product))}
        </p>
        <p className="caption">{product.methods.map((m) => methodById[m].name).join(", ")}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 pt-2">
          <Link href={`/shop/${product.slug}/`} className="btn btn-ghost -ml-3 after:absolute after:inset-0">
            View product<span className="sr-only">: {product.name}</span>
          </Link>
          <button type="button" onClick={quickAdd} className="btn btn-secondary card-action relative z-10">
            {added ? "Added" : verb}
            <span className="sr-only">: {product.name}</span>
          </button>
        </div>
        <span role="status" className="sr-only">{added ? `${product.name} added to cart` : ""}</span>
      </div>
    </li>
  );
}
