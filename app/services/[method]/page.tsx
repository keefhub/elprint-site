import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Garment } from "@/components/Garment";
import { Icon } from "@/components/Icon";
import { StartDesigningLink } from "@/components/StartDesigningLink";
import { methodById, methods, products, type MethodId } from "@/lib/catalog";
import { sgd } from "@/lib/pricing";

type Props = { params: Promise<{ method: string }> };

const startProduct: Record<MethodId, string> = {
  dtg: "heavy-cotton-tee",
  silkscreen: "heavy-cotton-tee",
  embroidery: "pique-polo",
  dht: "heavy-cotton-tee",
  sublimation: "dry-fit-sports-tee",
  "banners-stickers": "vinyl-banner",
};

export function generateStaticParams() {
  return methods.map((m) => ({ method: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { method } = await params;
  const m = methodById[method as MethodId];
  return m ? { title: m.name, description: m.summary } : {};
}

export default async function ServicePage({ params }: Props) {
  const { method } = await params;
  const m = methodById[method as MethodId];
  if (!m) notFound();
  const sample = products.find((p) => p.slug === startProduct[m.id])!;
  const available = products.filter((p) => p.methods.includes(m.id));

  return (
    <>
      <Breadcrumbs items={[{ label: "Services", href: "/services/" }, { label: m.name }]} />
      <div className="wrap grid items-center gap-8 pb-12 pt-2 lg:grid-cols-2 lg:gap-16">
        <div>
          <Icon name={m.icon} size={32} />
          <h1 className="mt-3">{m.name}</h1>
          <p className="lead mt-3">{m.what}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <StartDesigningLink slug={sample.slug} method={m.id}>Start designing with {m.name}</StartDesigningLink>
            <Link href="/pricing/" className="btn btn-secondary btn-lg">See pricing</Link>
          </div>
        </div>
        <div className="crop rounded-lg bg-surface" style={{ ["--crop-inset" as string]: "16px" }}>
          <Garment
            kind={sample.kind} color={sample.colors[0].hex} view="detail" text={m.id === "banners-stickers" ? "Grand Opening" : "Your logo"} method={m.id}
            label={`Close-up of a ${m.name} print on a ${sample.name}`} className="aspect-square w-full p-6"
          />
        </div>
      </div>

      <div className="wrap grid gap-8 pb-12 md:grid-cols-2">
        <section className="card p-6" aria-labelledby="pros-h">
          <h2 id="pros-h" className="text-xl">What works well</h2>
          <ul className="mt-3 space-y-2">
            {m.pros.map((p) => <li key={p} className="flex gap-2"><Icon name="check" size={20} className="mt-0.5" /><span>{p}</span></li>)}
          </ul>
        </section>
        <section className="card p-6" aria-labelledby="cons-h">
          <h2 id="cons-h" className="text-xl">What to keep in mind</h2>
          <ul className="mt-3 space-y-2">
            {m.cons.map((p) => <li key={p} className="flex gap-2"><Icon name="minus" size={20} muted className="mt-0.5" /><span>{p}</span></li>)}
          </ul>
        </section>
      </div>

      <div className="wrap pb-16 lg:grid lg:grid-cols-2 lg:gap-8">
        <section aria-labelledby="facts-h">
          <h2 id="facts-h" className="text-xl">Quick facts</h2>
          <table className="data-table mt-4">
            <tbody>
              <tr><th scope="row">Ideal order size</th><td>{m.idealOrders}</td></tr>
              <tr><th scope="row">Best garments</th><td>{m.garments}</td></tr>
              <tr><th scope="row">Minimum order</th><td>{m.minQty === 1 ? "None" : `${m.minQty} pieces`}</td></tr>
              <tr><th scope="row">Setup fee</th><td>{m.setupFee ? `${sgd(m.setupFee)} per print location` : "None"}</td></tr>
              <tr><th scope="row">Print price per piece</th><td>{m.id === "banners-stickers" ? "Included in the product price" : `From ${sgd(Math.min(...m.tiers.map((t) => t.price)))}`}</td></tr>
              <tr><th scope="row">Turnaround</th><td>{m.turnaround}{m.rushTurnaround ? `, or ${m.rushTurnaround} with rush` : ""}, after proof approval</td></tr>
              <tr><th scope="row">Artwork</th><td>{m.artwork}</td></tr>
            </tbody>
          </table>
        </section>

        <section aria-labelledby="avail-h" className="mt-8 lg:mt-0">
          <h2 id="avail-h" className="text-xl">Available on</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {available.map((p) => (
              <li key={p.slug}>
                <Link href={`/shop/${p.slug}/`} className="flex min-h-11 items-center justify-between py-2 text-ink no-underline hover:text-teal">
                  {p.name}<Icon name="chevron-right" muted />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4"><Link href="/pricing/">Compare with other methods on the pricing page.</Link></p>
        </section>
      </div>
    </>
  );
}
