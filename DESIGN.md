# EL Print â€” Design Spec

Custom apparel printing, Singapore. Customers configure a print job, upload artwork, get a proof, then pay.

**Audience:** Singapore small businesses, school and CCA committees, event organisers, and individuals who need 1 to 500 pieces. They are often on a phone, often in a hurry, and usually don't know print jargon.
**Primary job of the site:** get a visitor from "I need shirts" to a configured job with artwork attached, without creating an account.
**Source of truth for the palette, type and button rules:** the client brief. Where the brief pins a value, this spec uses it unchanged. Where it leaves a choice open, the choice is made here and explained.

---

## 1. Design idea

**The site behaves like a proof sheet.** A print shop's real vocabulary is the proof: crop marks that show where ink lands, registration marks, a swatch of the exact colour, a sheet you approve before anything is printed. The brief's trust line ("No payment required until you approve the digital proof") is the whole business model, so the interface borrows that language.

Three rules follow from it:

1. **Crop marks mean "print area", and only that.** They appear on product images, the artwork upload zone and the design preview, always in the corners of the area where a print will go. They are never used as general decoration.
2. **The hero is a live proof, not a banner.** It is the one bold element on the site. Everything else is quiet.
3. **Prices and facts sit in tables, not prose.** Printers quote in grids (method, minimum, setup, per piece, turnaround). The site shows those grids plainly.

### What was rejected, and why

| First idea | Problem | Replaced with |
|---|---|---|
| Halftone-dot texture across section backgrounds | Decoration. Competes with product photos and hurts readability. | Flat white and #F8F9FA surfaces. Dots only inside the hero proof. |
| CMYK colour bars as a section divider | Cute, says nothing, and brings in four off-palette colours. | Plain 1px #E5E7EB rules. |
| Uppercase tracked labels above every heading | Template tell. | Sentence-case headings only. A label is added only when it carries information (a price note, a badge). |
| Numbered markers on service tiles and trust badges | Those are not sequences. | Numbers appear only in "How it works" and checkout steps, which are sequences. |
| Monospace for all data | Another template tell. | Inter with `font-variant-numeric: tabular-nums` for prices and tables. |
| Fade-and-slide-up on every section | Generic, and costs CLS. | One page-load sequence in the hero. Motion elsewhere answers a user action. |

---

## 2. Tokens

### Colour (from the brief)

| Token | Hex | Use | Contrast on white |
|---|---|---|---|
| `--paper` | `#FFFFFF` | Page background | n/a |
| `--surface` | `#F8F9FA` | Cards, table headers, form panels | n/a |
| `--ink` | `#1A1A1A` | Body and headings | 17.4:1 |
| `--ink-muted` | `#6B7280` | Captions, secondary text | 4.8:1 (4.6:1 on surface) |
| `--teal` | `#0E6B5A` | Primary buttons, links, active states, icons | 6.3:1 |
| `--teal-hover` | `#0A5548` | Hover and pressed | 8.6:1 |
| `--line` | `#E5E7EB` | Borders, dividers | n/a |
| `--error` | `#DC2626` | Error border and text | 4.8:1 |
| `--success` | `#16A34A` | Success border and icon only | 3.3:1, **fails for text** |
| `--success-ink` | `#15803D` | Success text (added, derived from `--success`) | 5.0:1 |
| `--disabled-bg` / `--disabled-ink` | `#E5E7EB` / `#9CA3AF` | Disabled buttons | exempt (inactive) |

One addition to the brief: `--teal-tint` `#E7F1EE` (teal at about 10% on white) for selected radio cards and the active filter chip. It never carries text smaller than 16px, and text on it is `--ink`.

### Type

**Inter** (variable, self-hosted WebP-era budget: one woff2, weights 400 to 700, `font-display: swap`), falling back to `system-ui, sans-serif`. The brief allows Inter or system sans; one family is used for everything and hierarchy comes from size, weight and spacing.

