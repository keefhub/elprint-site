import type { Metadata } from "next";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, WhatsApp, email or visit EL Print at Braddell Tech, Toa Payoh.",
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <PageHeader title="Contact us" lead="Ask for a quote, get help with artwork, or check on an order. WhatsApp is the fastest way." />
      <div className="wrap grid gap-12 pb-16 lg:grid-cols-[1fr_400px]">
        <div>
          <h2 className="mb-6 text-2xl">Send a message</h2>
          <ContactForm />
        </div>

        <aside aria-label="Contact details" className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl">EL Print Pte Ltd</h2>
            <ul className="mt-4 space-y-1">
              <li className="flex gap-3"><Icon name="map-pin" className="mt-3" /><address className="py-2 not-italic">{business.addressLines.map((l) => <span key={l} className="block">{l}</span>)}</address></li>
              <li><a href={business.phoneHref} className="flex min-h-11 items-center gap-3"><Icon name="phone" />{business.phone}</a></li>
              <li><a href={business.whatsappHref} className="flex min-h-11 items-center gap-3"><Icon name="message" />WhatsApp {business.whatsapp}</a></li>
              <li><a href={business.emailHref} className="flex min-h-11 items-center gap-3"><Icon name="mail" />{business.email}</a></li>
              <li className="flex gap-3"><Icon name="clock" className="mt-3" /><span className="py-2">{business.hours}<span className="caption block">{business.hoursNote}</span></span></li>
            </ul>
          </div>
          <div>
            <iframe
              title="Map showing EL Print at Braddell Tech, Toa Payoh"
              src={business.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-lg border border-line"
            />
            <a href={business.mapLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center">Open in Google Maps</a>
          </div>
        </aside>
      </div>
    </>
  );
}
