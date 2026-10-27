import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { COURIER_FEE, SINGPOST_FEE, SINGPOST_MAX_PIECES, sgd } from "@/lib/pricing";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Delivery and collection",
  description: "Courier delivery across Singapore, free self-collection at Braddell Tech, or SingPost registered post.",
};

export default function DeliveryPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Delivery & collection" }]} />
      <PageHeader title="Delivery and collection" lead="Three ways to get your order. Delivery covers all of Singapore." />
      <div className="wrap pb-16">
        <div className="scroll-x">
          <table className="data-table min-w-[640px]">
            <caption>Delivery options</caption>
            <thead><tr><th scope="col">Option</th><th scope="col">Cost</th><th scope="col">Good to know</th></tr></thead>
            <tbody>
              <tr><th scope="row">Courier</th><td className="price font-normal">{sgd(COURIER_FEE)} per trip</td><td>Book 2 days in advance. Island-wide.</td></tr>
              <tr><th scope="row">Self-collection</th><td className="price font-normal">Free</td><td>Collect at Braddell Tech, Toa Payoh. Weekdays only.</td></tr>
              <tr><th scope="row">SingPost</th><td className="price font-normal">{sgd(SINGPOST_FEE)}</td><td>For {SINGPOST_MAX_PIECES} pieces or fewer. Sent by registered post.</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <section aria-labelledby="area-h">
            <h2 id="area-h" className="text-2xl">Delivery area</h2>
            <p className="mt-2">Island-wide Singapore. The courier fee is the same wherever you are on the island.</p>
            <p className="mt-2">Add your postal code in the <Link href="/cart/">cart</Link> to see your delivery cost before you check out.</p>
          </section>
          <section aria-labelledby="pickup-h">
            <h2 id="pickup-h" className="text-2xl">Pick up from us</h2>
            <address className="mt-2 not-italic">
              {business.addressLines.map((l) => <span key={l} className="block">{l}</span>)}
            </address>
            <p className="mt-2">{business.hours}</p>
            <p className="caption">{business.hoursNote}</p>
            <a href={business.mapLink} className="btn btn-secondary mt-3" target="_blank" rel="noreferrer">Open in Google Maps</a>
          </section>
        </div>

        <section className="mt-12 max-w-3xl" aria-labelledby="dfaq-h">
          <h2 id="dfaq-h" className="mb-4 text-2xl">Delivery questions</h2>
          <FaqList items={[
            { q: "What if my parcel is lost?", a: <p>Tell us on WhatsApp or by email as soon as you notice. For courier and SingPost orders we trace the parcel with the carrier. If it can&apos;t be found, we reprint your order at no cost to you.</p> },
            { q: "What if my delivery is delayed?", a: <p>Message us on WhatsApp with your order reference. We check with the courier and tell you the new delivery time. Delays are most common around public holidays.</p> },
            { q: "Do you deliver on weekends?", a: <p>No. We are closed on weekends and public holidays, so deliveries go out on weekdays only. Book your courier at least 2 days ahead.</p> },
            { q: "Can someone else collect my order?", a: <p>Yes. Send us their name and your order reference before collection day. They should bring ID.</p> },
          ]} />
        </section>
      </div>
    </>
  );
}
