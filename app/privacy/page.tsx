import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { business } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Privacy policy" }]} />
      <PageHeader title="Privacy policy" lead="What we collect, why, and the choices you have." />
      <div className="wrap pb-16">
        <p className="caption mb-6">Last updated 28 October 2026. Draft pending legal review before launch.</p>
        <nav aria-label="On this page" className="mb-8">
          <h2 className="text-lg">On this page</h2>
          <ul className="mt-2">
            {["Who we are", "What we collect", "How we use it", "Data stored on your device", "Who we share it with", "How long we keep it", "Your choices", "Contact us"].map((t) => (
              <li key={t}><a href={`#${t.toLowerCase().replace(/\W+/g, "-")}`} className="inline-flex min-h-11 items-center">{t}</a></li>
            ))}
          </ul>
        </nav>
        <div className="prose-page">
          <h2 id="who-we-are" className="mt-0!">Who we are</h2>
          <p>{business.legalName} (&quot;EL Print&quot;, &quot;we&quot;) is based at {business.address}. This policy explains how we handle personal data in line with Singapore&apos;s Personal Data Protection Act 2012 (PDPA).</p>

          <h2 id="what-we-collect">What we collect</h2>
          <ul>
            <li>Contact details you give us: name, email, phone number and delivery address.</li>
            <li>Order details: products, quantities, print options and special instructions.</li>
            <li>Artwork files you send us.</li>
            <li>Messages you send through the contact form, email or WhatsApp.</li>
          </ul>

          <h2 id="how-we-use-it">How we use it</h2>
          <ul>
            <li>To prepare quotes and digital proofs, print your order and deliver it.</li>
            <li>To contact you about your order.</li>
            <li>To answer your questions and handle complaints.</li>
            <li>To meet our legal and accounting duties.</li>
          </ul>
          <p>We do not sell your personal data. We only send you marketing if you ask for it.</p>

          <h2 id="data-stored-on-your-device">Data stored on your device</h2>
          <p>This website saves your cart, design drafts and checkout details in your browser&apos;s local storage so you don&apos;t lose them. This data stays on your device until you clear it. It is not sent to us unless you choose to email or message us your order.</p>

          <h2 id="who-we-share-it-with">Who we share it with</h2>
          <p>We share your name, phone number and address with couriers and SingPost only to deliver your order. If you open the map on our contact page, Google receives your browser&apos;s request under its own privacy policy. We may disclose data where the law requires it.</p>

          <h2 id="how-long-we-keep-it">How long we keep it</h2>
          <p>We keep order records and artwork for as long as we need them to support reprints, warranty claims and our legal duties, then delete them.</p>

          <h2 id="your-choices">Your choices</h2>
          <p>You can ask us to tell you what personal data we hold, correct it, or delete it. You can also withdraw your consent to us using it. Email us and we will reply within 30 days.</p>

          <h2 id="contact-us">Contact us</h2>
          <p>Email <a href={business.emailHref}>{business.email}</a> or call <a href={business.phoneHref}>{business.phone}</a>. You can also use the <Link href="/contact/">contact form</Link>.</p>
        </div>
      </div>
    </>
  );
}
