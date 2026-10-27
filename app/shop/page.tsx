import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { Garment } from "@/components/Garment";
import { ShopBrowser } from "@/components/ShopBrowser";
import { categories, products, productsIn } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description: "Printed T-shirts, hoodies, jackets, banners and stickers. Prices from S$ per piece.",
};

export default function ShopPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Shop" }]} />
      <PageHeader title="Shop" lead="Pick a garment, then choose how to print it. Every price shows what it depends on." />
      <ul className="wrap mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => {
          const items = productsIn(c.id);
          const first = items[0];
          return (
            <li key={c.id} className="group relative overflow-hidden rounded-lg border border-line bg-white hover:border-teal focus-within:border-teal">
              <Garment kind={first.kind} color={first.colors[0].hex} accent={first.accent} placeholder={false}
                label={`${first.colors[0].name} ${first.name}`} className="aspect-[4/3] w-full bg-surface p-4" />
              <div className="p-4">
                <h2 className="text-xl"><Link href={`/shop/${c.id}/`} className="text-ink no-underline after:absolute after:inset-0 hover:text-teal">{c.name}</Link></h2>
                <p className="caption">{items.length} items</p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="wrap"><h2 className="mb-4">All products</h2></div>
      <ShopBrowser products={products} />
    </>
  );
}
