import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { PriceCalculator } from "@/components/PriceCalculator";
import { RUSH_FEE, methods } from "@/lib/catalog";
import { COURIER_FEE, sgd } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Print prices, setup fees, minimum orders and turnaround for every printing method. Plus an instant price calculator.",
};

export default function PricingPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Pricing" }]} />
      <PageHeader title="Pricing" lead="Plain prices for every print method. Use the calculator for an instant estimate." />
      <div className="wrap pb-16">
        <div className="scroll-x">
          <table className="data-table min-w-[820px]">
            <caption>Print prices are per piece, for a front print, on top of the garment price. Prices fall as quantity rises.</caption>
            <thead>
              <tr>
                <th scope="col">Print method</th>
                <th scope="col">Best for</th>
                <th scope="col">Min order</th>
                <th scope="col">Setup fee</th>
                <th scope="col">Print price per piece (from)</th>
                <th scope="col">Turnaround</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <tr key={m.id}>
                  <th scope="row"><Link href={`/services/${m.id}/`}>{m.name}</Link></th>
                  <td>{m.bestFor}</td>
                  <td>{m.minQty === 1 ? "None" : `${m.minQty} pieces`}</td>
                  <td>{m.setupFee ? `${sgd(m.setupFee)} per location` : "None"}</td>
                  <td className="price font-normal">
                    {m.id === "banners-stickers" ? "In product price" : sgd(Math.min(...m.tiers.map((t) => t.price)))}
                  </td>
                  <td>{m.turnaround}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="caption mt-3">Final price is confirmed after artwork review. Garment prices are on each product page.</p>

        <section className="mt-16" aria-labelledby="calc-h">
          <h2 id="calc-h">Price calculator</h2>
          <p className="mt-2 max-w-2xl">Pick a garment, a print method and a quantity. The estimate includes the garment and a front print.</p>
          <div className="mt-6"><PriceCalculator /></div>
        </section>

        <section className="mt-16 max-w-3xl" aria-labelledby="extras-h">
          <h2 id="extras-h">Extras</h2>
          <ul className="mt-4 list-disc space-y-1 pl-6">
            <li>Extra print locations: back adds 80% and sleeve adds 50% of the front-print price per piece.</li>
            <li>Rush on DTG and digital heat transfer: ready in 2 working days after proof approval for {sgd(RUSH_FEE)} per order.</li>
            <li>Courier delivery is {sgd(COURIER_FEE)} per trip. Self-collection is free. See <Link href="/delivery/">delivery</Link>.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
