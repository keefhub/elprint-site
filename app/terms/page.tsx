import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { business } from "@/lib/site";

export const metadata: Metadata = { title: "Terms and conditions" };

const toc = ["Orders and quotes", "Artwork and copyright", "Proofs", "Prices and payment", "Production and delivery", "Cancellation and changes", "Faults and returns", "Liability", "Contact us"];

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Terms and conditions" }]} />
      <PageHeader title="Terms and conditions" lead="The rules for ordering from EL Print." />
      <div className="wrap pb-16">
        <p className="caption mb-6">Last updated 28 October 2026. Draft pending legal review before launch.</p>
        <nav aria-label="On this page" className="mb-8">
          <h2 className="text-lg">On this page</h2>
          <ul className="mt-2">
            {toc.map((t) => (
              <li key={t}><a href={`#${t.toLowerCase().replace(/\W+/g, "-")}`} className="inline-flex min-h-11 items-center">{t}</a></li>
            ))}
          </ul>
        </nav>
        <div className="prose-page">
          <h2 id="orders-and-quotes" className="mt-0!">Orders and quotes</h2>
          <p>These terms apply to every order with {business.legalName}. Submitting an order or quote request is not a binding purchase. An order is confirmed when you approve the proof and pay.</p>

          <h2 id="artwork-and-copyright">Artwork and copyright</h2>
          <ul>
            <li>You confirm you own the artwork, or have permission to print it.</li>
            <li>We may refuse artwork that is unlawful, infringing or offensive.</li>
            <li>You are responsible for the content and spelling of your artwork once you approve the proof.</li>
          </ul>

          <h2 id="proofs">Proofs</h2>
          <p>We send a digital proof before printing. Colours on screen can differ slightly from the printed result. Printing starts only after you approve the proof.</p>

          <h2 id="prices-and-payment">Prices and payment</h2>
          <ul>
            <li>Prices are in Singapore dollars (S$). Prices shown on the website are estimates until we review your artwork.</li>
            <li>The final price is confirmed with your proof. Payment is due after you approve it.</li>
            <li>Setup fees apply once per design and print location where stated.</li>
          </ul>

          <h2 id="production-and-delivery">Production and delivery</h2>
          <p>Turnaround times start from proof approval and payment, and count working days (Monday to Friday, excluding public holidays). They are estimates. See <Link href="/delivery/">delivery</Link> for fees and options. Courier deliveries must be booked at least 2 days ahead.</p>

          <h2 id="cancellation-and-changes">Cancellation and changes</h2>
          <p>You can cancel at no cost before you approve the proof. After approval, printing starts and the order can&apos;t be cancelled or changed, because each item is made to order.</p>

          <h2 id="faults-and-returns">Faults and returns</h2>
          <p>Tell us within 7 days of receipt, with photos, if an item has a printing fault or is the wrong item. If the fault is ours, we reprint or refund the affected pieces. We can&apos;t accept returns for items printed exactly as proofed.</p>

          <h2 id="liability">Liability</h2>
          <p>Our liability for any order is limited to the amount you paid for it. We are not liable for loss caused by delays outside our control, such as courier delays or supplier shortages.</p>

          <h2 id="contact-us">Contact us</h2>
          <p>Email <a href={business.emailHref}>{business.email}</a> or call <a href={business.phoneHref}>{business.phone}</a>.</p>
        </div>
      </div>
    </>
  );
}
