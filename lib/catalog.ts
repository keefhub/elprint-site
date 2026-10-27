/*
 * Catalogue data. Everything here is front-end data; no server or database.
 * PLACEHOLDER: every price, setup fee and minimum except the S$25 courier trip
 * is a stand-in until EL Print supplies real figures. Change them here only.
 */

export type MethodId =
  | "dtg"
  | "silkscreen"
  | "embroidery"
  | "dht"
  | "sublimation"
  | "banners-stickers";

export type PrintLocation = "front" | "back" | "sleeve";

export type IconName =
  | "shirt" | "layers" | "spool" | "flame" | "droplet" | "flag" | "cart" | "menu" | "x"
  | "check" | "chevron-down" | "chevron-right" | "upload" | "clock" | "truck" | "message"
  | "phone" | "mail" | "map-pin" | "shield" | "minus" | "plus" | "trash" | "file"
  | "alert" | "info" | "filter" | "zap" | "package" | "sticker";

export interface Tier { from: number; price: number }

export interface Method {
  id: MethodId;
  name: string;
  icon: IconName;
  tile: string;
  summary: string;
  what: string;
  pros: string[];
  cons: string[];
  idealOrders: string;
  garments: string;
  artwork: string;
  bestFor: string;
  minQty: number;
  maxQty: number;
  /** Charged once per print location. */
  setupFee: number;
  tiers: Tier[];
  turnaround: string;
  rushTurnaround?: string;
}

export const RUSH_FEE = 30;

