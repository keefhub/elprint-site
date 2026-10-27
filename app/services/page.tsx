import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { methods } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Printing services",
  description: "DTG, silkscreen, embroidery, digital heat transfer, dye sublimation, banners and stickers. Compare methods.",
};

const chooser = [
  { need: "1 to 23 pieces, full colour on cotton", pick: "dtg", name: "DTG" },
  { need: "24 or more pieces with simple colours", pick: "silkscreen", name: "Silkscreen" },
  { need: "A logo on polos or jackets", pick: "embroidery", name: "Embroidery" },
  { need: "Polyester, nylon, names or numbers", pick: "dht", name: "Digital Heat Transfer" },
  { need: "Sports jerseys or an all-over design", pick: "sublimation", name: "Dye Sublimation" },
  { need: "Signs, event banners or labels", pick: "banners-stickers", name: "Banners & Stickers" },
];

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Services" }]} />
      <PageHeader title="Printing services" lead="Six ways to print. Pick by order size, fabric and the look you want." />
      <div className="wrap pb-16">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {methods.map((m) => (
            <li key={m.id} className="card is-link relative flex flex-col p-6">
              <Icon name={m.icon} />
              <h2 className="mt-3 text-2xl">{m.name}</h2>
              <p className="mt-1">{m.summary}</p>
              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted">Best for</dt><dd className="text-right">{m.bestFor}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Orders</dt><dd>{m.idealOrders}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Turnaround</dt><dd>{m.turnaround}</dd></div>
              </dl>
              <Link href={`/services/${m.id}/`} className="btn btn-ghost -ml-3 mt-auto self-start pt-2 after:absolute after:inset-0">
                Learn more<span className="sr-only"> about {m.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-16" aria-labelledby="choose-h">
          <h2 id="choose-h">Which method should I choose?</h2>
          <div className="scroll-x mt-6">
            <table className="data-table">
              <caption>Match what you need to a method.</caption>
              <thead><tr><th scope="col">If you need</th><th scope="col">Choose</th></tr></thead>
              <tbody>
                {chooser.map((c) => (
                  <tr key={c.pick}>
                    <th scope="row">{c.need}</th>
                    <td><Link href={`/services/${c.pick}/`}>{c.name}</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6">See the exact prices on the <Link href="/pricing/">pricing page</Link>.</p>
        </section>
      </div>
    </>
  );
}
