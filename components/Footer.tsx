import Link from "next/link";
import { business, footerLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="wrap grid gap-8 py-12 md:grid-cols-3 lg:py-16">
        <div>
          <h2 className="mb-3 text-xl">{business.legalName}</h2>
          <address className="not-italic text-ink">
            {business.addressLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
          <p className="caption mt-3">Brands we carry: {business.brands.join(", ")}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-3 text-xl">Quick links</h2>
          <ul className="grid grid-cols-2 gap-x-4 md:grid-cols-1">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex min-h-11 items-center text-ink no-underline hover:text-teal hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-xl">Contact</h2>
          <ul>
            <li><a href={business.phoneHref} className="flex min-h-11 items-center">{business.phone}</a></li>
            <li><a href={business.whatsappHref} className="flex min-h-11 items-center">WhatsApp {business.whatsapp}</a></li>
            <li><a href={business.emailHref} className="flex min-h-11 items-center">{business.email}</a></li>
          </ul>
          <p className="mt-2">{business.hours}</p>
          <p className="caption">{business.hoursNote}</p>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center caption">
        © 2026 {business.legalName}. All rights reserved.
      </p>
    </footer>
  );
}