export const methods: Method[] = [
  {
    id: "dtg",
    name: "DTG",
    icon: "shirt",
    tile: "Full-colour prints on cotton, from a single piece.",
    summary: "Direct to garment. The design is printed straight onto the fabric by an inkjet printer.",
    what: "DTG (direct to garment) works like a desktop printer for fabric. Your artwork goes straight onto the shirt in full colour, with no screens or setup. That makes it the best way to order one piece or a small batch.",
    pros: ["No minimum order and no setup fee", "Photos, gradients and many colours print cleanly", "Soft feel on cotton", "Fast turnaround"],
    cons: ["Best on cotton and cotton blends", "Cost per piece stays flat on large orders", "Not suited to dark polyester"],
    idealOrders: "1 to 50 pieces",
    garments: "Cotton T-shirts and hoodies",
    artwork: "PNG or PDF at 300 DPI. A transparent background gives the cleanest edge.",
    bestFor: "Small runs, one-offs, detailed artwork",
    minQty: 1, maxQty: 50, setupFee: 0,
    tiers: [{ from: 1, price: 10 }, { from: 6, price: 9 }, { from: 12, price: 8 }, { from: 25, price: 7.5 }],
    turnaround: "3–5 working days",
    rushTurnaround: "2 working days",
  },
  {
    id: "silkscreen",
    name: "Silkscreen",
    icon: "layers",
    tile: "The lowest price per piece for large runs.",
    summary: "Ink is pressed through a mesh screen, one colour at a time.",
    what: "Silkscreen pushes thick ink through a mesh screen onto the garment, one colour per screen. There is a one-time setup for each design, then the price per piece drops sharply as the order grows.",
    pros: ["Lowest price per piece at 50 or more", "Bold, long-lasting colour", "Works on most fabrics", "Matches specific colours well"],
    cons: ["Minimum order of 24", "Setup fee for each design", "Not ideal for photos or gradients"],
    idealOrders: "24 pieces and up",
    garments: "T-shirts, hoodies, jackets, tote bags",
    artwork: "Vector artwork (AI, EPS or PDF) with 1 to 4 solid colours works best.",
    bestFor: "Events, teams, schools, company uniforms",
    minQty: 24, maxQty: 5000, setupFee: 60,
    tiers: [{ from: 24, price: 4.5 }, { from: 50, price: 3.8 }, { from: 100, price: 3 }, { from: 300, price: 2.4 }, { from: 500, price: 2 }],
    turnaround: "7–10 working days",
  },
  {
    id: "embroidery",
    name: "Embroidery",
    icon: "spool",
    tile: "Stitched logos that last for years.",
    summary: "Your logo is stitched into the fabric with thread.",
    what: "Embroidery stitches your logo into the garment with thread. We convert your artwork into a stitch file once (the digitising fee), then reuse it on every reorder. It gives a premium look on polos, caps and jackets.",
    pros: ["Premium, durable finish", "Reorders reuse the same stitch file", "Great on thicker fabrics and jackets", "Looks good wash after wash"],
    cons: ["Minimum order of 6", "Digitising fee for a new design", "Fine detail and small text need simplifying"],
    idealOrders: "6 to 200 pieces",
    garments: "Polos, jackets, hoodies, caps",
    artwork: "Vector logo (AI, EPS or PDF). We digitise it for you.",
    bestFor: "Corporate wear, jackets, uniforms",
    minQty: 6, maxQty: 1000, setupFee: 45,
    tiers: [{ from: 6, price: 7.5 }, { from: 24, price: 6.5 }, { from: 50, price: 5.5 }, { from: 100, price: 4.8 }],
    turnaround: "7–10 working days",
  },
  {
    id: "dht",
    name: "Digital Heat Transfer",
    icon: "flame",
    tile: "Sharp, durable prints on almost any fabric.",
    summary: "A printed film is pressed onto the garment with heat.",
    what: "Digital heat transfer prints your design onto a film, then presses it onto the garment with heat. It handles full colour on fabrics DTG can't, including polyester and nylon, with no minimum order.",
    pros: ["No minimum order and no setup fee", "Works on polyester, nylon and blends", "Full colour with crisp edges", "Quick to produce"],
    cons: ["Slightly raised feel on the fabric", "Large, solid areas feel less breathable", "Price per piece falls only on larger orders"],
    idealOrders: "1 to 200 pieces",
    garments: "T-shirts, jackets, sportswear, bags",
    artwork: "PNG or PDF at 300 DPI. A transparent background is best.",
    bestFor: "Mixed fabrics, jackets, names and numbers",
    minQty: 1, maxQty: 200, setupFee: 0,
    tiers: [{ from: 1, price: 7 }, { from: 10, price: 6 }, { from: 50, price: 5 }, { from: 100, price: 4.5 }],
    turnaround: "3–5 working days",
    rushTurnaround: "2 working days",
  },
  {
    id: "sublimation",
    name: "Dye Sublimation",
    icon: "droplet",
    tile: "All-over colour that never peels or cracks.",
    summary: "Dye turns to gas under heat and bonds inside polyester fibres.",
    what: "Dye sublimation uses heat to turn dye into gas that bonds with polyester fibres. The print becomes part of the fabric, so it never peels, cracks or fades with washing. It suits sportswear and all-over designs.",
    pros: ["Print is part of the fabric, with no feel", "Excellent for all-over designs", "Does not crack, peel or fade", "No minimum order"],
    cons: ["Polyester only", "Works best on white or light fabric", "Not available on cotton"],
    idealOrders: "1 to 300 pieces",
    garments: "Polyester sports tees and jerseys",
    artwork: "PNG, JPG or PDF at 300 DPI in RGB colour.",
    bestFor: "Sports teams, jerseys, all-over prints",
    minQty: 1, maxQty: 300, setupFee: 0,
    tiers: [{ from: 1, price: 12 }, { from: 12, price: 10 }, { from: 50, price: 8.5 }, { from: 100, price: 7.5 }],
    turnaround: "5–7 working days",
  },
  {
    id: "banners-stickers",
    name: "Banners & Stickers",
    icon: "flag",
    tile: "Vinyl banners and die-cut stickers, any size.",
    summary: "Digital print on weatherproof vinyl, cut to your size.",
    what: "We print banners and stickers on weatherproof vinyl, then cut or finish them to size. Banners come with hemmed edges and grommets. Stickers are die-cut to your shape.",
    pros: ["Weatherproof and fade resistant", "Any size, one-off or bulk", "Banners ship with grommets fitted", "Stickers cut to shape"],
    cons: ["Sold by size, not by garment", "Large banners may need extra production time"],
    idealOrders: "1 to 500 pieces",
    garments: "Banners and stickers (not garments)",
    artwork: "PDF or AI at full size, 150 DPI minimum, with 3 mm bleed.",
    bestFor: "Events, shop signs, product labels",
    minQty: 1, maxQty: 500, setupFee: 0,
    tiers: [{ from: 1, price: 0 }],
    turnaround: "3–5 working days",
  },
];

export const methodById = Object.fromEntries(methods.map((m) => [m.id, m])) as Record<MethodId, Method>;

