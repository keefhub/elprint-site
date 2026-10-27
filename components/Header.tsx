"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories, methods } from "@/lib/catalog";
import { navLinks } from "@/lib/site";
import { cartStore, useStore } from "@/lib/store";
import { Icon } from "./Icon";

function Logo() {
  return (
    <Link href="/" className="flex min-h-11 items-center gap-2 text-ink no-underline hover:text-ink" aria-label="EL Print, home">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <path d="M2 8V2h6M20 2h6v6M2 20v6h6M20 26h6v-6" fill="none" stroke="#0E6B5A" strokeWidth="2" />
        <rect x="9" y="9" width="10" height="10" fill="#0E6B5A" />
      </svg>
      <span className="text-xl font-bold tracking-tight">EL Print</span>
    </Link>
  );
}

const subMenus: Record<string, { label: string; href: string }[]> = {
  Shop: categories.map((c) => ({ label: c.name, href: `/shop/${c.id}/` })),
  Services: methods.map((m) => ({ label: m.name, href: `/services/${m.id}/` })),
};

export function Header() {
  const pathname = usePathname();
  const lines = useStore(cartStore);
  const count = lines.length;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openMenu() {
    dialogRef.current?.showModal();
    setOpen(true);
  }
  function closeMenu() {
    dialogRef.current?.close();
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);
  const cartLabel = `Cart, ${count} ${count === 1 ? "item" : "items"}`;

  return (
    <header className={`sticky top-0 z-40 bg-paper ${scrolled ? "shadow-[0_1px_0_var(--color-line)]" : ""}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-paper focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="wrap flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => {
              const subs = subMenus[l.label];
              return (
                <li key={l.href} className="group relative">
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`flex min-h-11 items-center border-b-2 px-3 font-medium no-underline ${
                      isActive(l.href) ? "border-teal text-teal" : "border-transparent text-ink hover:text-teal"
                    }`}
                  >
                    {l.label}
                  </Link>
                  {subs && (
                    <ul className="invisible absolute left-0 top-full min-w-56 rounded-lg border border-line bg-paper p-2 opacity-0 shadow-[0_8px_24px_rgb(0_0_0/0.08)] group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      {subs.map((s) => (
                        <li key={s.href}>
                          <Link href={s.href} className="flex min-h-11 items-center rounded px-3 text-ink no-underline hover:bg-teal-tint hover:text-teal">
                            {s.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart/" aria-label={cartLabel} className="relative flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-teal-tint">
            <Icon name="cart" className="text-ink" />
            {count > 0 && (
              <span aria-hidden="true" className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal px-1 text-xs font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link href="/contact/" className="btn btn-primary hidden lg:inline-flex">Request quote</Link>
          <button type="button" onClick={openMenu} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-teal-tint lg:hidden">
            <Icon name="menu" className="text-ink" />
          </button>
        </div>
      </div>

      <dialog id="mobile-menu" ref={dialogRef} onClose={() => setOpen(false)} aria-label="Menu"
        className="m-0 h-full max-h-none w-full max-w-none bg-paper p-0">
        <div className="flex h-full flex-col">
          <div className="wrap flex h-16 shrink-0 items-center justify-between">
            <Logo />
            <button type="button" onClick={closeMenu} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-teal-tint">
              <Icon name="x" className="text-ink" />
            </button>
          </div>
          <nav aria-label="Mobile" className="wrap flex-1 overflow-y-auto pb-8">
            <ul>
              {navLinks.map((l) => (
                <li key={l.href} className="border-b border-line">
                  <Link href={l.href} onClick={closeMenu} aria-current={isActive(l.href) ? "page" : undefined}
                    className="flex min-h-14 items-center text-xl font-semibold text-ink no-underline">
                    {l.label}
                  </Link>
                  {subMenus[l.label] && (
                    <ul className="mb-3 grid grid-cols-2 gap-x-4">
                      {subMenus[l.label].map((s) => (
                        <li key={s.href}>
                          <Link href={s.href} onClick={closeMenu} className="flex min-h-11 items-center text-muted no-underline hover:text-teal">
                            {s.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="wrap shrink-0 border-t border-line py-4">
            <Link href="/contact/" onClick={closeMenu} className="btn btn-primary w-full">Request quote</Link>
          </div>
        </div>
      </dialog>
    </header>
  );
}
