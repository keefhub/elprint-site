import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { FaqList, type FaqItem } from "@/components/FaqList";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Minimum orders, turnaround, artwork files, payment, cancellation and the proof process.",
};

const groups: { title: string; items: FaqItem[] }[] = [
  {
    title: "Ordering",
    items: [
      { q: "What is the minimum order?", a: <p>DTG and digital heat transfer have no minimum, so one piece is fine. Embroidery starts at 6 pieces and silkscreen at 24. See <Link href="/pricing/">pricing</Link> for each method.</p> },
      { q: "Do I need an account?", a: <p>No. You can browse, build an order and check out as a guest.</p> },
      { q: "Can I order a mix of sizes?", a: <p>Yes. Add each size to your cart as its own line, or list the sizes in the special instructions at checkout.</p> },
    ],
  },
  {
    title: "Artwork",
    items: [
      { q: "Which file types can I upload?", a: <p>PNG, JPG, PDF, AI and EPS, up to 50 MB each. Vector files (AI, EPS, PDF) give the cleanest result for silkscreen and embroidery.</p> },
      { q: "What resolution should my artwork be?", a: <p>300 DPI at the size you want printed. A transparent background works best for PNG files.</p> },
      { q: "I don't have artwork. Can you help?", a: <p>Tell us what you have in mind through the <Link href="/contact/">contact form</Link> or on WhatsApp. We can recreate a simple logo or lay out text for you.</p> },
    ],
  },
  {
    title: "Proof and payment",
    items: [
      { q: "How does proof approval work?", a: <ol className="list-decimal pl-5"><li>We check your artwork and confirm the price within 1–2 working days.</li><li>We email a digital proof showing the print on the garment.</li><li>You approve it or ask for changes.</li><li>You pay, and we start printing.</li></ol> },
      { q: "When do I pay?", a: <p>After you approve the proof. Nothing is charged when you submit an order or a quote request.</p> },
      { q: "What payment methods do you accept?", a: <p>We confirm payment options, such as PayNow and bank transfer, when we send your proof. Ask us on WhatsApp if you need a specific method.</p> },
    ],
  },
  {
    title: "Turnaround and delivery",
    items: [
      { q: "How long does printing take?", a: <p>DTG and heat transfer take 3–5 working days, sublimation 5–7, and silkscreen and embroidery 7–10. Days are counted from proof approval. DTG and heat transfer also have a 2-day rush option.</p> },
      { q: "How do I get my order?", a: <p>Courier across Singapore, free self-collection at Braddell Tech, or SingPost for 1–4 pieces. See <Link href="/delivery/">delivery</Link>.</p> },
    ],
  },
  {
    title: "Changes and cancellation",
    items: [
      { q: "Can I cancel my order?", a: <p>Yes, any time before you approve the proof, at no cost. After approval, printing starts and we can&apos;t cancel it. Contact us right away if something is wrong and we will do what we can.</p> },
      { q: "What if there is a printing fault?", a: <p>Tell us within 7 days of receiving your order, with photos. If the fault is ours, we reprint or refund the affected pieces.</p> },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <PageHeader title="Frequently asked questions" lead="Quick answers about orders, artwork, proofs and delivery." />
      <div className="wrap pb-16">
        <div className="max-w-3xl space-y-12">
          {groups.map((g) => (
            <section key={g.title} aria-labelledby={`g-${g.title}`}>
              <h2 id={`g-${g.title}`} className="mb-4 text-2xl">{g.title}</h2>
              <FaqList items={g.items} />
            </section>
          ))}
        </div>
        <div className="card mt-12 p-6">
          <h2 className="text-xl">Still stuck?</h2>
          <p className="mt-1">We reply on weekdays, {business.hours}.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={business.whatsappHref} className="btn btn-primary">WhatsApp us</a>
            <a href={business.phoneHref} className="btn btn-secondary">Call {business.phone}</a>
          </div>
        </div>
      </div>
    </>
  );
}
