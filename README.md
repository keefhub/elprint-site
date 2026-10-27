# EL Print website

A static e-commerce website for **EL Print Pte Ltd**, a custom apparel printer in Singapore. Customers browse products, set print options, upload artwork, and request a quote or place an order. They can choose delivery or self-collection.

There is no backend or database. Cart, design drafts and orders are saved in the visitor's browser (localStorage).

## The brief, in short

**Goal:** a new site for a business that prints T-shirts, hoodies, varsity jackets, wind breakers and bomber jackets, plus banners and stickers. Methods: DTG, silkscreen, embroidery, digital heat transfer and dye sublimation.

**Business details used on the site**

| | |
|---|---|
| Company | EL Print Pte Ltd |
| Address | 15 Lorong 8 Toa Payoh, #07-08 Braddell Tech, Singapore 319262 |
| Phone | +65 6100 5225 |
| WhatsApp | +65 8699 6813 |
| Email | sales@elprint.sg |
| Hours | Mon–Fri, 9:30 AM – 6:30 PM (closed weekends and public holidays) |
| Brands | Gildan, Ultra Fresh, North Harbour |

**Design principles (apply to every page)**

1. **Clarity:** each page says what it is and what to do next within 3 seconds. Prices, turnaround, minimums and delivery fees are stated plainly.
2. **Easy navigation:** any product, service or contact page is 2 clicks or fewer from home. Breadcrumbs on interior pages.
3. **Readable and scannable:** short sentences, bullets, 1.6 line height, high contrast.
4. **Visual hierarchy:** clearly different heading, body, caption and button styles. The main action is the most prominent.
5. **Low friction:** guest checkout, auto-saved designs, sticky "Add to cart" or "Request quote" on mobile, no account needed.
6. **Mobile friendly:** fully responsive, tap targets at least 44×44 px.
7. **Consistent:** one button style, one heading scale, one spacing system, one palette.

**Visual system:** teal `#0E6B5A` primary (hover `#0A5548`), near-black text `#1A1A1A`, muted gray `#6B7280`, surface `#F8F9FA`, border `#E5E7EB`, error `#DC2626`, success `#16A34A`. Inter or system sans, 4px spacing grid, 24px line icons with a 2px stroke.

**Pages**

- Home (hero, trust badges, 6 service tiles, 4 category tiles, 4-step "How it works")
- Shop with category pages (T-shirts, Hoodies, Jackets, Accessories), filters and product cards
- Product detail with gallery, variant selectors, print method cards, locations, artwork upload, sticky mobile buy bar and tabs
- Printing services (DTG, Silkscreen, Embroidery, Digital Heat Transfer, Dye Sublimation, Banners & Stickers)
- Design Lab (artwork upload and live preview)
- Pricing (comparison table and instant calculator)
- Cart and 3-step checkout (details, artwork, review) with a confirmation page
- Delivery & Collection, Contact, About, FAQ, Privacy Policy, Terms & Conditions

**Accessibility:** WCAG contrast, alt text, labelled fields, keyboard navigation with visible focus, ARIA labels on the cart, menu and upload zones, and `prefers-reduced-motion` support.

**Performance targets:** LCP under 2.5 s, FID under 100 ms, CLS under 0.1, lazy-loaded images, inlined critical CSS.

**Original deliverable requested:** plain HTML, Tailwind CSS and vanilla JS files, with at least 8 placeholder products. This repo implements it as a static Next.js export instead, using only the business details above.

## What was built

- Next.js 16 (App Router) with Tailwind CSS 4, exported as static HTML (`output: "export"`).
- 11 placeholder products. Every price, setup fee and minimum except the S$25 courier trip is a placeholder. Edit them in `lib/catalog.ts` and `lib/pricing.ts`.
- With no server, contact and checkout end on a screen that gives a pre-filled email and WhatsApp message to send.
- Privacy and Terms are drafts that need legal review before launch.
- The design rationale is in [DESIGN.md](DESIGN.md).

## Run it

```bash
npm install
npm run dev      # development server at http://localhost:3000
npm run build    # writes the static site to ./out
npm run lint
```

Serve the `out/` folder with any static host.

## Project layout

```
app/          routes (one folder per page)
components/   header, footer, product configurator, cart, checkout, forms
lib/          catalogue data, pricing rules, localStorage stores, business details
DESIGN.md     design spec
```
