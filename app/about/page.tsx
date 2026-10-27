import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description: "EL Print is a custom apparel printer at Braddell Tech in Toa Payoh, Singapore.",
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "About us" }]} />
      <PageHeader title="About EL Print" lead="A custom apparel printer in Toa Payoh. We print what you design, in the quantity you need." />
      <div className="wrap pb-16">
        <div className="prose-page">
          <h2 className="mt-0!">What we do</h2>
          <p>EL Print Pte Ltd prints T-shirts, hoodies and jackets for teams, schools, companies and individuals across Singapore. We also print banners and stickers.</p>
          <ul>
            <li>DTG, silkscreen, embroidery, digital heat transfer and dye sublimation, all under one roof.</li>
            <li>One piece or a few hundred. DTG has no minimum.</li>
            <li>A digital proof for every order. You pay after you approve it.</li>
          </ul>

          <h2>Where to find us</h2>
          <p>We work from a unit in Braddell Tech, a light-industrial building in Toa Payoh. You can drop off artwork, check a garment and collect your order here.</p>
          <p>
            {business.addressLines.map((l) => <span key={l} className="block">{l}</span>)}
          </p>
          <p>{business.hours}. {business.hoursNote}.</p>

          <h2>Garments we carry</h2>
          <p>We stock {business.brands.join(", ")}. Each product page lists the fabric weight, fit and care so you know what you are ordering.</p>

          <h2>Our commitment to you</h2>
          <ul>
            <li>Prices, minimums and turnaround are shown before you order.</li>
            <li>No payment until you approve the digital proof.</li>
            <li>Real people answer on WhatsApp, by phone and by email during opening hours.</li>
          </ul>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop/" className="btn btn-primary btn-lg">Shop products</Link>
          <Link href="/contact/" className="btn btn-secondary btn-lg">Contact us</Link>
        </div>
      </div>
    </>
  );
}