| Role | Size / line-height | Weight | Tracking | Notes |
|---|---|---|---|---|
| Display (home H1 only) | `clamp(2.25rem, 5vw + 1rem, 3.75rem)` / 1.05 | 700 | -0.03em | Set left-aligned, max 18ch wide per line break. |
| H1 | `clamp(1.875rem, 3vw + 1rem, 2.5rem)` / 1.15 | 700 | -0.02em | |
| H2 | 1.75rem / 1.2 | 700 | -0.02em | |
| H3 | 1.25rem / 1.3 | 600 | -0.01em | |
| Body | 1rem / 1.6 | 400 | 0 | Max line length 68ch. |
| Lead (subheads) | 1.125rem / 1.6 | 400 | 0 | `--ink`, not muted. |
| Caption, small | 0.875rem / 1.5 | 400 | 0 | `--ink-muted`. |
| Button | 1rem / 1 | 600 | 0 | |
| Badge | 0.75rem / 1 | 600 | 0.01em | Sentence case. |
| Price | inherits | 700 | 0 | `tabular-nums`. "From" is caption size, the amount is H3 size. |

The home H1 is long (the brief's wording is kept). It is set in Display size and broken as three lines: "Custom T-shirt printing in Singapore" / "Fast, affordable" / "No minimum for DTG". Sentence case, no word picked out in colour or italic.

### Spacing, radius, elevation

- **Space (4px grid):** 4, 8, 12, 16, 24, 32, 48, 64, 96. Section padding is 48 on mobile and 96 on desktop. Gutters are 16 on mobile, 32 on desktop. Content max width is 1200px.
- **Radius:** 6px on buttons, inputs and badges (badges are fully rounded pills per the brief). 8px on cards and the proof frame. Two values, used by role.
- **Elevation:** none by default. Cards are separated by a 1px `--line` border on `--surface`. The only shadow is on the sticky header after scroll (`0 1px 0 var(--line)`, effectively a rule) and on the mobile bottom bar.
- **Icons:** 24px, 2px stroke, round caps, `--teal` for action and feature icons, `--ink-muted` for utility icons. One icon set throughout (Lucide-style), inlined as SVG.

### Buttons (one system)

| Variant | Default | Hover | Active | Focus |
|---|---|---|---|---|
| Primary | `--teal` fill, white text | `--teal-hover` | `--teal-hover` plus 1px translate-down | |
| Secondary | transparent, 2px `--teal` border, teal text | `--teal-tint` fill | darker tint | |
| Ghost | transparent, teal text, underline on hover | `--teal-tint` fill | | |
| Disabled | `--disabled-bg`, `--disabled-ink` | none | none | `aria-disabled` |

All: 44px min height, 16px horizontal padding minimum (24px for primary page CTAs), 6px radius. Focus ring on every interactive element: 3px `--teal` outline, 2px offset, never removed. Exactly one primary button per viewport region.

### Forms

Label above the field, always. 44px min height, 1px `--line` border, `--teal` border and focus ring on focus. Error: `--error` border plus text below with an icon, so state is not colour-only. Success: `--success` border plus check icon. Hint text sits between the label and the field, in caption style. Max width 600px on desktop, full width on mobile. `autocomplete` set to `name`, `email`, `tel`, `street-address`, `postal-code`.

### Badges

Teal pill, white 12px/600 text, 4px 10px padding. The brief's set: New, Popular, Best Seller, Rush Available, No Min Order. Max two per card.

### Motion

- Hero only: the proof prints in (see 4.1), about 900ms once on load.
- Responsive to action: accordion open, cart drawer, filter sheet, upload-complete tick, add-to-cart confirmation (button text changes to "Added to cart" for 2s).
- Everything honours `prefers-reduced-motion: reduce` by rendering the final state with no transition.
- No parallax, no scroll-triggered reveals, no card hover lifts. Cards change border colour on hover.

---

## 3. Layout system and global components

### Grid

| Breakpoint | Columns | Notes |
|---|---|---|
| 320 to 767 | 4, 16px gutter | One column of content. Hamburger. Sticky bottom bar on shop and product pages. |
| 768 to 1023 | 8, 24px gutter | Two-column product grid. Filters as a horizontal scroll bar of chips. |
| 1024 and up | 12, 32px gutter | Three-column product grid (four for category tiles). Sticky filter sidebar. Full nav. |

Alignment: everything is **left-aligned**. Centring is used for exactly two things: the footer copyright line (per brief) and the order confirmation heading. Centred paragraphs are not used.

### Header (sticky)

```
Desktop (72px)
[ EL â–ª Print ]   Shop  Services  Pricing  Design Lab  Delivery  About  Contact     [ðŸ›’ 2]  [Request quote]

Mobile (64px)
[ EL â–ª Print ]                                                          [ðŸ›’ 2]  [â˜°]
```

- Logo: wordmark "EL Print" in Inter 700 with a small mark: a square with crop-mark corners and a solid teal centre. Same device as the print-area frame, so the logo and the system agree.
- Active page: 2px teal underline under the link, plus `aria-current="page"`.
- Services opens a six-item menu on hover and focus (one click from the header to any method: total of two clicks from home, as the brief requires). Shop does the same for four categories.
- Cart icon: `aria-label="Cart, 2 items"`. Count badge is teal with white text.
- Mobile menu: full-height overlay, links at 20px with 56px row height, "Request quote" as a primary button at the bottom, close button top right, focus trapped, Escape closes.
- Sticky: header gains a bottom rule after 8px of scroll. It does not shrink (avoids layout shift).

### Breadcrumbs

On every interior page, directly under the header: `Home / Shop / T-shirts / Heavy Cotton Tee`. Caption size, links in `--ink-muted`, current page in `--ink`. Structured as `<nav aria-label="Breadcrumb"><ol>`.

### Footer

Three columns on desktop (company, quick links, contact), stacked on mobile. Surface background, 1px top rule.

- **Company:** EL Print Pte Ltd, 15 Lorong 8 Toa Payoh, #07-08 Braddell Tech, Singapore 319262, and the line "Brands we carry: Gildan, Ultra Fresh, North Harbour".
- **Quick links:** Shop, Services, Pricing, Delivery, Contact, FAQ, Privacy, Terms.
- **Contact:** phone, WhatsApp, email (all linked), hours "Mon to Fri, 9:30 AM to 6:30 PM. Closed weekends and public holidays."
- **Newsletter:** left out of the build. A static site has nowhere to store sign-ups.
- Copyright line centred below.

### Sticky mobile action bar

On shop and product pages below 768px: a fixed bottom bar, 64px plus safe-area inset. On listings it holds cart icon with count and "View cart". On the product page it holds the running price on the left and the primary button on the right ("Add to cart" or "Request quote"). Page content gets matching bottom padding so nothing is hidden.

---

## 4. Pages

Every page opens with H1 plus one line of lead text that says what the page is for, and ends with one next step.

### 4.1 Home

**The memorable element: the live proof.** Hero is two columns on desktop, stacked on mobile.

```
Desktop
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Custom T-shirt printing in Singapore     â”‚   â”Œ â”€ â”€ â”€ â”€ â”€ â”€ â”€ â”€ â”    â”‚
â”‚ Fast, affordable                         â”‚   â•Ž   [garment SVG]  â•Ž    â”‚
â”‚ No minimum for DTG                       â”‚   â•Ž  â”Œ â”€ â”€ â”€ â”       â•Ž    â”‚
â”‚                                          â”‚   â•Ž  â•Ž YOUR   â•Ž       â•Ž    â”‚
â”‚ DTG prints full colour from one piece,   â”‚   â•Ž  â•Ž TEXT   â•Ž       â•Ž    â”‚
â”‚ with no setup fee. Order 24 or more and  â”‚   â•Ž  â”” â”€ â”€ â”€ â”˜       â•Ž    â”‚
â”‚ silkscreen brings the price per piece    â”‚   â”” â”€ â”€ â”€ â”€ â”€ â”€ â”€ â”€ â”˜    â”‚
â”‚ down.                                    â”‚   [ type here...      ]   â”‚
â”‚ [Start designing]  [View pricing]        â”‚   S$ 18.90 Â· 1 pc Â· DTG   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ âœ“ No minimum order (DTG)  âœ“ 2-day turnaround available  âœ“ Island-wide delivery  âœ“ WhatsApp support â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

- **The proof** is an inline SVG tee on a `--surface` panel with crop marks at the print-area corners. A single text field under it ("Type your text or team name") sets the print text live on the shirt. Beside it, a method toggle (DTG, Silkscreen, Embroidery) swaps the rendering style (flat colour, halftone edge, stitched texture) and updates the price line. The visitor feels what the site does in three seconds.
- **Load sequence (once):** the crop marks draw in, the sample print fades up like ink laying down, the price line settles. About 900ms. Reduced motion shows the final state.
- Pre-filled with "Your team name" so the panel is never empty. Hand-off: "Start designing" carries the typed text and method into `/design`.
- The shirt SVG is a single flat colour shape (white garment on `--surface`, with a 1px outline). No stock photography in the hero.
- The price line uses placeholder pricing, clearly marked as an estimate ("Estimate. Final price confirmed after artwork review.").
- The trust row is four items with line icons, in a single row on desktop and a 2x2 grid on mobile. Plain text, no cards.

**Below the hero (in order):**

1. **Services (6 tiles).** 3x2 on desktop, 2x3 tablet, 1 column mobile. Each tile: 24px icon, method name (H3), one line, "Learn more" ghost link. Whole tile is the link target; the visible link text is the accessible name. Tiles share one style, no per-service colours.
2. **Shop by category (4 tiles).** Product photo on a neutral background, category name, item count ("12 items"). Tile border darkens on hover.
3. **How it works (4 steps).** This is a true sequence, so numbered: Choose a product, Pick a print method, Upload your artwork, Approve the proof and pay. Horizontal on desktop with a connecting rule, vertical on mobile. Closing line: "You pay only after you approve the proof." with a primary "Start designing" button.
4. **Where to find us.** A short block: address, hours, click-to-chat WhatsApp. Reinforces "real shop in Toa Payoh" for trust, and gives the collection option visibility.

### 4.2 Shop and category listings

```
Desktop
Home / Shop / T-shirts
T-shirts                                           Sort: [Popular â–¾]
Short description, one line.           24 products
â”Œ Filters â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Print method  â”‚  â”‚  image    â”‚ â”‚  image    â”‚ â”‚  image    â”‚
â”‚ â˜ DTG         â”‚  â”‚  Name     â”‚ â”‚           â”‚ â”‚           â”‚
â”‚ â˜ Silkscreen  â”‚  â”‚ From S$8  â”‚ â”‚           â”‚ â”‚           â”‚
â”‚ Price range   â”‚  â”‚ DTG Â· SS  â”‚ â”‚           â”‚ â”‚           â”‚
â”‚ Sleeve type   â”‚  â”‚ View â€º    â”‚ â”‚           â”‚ â”‚           â”‚
â”‚ Fabric        â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
â”‚ Size range    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

- **Sidebar:** sticky, 280px, filter groups as native `<fieldset>`/`<legend>` with checkboxes. Applied filters also show as removable chips above the grid, with a "Clear all" ghost button. Result count is announced via `aria-live="polite"`.
- **Tablet and mobile:** filters collapse into a horizontally scrolling chip bar plus a "Filters" button opening a bottom sheet with an "Show 14 results" primary button.
- **Product card:** square image on neutral background (aspect-ratio fixed to prevent layout shift), badge top left, name (H3), "From S$X.XX" with the amount emphasised, available print methods as small text, "View product" ghost link. On hover or focus, an "Add to cart" secondary button appears under the price; on touch it is always visible (no hover-only actions). Whole card links to the product.
- `/shop` shows the four category tiles first, then a "Popular right now" grid.
- `/shop/accessories` (banners and stickers) cards show size and material instead of garment sizes.

### 4.3 Product detail

```
Desktop (60 / 40)
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ â”Œ â”€ â”€ â”€ main image â”€ â”€ â”€ â” â”‚  â”‚ Heavy Cotton Tee             â”‚
â”‚ â•Ž                        â•Ž â”‚  â”‚ One-line description         â”‚
â”‚ â”” â”€ â”€ â”€ â”€ â”€ â”€ â”€ â”€ â”€ â”€ â”€ â”˜ â”‚  â”‚ From S$8.50  (caption: final â”‚
â”‚ [t][t][t][t]               â”‚  â”‚ price depends on method & qty)â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚ Size [S M L XLâ€¦]  Colour â— â— â”‚
 Tabs: Details | Printing | Tips â”‚ Brand [Gildan â–¾]             â”‚
                                 â”‚ Print method (radio cards)   â”‚
                                 â”‚ Quantity [âˆ’ 12 +]            â”‚
                                 â”‚ Print locations â˜‘ Front â€¦    â”‚
                                 â”‚ Artwork [ drop zone ]        â”‚
                                 â”‚ [Add to cart]                â”‚
                                 â”‚ Ready in 5â€“7 working daysâ€¦   â”‚
                                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

- **Gallery:** main image with crop marks at the print area on the first image, thumbnails strip below (horizontal), arrow keys move between thumbnails. Thumbnails are buttons with descriptive alt text ("Front view, white", "Close-up of DTG print on chest").
- **Right column** is a sticky panel on desktop. On mobile it flows beneath the gallery and the bottom bar carries the running price and primary button.
- **Print method radio cards:** a `role="radiogroup"` of cards, each with method name, setup fee, minimum quantity and turnaround in a three-line grid. Selected: 2px teal border plus `--teal-tint` fill plus a check icon. Methods unavailable for this garment are disabled with a reason ("Not available on jackets").
- **Running price:** updates as options change. Shows per piece and total: "S$12.40 per piece, S$148.80 for 12". Original price struck through if discounted.
- **Button logic:** "Add to cart" when the configuration has a firm price; "Request quote" when it doesn't (for example embroidery with artwork over a size limit). The label and the turnaround badge change together.
- **Quantity:** stepper with 44px buttons and a typed input. Min and max shown in the hint text per method ("DTG: 1 to 50 pieces").
- **Upload zone:** see 5.3.
- **Turnaround badge:** outlined (not filled) so it doesn't compete with the button: clock icon and "Ready in 5 to 7 working days after proof approval".
- **Tabs** (Details, Printing, Design tips): proper tablist semantics. On mobile they become stacked accordions. The Details tab contains a size chart as a real table.

### 4.4 Cart

- Table on desktop (image, name and selected options as a short list, unit price, quantity stepper, line total, remove). On mobile each line becomes a stacked block with the same fields. "Remove" is a ghost button with the product name in its accessible label.
- Quantity changes update totals immediately (no separate "Update" click needed; the brief's "inline edit with update" is met by instant update plus a live-region announcement).
- Right column (below on mobile): subtotal, delivery estimator (postal code field with "Check delivery fee"), estimated total, then the primary button "Proceed to checkout".
- Above the button: radio choice "Continue as guest" (default) or "Create account" (ghost link). Guest is pre-selected, so nothing blocks the primary action.
- Under the button, trust note with shield icon: "You pay nothing until you approve the digital proof."
- Empty state: "Your cart is empty." plus two buttons, "Browse products" (primary) and "Start designing" (secondary).

### 4.5 Checkout

Single page, three steps, with a stepper at the top (a true sequence, so numbered: Your details, Artwork, Review). Mobile shows one step at a time; desktop shows the active step on the left and a persistent order summary on the right.

1. **Your details:** name, email, phone, then a clear two-option toggle (Delivery / Self-collection at Braddell Tech). Choosing collection hides the address fields and shows the address and hours.
2. **Artwork:** per cart line, confirm or upload artwork, plus a special instructions textarea.
3. **Review and submit:** summary, terms checkbox with a link, final button labelled to match what happens: "Place order" or "Submit for quote". Same wording in the confirmation.

Progress is auto-saved to `localStorage` on every field change (wrapped in try/catch; works without it). Errors: inline per field, plus an error summary at the top of the step with links to each field and focus moved to it on failed Next.

**Confirmation page:** order number in H1 size, "We'll email your quote within 1 to 2 working days", then a three-line "What happens next" list (we check your artwork, we send a proof, you approve and pay). Buttons: "Back to shop" (secondary). Email confirmation noted as sent.

### 4.6 Pricing

- **Comparison table:** Print method, Best for, Min order, Setup fee, Price per piece (from), Turnaround. Six rows. Sticky first column and horizontal scroll on mobile with a visible scroll hint (shadow edge). `<caption>` and `scope` attributes set. Each method name links to its service page.
- **Calculator** directly under the table: three fields (garment, print method, quantity) and a result panel showing per piece, setup fee, and estimated total, updating live (`aria-live="polite"`). The result panel uses the proof frame (crop marks). Below it: "Final price is confirmed after artwork review." and a primary "Start designing with these options" button that pre-fills the Design Lab.
- All prices are **placeholders** until the client supplies real ones (see 7).

### 4.7 Service pages (`/services/[method]`)

H1 method name with a one-line summary. Hero image of a print result (close-up, neutral background, with crop marks). "What it is" in 2 to 3 sentences. Pros and cons in two columns, each as a short list with check and minus icons (icon plus text, never colour alone). A small facts table: ideal order size, best garments, setup fee, turnaround, with a link to the pricing row. Primary CTA: "Start designing with [method]". On `/services`, six method cards share a "Which method should I choose?" three-question helper (How many pieces? How many colours? Garment or banner?) that links to a recommended page.

### 4.8 Delivery

Options table: Courier (S$25 per trip, book 2 days ahead), Self-collection (free, Braddell Tech), SingPost (1 to 4 pieces, registered post). Under it, delivery area (island-wide), pickup address and hours, and an accordion FAQ (lost parcels, delays, weekend delivery). Accordion uses native `<details>`/`<summary>` with a 44px summary row.

### 4.9 Contact

Two columns on desktop: form (max 600px) and info card. Form fields: name, email, phone, inquiry type (select), message, optional file upload (reuses the upload zone, compact). Button: "Send message". Info card: address, phone as `tel:`, WhatsApp as `https://wa.me/6586996813`, email as `mailto:`, hours, and a Google Maps iframe (lazy-loaded, fixed aspect ratio, with a "Open in Google Maps" text link beneath for no-JS and privacy). Live chat widget is left out until the client confirms a provider; WhatsApp covers the need.

### 4.10 About, FAQ, Privacy, Terms

Single column, 68ch reading width, H2 sections, short paragraphs, a "On this page" link list at the top for Privacy and Terms (they are long). FAQ groups: ordering, artwork, payment, turnaround, delivery, cancellation, proof approval. Each group is an accordion. A closing "Still stuck?" block with WhatsApp and phone. The About page leans on the real location: Braddell Tech, Toa Payoh, hours, and the three brands carried. Privacy and Terms are written fresh for current Singapore PDPA practice and flagged for client legal review (see 7).

---

## 5. Component details

### 5.1 Product card, price display

- Always "S$". "From S$8.50" when variable: "From" in caption size, amount in H3 weight.
- Bulk tables show per piece first, then total.
- Discount: original price struck through in `--ink-muted`, new price in `--ink`. No red.
- Numbers use `tabular-nums` so columns align.

### 5.2 Badges and status

Badges always pair text with colour. Order status (Quote requested, Proof sent, Approved) uses text plus an icon, never colour alone.

### 5.3 Artwork upload zone

- Dashed 2px `--line` border on `--surface`, 8px radius, crop marks in the four corners (this is a print-area device, so it belongs here).
- Contents: upload icon, "Drag a file here or browse" (the word "browse" is a real `<button>`), and a caption "PNG, JPG, PDF, AI or EPS. Up to 50 MB. 300 DPI and a transparent background work best."
- Whole zone is keyboard operable: it wraps a visible `<input type="file">` label, so Enter and Space open the picker. `aria-describedby` points at the caption.
- States: hover and drag-over (teal border, `--teal-tint` fill, text changes to "Drop to upload"), uploaded (thumbnail 64px, file name, size, "Replace" and "Remove" ghost buttons, success tick), error (red border, message such as "This file is 62 MB. The limit is 50 MB. Compress it or send it by WhatsApp.").
- Validation: extension and size checked client-side. Preview is generated with `URL.createObjectURL` for images; PDF, AI and EPS show a file-type tile instead.

### 5.4 Radio cards, filters, steppers

All are native inputs visually restyled, so keyboard and screen reader behaviour is free. Selected state is shown by border weight, fill and a check icon.

### 5.5 Toasts and confirmations

Used only for add-to-cart and subscribe. Appear bottom-left on desktop, above the bottom bar on mobile, in a `role="status"` region, auto-dismiss after 4s, never cover the primary button.

---

## 6. Imagery and content

- **Product photography:** square 1:1, white or `#F3F4F6` background, same front angle for the hero shot, second shot showing the print detail. Delivered as WebP at 800 and 1600px widths with `srcset`; first image per page `fetchpriority="high"`, the rest `loading="lazy"`; width and height always set.
- **Placeholder imagery for the build:** until photos exist, products use the same flat SVG garment silhouettes used in the hero, one per category (tee, hoodie, varsity jacket, wind breaker, bomber, banner, sticker sheet), tinted per colour. This keeps the grid consistent and is honest about being placeholder.
- **Alt text:** describes garment, colour, view and print ("Black hoodie, front, with a white chest logo printed in DTG"). Decorative crop marks and icons are `aria-hidden`.
- **Voice:** plain, direct, sentence case. Name things the way customers do ("T-shirt printing", "bulk order") before the trade term, then explain the trade term once ("DTG, short for direct to garment"). Buttons name the result: "Start designing", "Add to cart", "Send message", "Place order". An action keeps one name across the flow. Errors say what happened and what to do, and do not apologise.
- **Seed catalogue (8 or more products):**

| Category | Products |
|---|---|
| T-shirts | Heavy Cotton Tee (Gildan), Ultra Cotton Tee (Gildan), Dry-Fit Sports Tee (Ultra Fresh), Polo Shirt (North Harbour) |
| Hoodies | Pullover Hoodie (Gildan), Zip Hoodie (Gildan) |
| Jackets | Varsity Jacket, Wind Breaker, Bomber Jacket (North Harbour) |
| Accessories | Vinyl Banner, Sticker Sheet |

---

## 7. Accessibility and performance

**Accessibility**
- Contrast values in section 2 are checked. Two things to handle: `#16A34A` is never used for text (use `--success-ink`), and the muted gray stays at 14px or larger and on white or `--surface` only.
- Skip link as first focusable element. One `<h1>` per page, no skipped heading levels. Landmarks: `header`, `nav`, `main`, `footer`.
- Visible focus ring everywhere (see Buttons). Logical tab order matching visual order. Mobile menu, cart drawer and filter sheet trap focus and restore it on close.
- Targets at least 44 by 44px, including icon buttons, stepper buttons, checkboxes (the hit area is the whole row) and footer links (padding, not just line height).
- ARIA labels on cart icon, menu toggle, upload zone, stepper buttons. Live regions for cart count, filter results, price calculator, upload status.
- Forms: every field has a `<label>`; errors linked with `aria-describedby`; `aria-invalid` on failure.
- Motion: reduced-motion media query handled in one place in CSS.

**Performance**
- LCP element is the hero proof (inline SVG, no network fetch) or the hero text, so well under 2.5s. Inter is preloaded; a size-matched fallback metric override prevents font-swap shift.
- CLS under 0.1: fixed aspect ratios for every image, reserved space for the sticky bars, no content injected above existing content.
- Critical CSS inlined for the above-the-fold shell. No render-blocking scripts. JavaScript is small, per-page, and deferred.
- Map iframe and below-fold images lazy-loaded.

---

## 8. Open questions for the client

These need answers before the site can be real. None block the build, because placeholders are marked.

1. **Real prices.** The brief gives only "S$25 per courier trip". Every other price, setup fee and minimum in the build is a placeholder.
2. **Content:** Privacy Policy and Terms must be written fresh and reviewed by someone qualified. The build ships a clearly marked draft.
3. **Payments and email:** the brief describes quote and checkout flows but names no payment provider or email sender. The front end will simulate submission and show the confirmation page.
4. **Brand assets:** no logo file was supplied, so the logo is a wordmark with a crop-mark square. Replace if one exists.
5. **Photography:** no photos supplied. Placeholders are flat SVG garments.
6. **Stack conflict.** The brief asks for static HTML, Tailwind and vanilla JS in named files (`index.html`, `style.css`, `script.js`). This repository is a Next.js 16 app with Tailwind 4. Two options: (a) build in the Next app, where the routes in section 4 of the brief map directly to `app/` folders and the same tokens go into `@theme`; or (b) deliver the static file set separately, outside `app/`. Recommendation: (a), because a cart, a checkout flow and shared header and footer are far easier to keep consistent as components than as copied HTML, and the user-facing result is the same. Note `AGENTS.md` says this Next.js version differs from older versions, so the relevant guide in `node_modules/next/dist/docs/` must be read before any code is written.