export type CategoryId = "t-shirts" | "hoodies" | "jackets" | "accessories";

export const categories: { id: CategoryId; name: string; blurb: string; kinds: string }[] = [
  { id: "t-shirts", name: "T-Shirts", blurb: "Tees, sports tees and polos, ready for your design.", kinds: "T-shirts and polos" },
  { id: "hoodies", name: "Hoodies", blurb: "Pullover and zip hoodies for teams, schools and events.", kinds: "Hoodies" },
  { id: "jackets", name: "Jackets", blurb: "Varsity, wind breaker and bomber jackets, embroidered or heat transferred.", kinds: "Varsity, wind breaker, bomber" },
  { id: "accessories", name: "Accessories", blurb: "Vinyl banners and die-cut stickers.", kinds: "Banners and stickers" },
];

export type Badge = "New" | "Popular" | "Best Seller" | "Rush Available" | "No Min Order";
export type GarmentKind =
  | "tee" | "longsleeve" | "polo" | "hoodie" | "ziphoodie" | "varsity" | "windbreaker" | "bomber"
  | "banner" | "sticker";

export interface Swatch { name: string; hex: string }
export interface SizeOption { label: string; add: number }

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  kind: GarmentKind;
  brands: string[];
  short: string;
  description: string;
  /** Garment cost per piece (accessories: starting size cost). */
  price: number;
  colors: Swatch[];
  /** Second colour for contrast sleeves, ribs, collars. Index into colors by default colour. */
  accent?: string;
  sizes: SizeOption[];
  sizeLabel: string;
  sizeRange: string;
  sleeve: "Short" | "Long" | "None";
  fabric: "Cotton" | "Polyester" | "Cotton blend" | "Nylon" | "Vinyl";
  methods: MethodId[];
  badges: Badge[];
  quoteOnly?: boolean;
  details: { label: string; value: string }[];
  sizeChart?: { size: string; chest: string; length: string }[];
  tips?: string[];
}

const C = {
  white: { name: "White", hex: "#FFFFFF" },
  black: { name: "Black", hex: "#1F2124" },
  navy: { name: "Navy", hex: "#1E2A4A" },
  red: { name: "Red", hex: "#B3262E" },
  grey: { name: "Heather grey", hex: "#B9BDC3" },
  green: { name: "Forest green", hex: "#245C43" },
  royal: { name: "Royal blue", hex: "#2455A8" },
  maroon: { name: "Maroon", hex: "#6B1E2E" },
  cream: { name: "Cream", hex: "#EFE8D6" },
  yellow: { name: "Yellow", hex: "#F2C230" },
};

const teeSizes: SizeOption[] = [
  { label: "S", add: 0 }, { label: "M", add: 0 }, { label: "L", add: 0 },
  { label: "XL", add: 0 }, { label: "2XL", add: 1 }, { label: "3XL", add: 2 },
];
const jacketSizes: SizeOption[] = [
  { label: "S", add: 0 }, { label: "M", add: 0 }, { label: "L", add: 0 },
  { label: "XL", add: 0 }, { label: "2XL", add: 3 },
];
const teeChart = [
  { size: "S", chest: "46 cm", length: "69 cm" },
  { size: "M", chest: "51 cm", length: "72 cm" },
  { size: "L", chest: "56 cm", length: "74 cm" },
  { size: "XL", chest: "61 cm", length: "77 cm" },
  { size: "2XL", chest: "66 cm", length: "79 cm" },
  { size: "3XL", chest: "71 cm", length: "82 cm" },
];
const hoodChart = [
  { size: "S", chest: "53 cm", length: "66 cm" },
  { size: "M", chest: "56 cm", length: "69 cm" },
  { size: "L", chest: "61 cm", length: "72 cm" },
  { size: "XL", chest: "66 cm", length: "75 cm" },
  { size: "2XL", chest: "71 cm", length: "77 cm" },
];
const jacketChart = [
  { size: "S", chest: "54 cm", length: "66 cm" },
  { size: "M", chest: "58 cm", length: "69 cm" },
  { size: "L", chest: "62 cm", length: "72 cm" },
  { size: "XL", chest: "66 cm", length: "74 cm" },
  { size: "2XL", chest: "70 cm", length: "76 cm" },
];

