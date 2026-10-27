"use client";

import Link from "next/link";
import { business, mailtoLink, whatsappLink } from "@/lib/site";
import { sgd } from "@/lib/pricing";
import { orderStore, useStore, type Order } from "@/lib/store";
import { Icon } from "./Icon";

function orderText(o: Order) {
  const lines = o.lines.map((l) => `- ${l.qty} × ${l.name} (${l.options.join(", ")}) ${sgd(l.total)}${l.artwork ? ` [artwork: ${l.artwork}]` : ""}`);
  return [
    `${o.kind === "quote" ? "Quote request" : "Order"} ${o.id}`,
    "",
    ...lines,
    "",
    `Subtotal ${sgd(o.subtotal)}, delivery ${sgd(o.delivery)}, estimated total ${sgd(o.total)}`,
    "",
    `Name: ${o.customer.name}`,
    `Email: ${o.customer.email}`,
    `Phone: ${o.customer.phone}`,
    o.customer.mode === "collect" ? "Self-collection" : `Deliver to: ${o.customer.address}, Singapore ${o.customer.postal}`,
    o.customer.instructions ? `Notes: ${o.customer.instructions}` : "",
    "",
    "Artwork files are attached to this email.",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
}

export function Confirmation() {
  const order = useStore(orderStore);

  if (!order) {
    return (
      <div className="wrap pb-24">
        <div className="card max-w-xl p-8">
          <h2>No recent order on this device.</h2>
          <p className="mt-2">Orders are saved in this browser. Start a new one from the shop.</p>
          <Link href="/shop/" className="btn btn-primary mt-6">Browse products</Link>
        </div>
      </div>
    );
  }

  const body = orderText(order);
  const subject = `${order.kind === "quote" ? "Quote request" : "Order"} ${order.id}`;

  return (
    <div className="wrap pb-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-tint"><Icon name="check" size={32} /></span>
          <h1 className="mt-4">{order.kind === "quote" ? "Quote request saved" : "Order saved"}</h1>
          <p className="lead mt-2">Your reference is <strong className="price">{order.id}</strong></p>
        </div>

        <section className="card mt-8 p-6" aria-labelledby="send-now">
          <h2 id="send-now" className="text-xl">Send it to us to start</h2>
          <p className="mt-2">
            This site has no server, so your {order.kind === "quote" ? "request" : "order"} is saved on this device only. Send it to EL Print
            with one of these buttons. Attach your artwork files to the email.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={mailtoLink(subject, body)} className="btn btn-primary btn-lg">Email to {business.email}</a>
            <a href={whatsappLink(`${subject}\n\n${body}`)} className="btn btn-secondary btn-lg" target="_blank" rel="noreferrer">Send on WhatsApp</a>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="next">
          <h2 id="next" className="text-xl">What happens next</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>We check your artwork and confirm the price within 1–2 working days.</li>
            <li>We email you a digital proof to approve.</li>
            <li>You pay after you approve the proof. Printing starts then.</li>
            <li>{order.customer.mode === "collect" ? "We tell you when your order is ready to collect." : "We deliver your order, or post it if you chose SingPost."}</li>
          </ol>
        </section>

        <section className="card mt-8 p-6" aria-label="Order summary">
          <ul className="divide-y divide-line">
            {order.lines.map((l, i) => (
              <li key={i} className="flex justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold">{l.qty} × {l.name}</p>
                  <p className="caption">{l.options.join(", ")}</p>
                </div>
                <p className="price">{sgd(l.total)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-line pt-3 text-lg"><span className="font-semibold">Estimated total (with delivery)</span><span className="price">{sgd(order.total)}</span></p>
        </section>

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/shop/" className="btn btn-secondary">Back to shop</Link>
        </div>
      </div>
    </div>
  );
}
