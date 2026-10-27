import Link from "next/link";
import { Garment } from "@/components/Garment";
import { HeroProof } from "@/components/HeroProof";
import { Icon } from "@/components/Icon";
import { StartDesigningLink } from "@/components/StartDesigningLink";
import { categories, methods, productsIn } from "@/lib/catalog";
import { business } from "@/lib/site";

const trust = [
  { icon: "shirt", text: "No minimum order (DTG)" },
  { icon: "zap", text: "2-day turnaround available" },
  { icon: "truck", text: "Island-wide delivery" },
  { icon: "message", text: "WhatsApp support" },
] as const;

const steps = [
  { title: "Choose a product", text: "Tees, hoodies, jackets, banners or stickers." },
  { title: "Select a print method", text: "We show the price, minimum and turnaround for each." },
  { title: "Upload your artwork", text: "PNG, JPG, PDF, AI or EPS up to 50 MB." },
  { title: "Approve the proof and pay", text: "You pay only after you approve the digital proof." },
];

export default function Home() {
  return (
    <>
      <section className="wrap grid items-center gap-8 pb-8 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-16 lg:pt-16">
        <div>
          <h1 className="display">
            <span className="block">Custom T-shirt printing in Singapore.</span>
            <span className="block">Fast, affordable, no minimum for DTG</span>
          </h1>
          <p className="lead mt-6 max-w-xl">
            DTG prints full colour from a single piece, with no setup fee. Order 24 or more and silkscreen brings the price per piece down.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <StartDesigningLink slug="heavy-cotton-tee" method="dtg">Start designing</StartDesigningLink>
            <Link href="/pricing/" className="btn btn-secondary btn-lg">View pricing</Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3 sm:max-w-xl">
            {trust.map((t) => (
              <li key={t.text} className="flex items-center gap-2 text-sm font-semibold">
                <Icon name={t.icon} size={24} />{t.text}
              </li>
            ))}
          </ul>
        </div>
        <HeroProof />
      </section>

      <section className="section border-t border-line" aria-labelledby="services-h">
        <div className="wrap">
          <h2 id="services-h">Six ways to print it</h2>
          <p className="lead mt-2 max-w-2xl">Each method suits a different order size and fabric. Not sure? <Link href="/services/">Compare them side by side</Link>.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {methods.map((m) => (
              <li key={m.id} className="card is-link relative p-6">
                <Icon name={m.icon} />
                <h3 className="mt-3">{m.name}</h3>
                <p className="mt-1">{m.tile}</p>
                <Link href={`/services/${m.id}/`} className="btn btn-ghost -ml-3 mt-3 after:absolute after:inset-0">
                  Learn more<span className="sr-only"> about {m.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="shop-h">
        <div className="wrap">
          <h2 id="shop-h">Shop by category</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => {
              const items = productsIn(c.id);
              const first = items[0];
              return (
                <li key={c.id} className="group relative overflow-hidden rounded-lg border border-line bg-white hover:border-teal focus-within:border-teal">
                  <Garment
                    kind={first.kind} color={first.colors[0].hex} accent={first.accent} placeholder={false}
                    label={`${first.colors[0].name} ${first.name}`} className="aspect-[4/3] w-full bg-surface p-4"
                  />
                  <div className="p-4">
                    <h3><Link href={`/shop/${c.id}/`} className="text-ink no-underline after:absolute after:inset-0 hover:text-teal">{c.name}</Link></h3>
                    <p className="caption">{items.length} {items.length === 1 ? "item" : "items"}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="how-h">
        <div className="wrap">
          <h2 id="how-h">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="relative md:pr-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-lg font-bold text-white" aria-hidden="true">{i + 1}</span>
                <h3 className="mt-3"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
                <p className="mt-1">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <StartDesigningLink slug="heavy-cotton-tee" method="dtg">Start designing</StartDesigningLink>
            <p className="caption">You pay only after you approve the proof.</p>
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-surface" aria-labelledby="find-h">
        <div className="wrap grid gap-8 md:grid-cols-2">
          <div>
            <h2 id="find-h">Visit our shop in Toa Payoh</h2>
            <address className="mt-4 not-italic">
              {business.addressLines.map((l) => <span key={l} className="block">{l}</span>)}
            </address>
            <p className="mt-3">{business.hours}</p>
            <p className="caption">{business.hoursNote}</p>
          </div>
          <div className="flex flex-wrap content-start gap-3">
            <a href={business.whatsappHref} className="btn btn-primary btn-lg">Chat on WhatsApp</a>
            <a href={business.phoneHref} className="btn btn-secondary btn-lg">Call {business.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