export const products: Product[] = [
  {
    slug: "heavy-cotton-tee",
    name: "Heavy Cotton T-Shirt",
    category: "t-shirts", kind: "tee", brands: ["Gildan", "Ultra Fresh"],
    short: "Our everyday tee. Sturdy, soft and a good base for any print.",
    description: "A mid-weight 100% cotton tee with a classic unisex fit. It takes DTG, silkscreen and heat transfer well, which makes it the usual pick for events, teams and company shirts.",
    price: 5.5,
    colors: [C.white, C.black, C.navy, C.red, C.grey, C.green],
    sizes: teeSizes, sizeLabel: "Adult unisex", sizeRange: "S–3XL", sleeve: "Short", fabric: "Cotton",
    methods: ["dtg", "silkscreen", "embroidery", "dht"],
    badges: ["Best Seller", "No Min Order", "Rush Available"],
    details: [
      { label: "Fabric", value: "100% cotton, 180 gsm" },
      { label: "Fit", value: "Classic unisex, true to size" },
      { label: "Neck", value: "Ribbed crew neck, taped shoulders" },
      { label: "Care", value: "Machine wash cold, inside out. Do not iron on the print." },
    ],
    sizeChart: teeChart,
  },
  {
    slug: "ultra-cotton-long-sleeve",
    name: "Ultra Cotton Long Sleeve Tee",
    category: "t-shirts", kind: "longsleeve", brands: ["Gildan"],
    short: "A heavier long-sleeve tee for cooler rooms and a premium feel.",
    description: "A 200 gsm ring-spun cotton long sleeve with a smooth surface that shows detail well. Good for school wear, crew shirts and staff uniforms in air-conditioned venues.",
    price: 8,
    colors: [C.white, C.black, C.navy, C.grey, C.maroon],
    sizes: teeSizes, sizeLabel: "Adult unisex", sizeRange: "S–3XL", sleeve: "Long", fabric: "Cotton",
    methods: ["dtg", "silkscreen", "dht"],
    badges: ["New", "No Min Order"],
    details: [
      { label: "Fabric", value: "100% ring-spun cotton, 200 gsm" },
      { label: "Fit", value: "Classic unisex, true to size" },
      { label: "Cuffs", value: "Ribbed cuffs, double-needle hem" },
      { label: "Care", value: "Machine wash cold, inside out. Do not iron on the print." },
    ],
    sizeChart: teeChart,
  },
  {
    slug: "dry-fit-sports-tee",
    name: "Dry-Fit Sports Tee",
    category: "t-shirts", kind: "tee", brands: ["Ultra Fresh"],
    short: "Breathable polyester for runs, sports days and team jerseys.",
    description: "A lightweight quick-dry polyester tee with a micro-mesh texture. Dye sublimation bonds into the fibres, so team prints stay sharp after many washes.",
    price: 7,
    colors: [C.white, C.royal, C.red, C.yellow, C.black],
    sizes: teeSizes.slice(0, 5), sizeLabel: "Adult unisex", sizeRange: "S–2XL", sleeve: "Short", fabric: "Polyester",
    methods: ["sublimation", "dht", "silkscreen"],
    badges: ["Popular", "No Min Order"],
    details: [
      { label: "Fabric", value: "100% polyester micro-mesh, 140 gsm" },
      { label: "Fit", value: "Regular, with room for movement" },
      { label: "Feature", value: "Quick-dry, moisture wicking" },
      { label: "Care", value: "Machine wash cold. Do not use fabric softener or iron." },
    ],
    sizeChart: teeChart.slice(0, 5),
    tips: ["Sublimation looks best on white or light-coloured polyester.", "For all-over designs, send artwork at the full garment size."],
  },
  {
    slug: "pique-polo",
    name: "Piqué Polo Shirt",
    category: "t-shirts", kind: "polo", brands: ["North Harbour"],
    short: "A smart polo for staff uniforms. Embroidery is the classic finish.",
    description: "A cotton-polyester piqué polo with a two-button placket and a firm collar that holds its shape. Embroider a small chest logo for a clean corporate look.",
    price: 11,
    colors: [C.white, C.navy, C.black, C.red, C.royal],
    sizes: teeSizes.slice(0, 5), sizeLabel: "Adult unisex", sizeRange: "S–2XL", sleeve: "Short", fabric: "Cotton blend",
    methods: ["embroidery", "dht", "silkscreen"],
    badges: ["Popular"],
    details: [
      { label: "Fabric", value: "Cotton-polyester piqué, 200 gsm" },
      { label: "Fit", value: "Regular, true to size" },
      { label: "Collar", value: "Self-fabric collar, two-button placket" },
      { label: "Care", value: "Machine wash warm. Tumble dry low." },
    ],
    sizeChart: teeChart.slice(0, 5),
  },
  {
    slug: "pullover-hoodie",
    name: "Heavy Blend Hoodie",
    category: "hoodies", kind: "hoodie", brands: ["Gildan"],
    short: "A warm pullover hoodie with a kangaroo pocket.",
    description: "A thick cotton-polyester fleece hoodie with a lined hood and pouch pocket. It suits class and CCA orders, and it prints well with DTG, silkscreen or embroidery.",
    price: 16,
    colors: [C.black, C.navy, C.grey, C.maroon, C.white, C.green],
    sizes: jacketSizes, sizeLabel: "Adult unisex", sizeRange: "S–2XL", sleeve: "Long", fabric: "Cotton blend",
    methods: ["dtg", "silkscreen", "embroidery", "dht"],
    badges: ["Best Seller", "Popular"],
    details: [
      { label: "Fabric", value: "50% cotton, 50% polyester fleece, 270 gsm" },
      { label: "Fit", value: "Relaxed. Size down for a closer fit." },
      { label: "Features", value: "Lined hood, drawcord, kangaroo pocket" },
      { label: "Care", value: "Machine wash cold, inside out. Tumble dry low." },
    ],
    sizeChart: hoodChart,
  },
  {
    slug: "zip-hoodie",
    name: "Heavy Blend Zip Hoodie",
    category: "hoodies", kind: "ziphoodie", brands: ["Gildan"],
    short: "A full-zip hoodie that is easy to layer.",
    description: "The same heavy fleece as our pullover with a full-length zip and two side pockets. Embroider the left chest, or print the back for a team name.",
    price: 19,
    colors: [C.black, C.navy, C.grey, C.maroon],
    sizes: jacketSizes, sizeLabel: "Adult unisex", sizeRange: "S–2XL", sleeve: "Long", fabric: "Cotton blend",
    methods: ["dtg", "silkscreen", "embroidery", "dht"],
    badges: [],
    details: [
      { label: "Fabric", value: "50% cotton, 50% polyester fleece, 270 gsm" },
      { label: "Fit", value: "Relaxed. Size down for a closer fit." },
      { label: "Features", value: "Full-length zip, lined hood, side pockets" },
      { label: "Care", value: "Machine wash cold, inside out. Tumble dry low." },
    ],
    sizeChart: hoodChart,
  },
  {
    slug: "varsity-jacket",
    name: "Varsity Jacket",
    category: "jackets", kind: "varsity", brands: ["North Harbour"],
    short: "A wool-look body with contrast sleeves. Built for school and club crests.",
    description: "A classic varsity with a snap front, ribbed collar, cuffs and hem, and contrast sleeves. Most orders are embroidered. We confirm every varsity job by quote because patches, names and numbers vary.",
    price: 42,
    colors: [C.navy, C.black, C.maroon, C.green],
    accent: "#EFE8D6",
    sizes: jacketSizes, sizeLabel: "Adult unisex", sizeRange: "S–2XL", sleeve: "Long", fabric: "Cotton blend",
    methods: ["embroidery", "dht"],
    badges: ["New"],
    quoteOnly: true,
    details: [
      { label: "Fabric", value: "Wool-look polyester body, faux-leather sleeves" },
      { label: "Fit", value: "Regular, with room for a hoodie underneath" },
      { label: "Features", value: "Snap front, ribbed collar, cuffs and hem, two pockets" },
      { label: "Care", value: "Spot clean or dry clean. Do not tumble dry." },
    ],
    sizeChart: jacketChart,
  },
  {
    slug: "wind-breaker",
    name: "Wind Breaker",
    category: "jackets", kind: "windbreaker", brands: ["North Harbour"],
    short: "A light water-resistant shell for outdoor events and staff.",
    description: "A packable nylon shell with a stand collar, full zip and elastic hem. It repels light rain and takes embroidery or heat transfer. We confirm each job by quote.",
    price: 28,
    colors: [C.navy, C.black, C.royal, C.red],
    sizes: jacketSizes, sizeLabel: "Adult unisex", sizeRange: "S–2XL", sleeve: "Long", fabric: "Nylon",
    methods: ["embroidery", "dht", "silkscreen"],
    badges: [],
    quoteOnly: true,
    details: [
      { label: "Fabric", value: "100% nylon, water-resistant finish" },
      { label: "Fit", value: "Regular, true to size" },
      { label: "Features", value: "Stand collar, full zip, side pockets, elastic hem" },
      { label: "Care", value: "Machine wash cold, hang dry. Do not iron." },
    ],
    sizeChart: jacketChart,
  },
  {
    slug: "bomber-jacket",
    name: "Bomber Jacket",
    category: "jackets", kind: "bomber", brands: ["North Harbour"],
    short: "A cropped bomber with ribbed trims for crews and clubs.",
    description: "A smooth polyester bomber with a ribbed collar, cuffs and hem and a zip front. A good canvas for a chest crest and a larger back design. We confirm each job by quote.",
    price: 38,
    colors: [C.black, C.navy, C.green, C.maroon],
    sizes: jacketSizes, sizeLabel: "Adult unisex", sizeRange: "S–2XL", sleeve: "Long", fabric: "Polyester",
    methods: ["embroidery", "dht"],
    badges: ["Popular"],
    quoteOnly: true,
    details: [
      { label: "Fabric", value: "100% polyester shell with quilted lining" },
      { label: "Fit", value: "Cropped, regular through the body" },
      { label: "Features", value: "Zip front, ribbed collar, cuffs and hem, two pockets" },
      { label: "Care", value: "Spot clean or dry clean. Do not tumble dry." },
    ],
    sizeChart: jacketChart,
  },
  {
    slug: "vinyl-banner",
    name: "Vinyl Banner",
    category: "accessories", kind: "banner", brands: ["EL Print"],
    short: "Weatherproof banners with hemmed edges and grommets.",
    description: "A 13 oz vinyl banner printed in full colour, with hemmed edges and a grommet in each corner. Good for events, shopfronts and booths, indoors or outdoors.",
    price: 38,
    colors: [C.white],
    sizes: [{ label: "2 ft × 6 ft", add: 0 }, { label: "3 ft × 8 ft", add: 30 }, { label: "4 ft × 10 ft", add: 62 }],
    sizeLabel: "Banner size", sizeRange: "3 sizes", sleeve: "None", fabric: "Vinyl",
    methods: ["banners-stickers"],
    badges: ["No Min Order", "Rush Available"],
    details: [
      { label: "Material", value: "13 oz matte vinyl, weatherproof" },
      { label: "Finish", value: "Hemmed edges, grommets in each corner" },
      { label: "Use", value: "Indoor and outdoor" },
      { label: "Care", value: "Wipe clean with a damp cloth." },
    ],
    tips: ["Send artwork at full size, or at half size at 150 DPI.", "Keep text and logos 5 cm away from the edges."],
  },
  {
    slug: "vinyl-stickers",
    name: "Die-cut Vinyl Stickers",
    category: "accessories", kind: "sticker", brands: ["EL Print"],
    short: "Waterproof stickers cut to your shape. Priced per set of 10.",
    description: "Glossy waterproof vinyl stickers cut to the outline of your design. One unit is a set of 10. Use them on laptops, bottles, packaging and merchandise.",
    price: 12,
    colors: [C.white],
    sizes: [{ label: "50 mm", add: 0 }, { label: "75 mm", add: 4 }, { label: "100 mm", add: 8 }],
    sizeLabel: "Sticker size", sizeRange: "3 sizes", sleeve: "None", fabric: "Vinyl",
    methods: ["banners-stickers"],
    badges: ["Popular", "No Min Order"],
    details: [
      { label: "Material", value: "Glossy waterproof vinyl with strong adhesive" },
      { label: "Finish", value: "Die-cut to your outline" },
      { label: "Unit", value: "One unit is a set of 10 stickers" },
      { label: "Care", value: "Indoor and outdoor safe. Wipe clean." },
    ],
    tips: ["Add a 3 mm bleed around your artwork.", "Use a solid shape for the cut line."],
  },
];

export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>;

export function productsIn(category: CategoryId) {
  return products.filter((p) => p.category === category);
}

export function categoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export const isAccessory = (p: Product) => p.category === "accessories";

export const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
