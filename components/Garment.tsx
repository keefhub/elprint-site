import { luminance, type GarmentKind, type MethodId, type PrintLocation } from "@/lib/catalog";

export type GarmentView = "front" | "back" | "detail";

interface Props {
  kind: GarmentKind;
  color: string;
  accent?: string;
  view?: GarmentView;
  text?: string;
  method?: MethodId;
  /** Thumbnail data URL of the customer's artwork. */
  artwork?: string;
  locations?: PrintLocation[];
  /** Show a faint "Your design" placeholder when nothing is set. */
  placeholder?: boolean;
  label: string;
  className?: string;
  /** Plays the load animation on the crop marks and ink (hero only). */
  animate?: boolean;
}

interface Area { x: number; y: number; w: number; h: number; rot?: number }

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

const SHORT = (H: number) =>
  `M130 40 L60 75 L20 150 L75 175 L100 142 L100 ${H} L300 ${H} L300 142 L325 175 L380 150 L340 75 L270 40`;
const LONG = (H: number) =>
  `M130 40 L68 66 L22 330 L74 342 L100 168 L100 ${H} L300 ${H} L300 168 L326 342 L378 330 L332 66 L270 40`;
const NECK = (back: boolean) =>
  back ? "C255 52 228 56 200 56 C172 56 145 52 130 40Z" : "C255 62 228 72 200 72 C172 72 145 62 130 40Z";

const isLong = (k: GarmentKind) => !["tee", "polo", "banner", "sticker"].includes(k);

function printArea(kind: GarmentKind, view: GarmentView): Area {
  if (kind === "banner") return { x: 55, y: 125, w: 290, h: 150 };
  if (kind === "sticker") return { x: 120, y: 130, w: 160, h: 160 };
  if (kind === "polo") return { x: 215, y: 100, w: 60, h: 60 };
  if (view === "back") return { x: 130, y: 90, w: 140, h: 170 };
  return { x: 140, y: 98, w: 120, h: 120 };
}

function sleeveArea(kind: GarmentKind): Area {
  return isLong(kind) ? { x: 36, y: 150, w: 34, h: 60, rot: -10 } : { x: 32, y: 104, w: 34, h: 28, rot: -28 };
}

function wrap(text: string, max = 12) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + w).length <= max) lines[lines.length - 1] = last + " " + w;
    else lines.push(w);
  }
  return lines.slice(0, 4);
}

function PrintContent({ area, text, artwork, method, ink, placeholder, animate }: {
  area: Area; text?: string; artwork?: string; method?: MethodId; ink: string; placeholder?: boolean; animate?: boolean;
}) {
  const cls = animate ? "proof-ink" : undefined;
  if (artwork) {
    return <image className={cls} href={artwork} x={area.x} y={area.y} width={area.w} height={area.h} preserveAspectRatio="xMidYMid meet" />;
  }
  const lines = wrap(text ?? "");
  if (!lines.length) {
    if (!placeholder) return null;
    return (
      <text x={area.x + area.w / 2} y={area.y + area.h / 2} textAnchor="middle" dominantBaseline="middle"
        fontSize={Math.min(16, area.w / 7)} fill={ink} opacity={0.45}>Your design</text>
    );
  }
  const longest = Math.max(...lines.map((l) => l.length));
  const size = Math.max(10, Math.min(34, area.w / (longest * 0.6), area.h / (lines.length * 1.25)));
  const startY = area.y + area.h / 2 - ((lines.length - 1) * size * 1.15) / 2;
  const embroidered = method === "embroidery";
  return (
    <g className={cls}>
      {embroidered && (
        <defs>
          <pattern id="stitch-fill" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="3" height="3" fill={ink} /><rect width="3" height="1" fill="#fff" opacity="0.28" />
          </pattern>
        </defs>
      )}
      {lines.map((line, i) => (
        <text key={i} x={area.x + area.w / 2} y={startY + i * size * 1.15}
          textAnchor="middle" dominantBaseline="middle" fontSize={size}
          fontWeight={method === "silkscreen" ? 900 : 800}
          fill={embroidered ? "url(#stitch-fill)" : ink}
          stroke={embroidered ? ink : "none"} strokeWidth={embroidered ? 0.6 : 0}
          strokeDasharray={embroidered ? "2 1.2" : undefined}
          style={{ letterSpacing: "-0.02em" }}>
          {line}
        </text>
      ))}
    </g>
  );
}

function CropMarks({ a, animate }: { a: Area; animate?: boolean }) {
  const p = 6, l = 10;
  const x0 = a.x - p, y0 = a.y - p, x1 = a.x + a.w + p, y1 = a.y + a.h + p;
  return (
    <g className={animate ? "proof-marks" : undefined} stroke="#6B7280" strokeWidth="1.5" fill="none" strokeLinecap="square">
      <path d={`M${x0} ${y0 + l}V${y0}H${x0 + l}`} />
      <path d={`M${x1 - l} ${y0}H${x1}V${y0 + l}`} />
      <path d={`M${x0} ${y1 - l}V${y1}H${x0 + l}`} />
      <path d={`M${x1 - l} ${y1}H${x1}V${y1 - l}`} />
    </g>
  );
}

export function Garment({
  kind, color, accent, view = "front", text, method, artwork, locations = ["front"], placeholder = true, label, className, animate,
}: Props) {
  const back = view === "back";
  const stroke = shade(color, -0.28);
  const ink = luminance(color) > 0.55 ? "#1A1A1A" : "#FFFFFF";
  const dark = shade(color, -0.12);
  const H = kind === "bomber" ? 345 : isLong(kind) || kind === "polo" ? 372 : 360;
  const sleeves = isLong(kind) ? LONG(H) : SHORT(H);
  const silhouette = `${sleeves} ${NECK(back)}`;
  const hasFront = locations.includes("front");
  const hasBack = locations.includes("back");
  const hasSleeve = locations.includes("sleeve");
  const viewBox = view === "detail"
    ? kind === "banner" ? "40 100 320 200" : kind === "sticker" ? "100 110 200 200" : "105 65 190 190"
    : "0 0 400 420";

  const isGarment = kind !== "banner" && kind !== "sticker";
  const area = printArea(kind, view === "detail" ? "front" : view);
  const showPrint = view === "back" ? hasBack : hasFront;
  const sleeve = sleeveArea(kind);

  return (
    <svg role="img" aria-label={label} viewBox={viewBox} className={className} xmlns="http://www.w3.org/2000/svg">
      {kind === "banner" && (
        <g>
          <rect x="30" y="100" width="340" height="200" rx="4" fill={color} stroke={stroke} strokeWidth="2" />
          <rect x="38" y="108" width="324" height="184" rx="2" fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="4 3" />
          {[[44, 114], [356, 114], [44, 286], [356, 286]].map(([cx, cy]) => (
            <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="4" fill="#fff" stroke={stroke} strokeWidth="1.5" />
          ))}
        </g>
      )}
      {kind === "sticker" && (
        <g>
          <circle cx="200" cy="210" r="112" fill="#fff" stroke={stroke} strokeWidth="2" />
          <circle cx="200" cy="210" r="102" fill={color} stroke={stroke} strokeWidth="1" strokeDasharray="4 3" />
        </g>
      )}

      {isGarment && (
        <g strokeLinejoin="round">
          {(kind === "hoodie" || kind === "ziphoodie") && !back && (
            <path d="M128 48 C112 -14 288 -14 272 48 C250 84 150 84 128 48Z" fill={dark} stroke={stroke} strokeWidth="2" />
          )}
          {kind === "varsity" ? (
            <>
              <path d={silhouette} fill={accent ?? "#EFE8D6"} stroke={stroke} strokeWidth="2" />
              <path d={`M130 40 L100 52 L100 ${H} L300 ${H} L300 52 L270 40 ${NECK(back)}`} fill={color} stroke={stroke} strokeWidth="2" />
            </>
          ) : (
            <path d={silhouette} fill={color} stroke={stroke} strokeWidth="2" />
          )}
          {/* neckline */}
          {!back && (kind === "tee" || kind === "longsleeve") && (
            <path d="M130 40 C145 62 172 72 200 72 C228 72 255 62 270 40" fill="none" stroke={stroke} strokeWidth="5" />
          )}
          {back && <path d="M130 40 C145 52 172 56 200 56 C228 56 255 52 270 40" fill="none" stroke={stroke} strokeWidth="2" />}
          {(kind === "hoodie" || kind === "ziphoodie") && (
            back ? (
              <path d="M130 40 C150 96 250 96 270 40 C250 72 150 72 130 40Z" fill={dark} stroke={stroke} strokeWidth="2" />
            ) : (
              <>
                <path d="M140 46 C160 86 240 86 260 46 C240 30 160 30 140 46Z" fill={shade(color, -0.42)} stroke={stroke} strokeWidth="2" />
                {kind === "hoodie" && <path d="M182 78 V140 M218 78 V140" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />}
              </>
            )
          )}
          {kind === "hoodie" && !back && <path d="M128 285 H272 L292 365 H108Z" fill="none" stroke={stroke} strokeWidth="2" />}
          {kind === "ziphoodie" && !back && <path d="M200 84 V372" stroke={stroke} strokeWidth="3" fill="none" />}
          {kind === "polo" && !back && (
            <g fill={dark} stroke={stroke} strokeWidth="1.5">
              <path d="M128 38 L172 30 L200 76 L158 68Z" /><path d="M272 38 L228 30 L200 76 L242 68Z" />
              <path d="M200 76 V150" fill="none" /><circle cx="200" cy="100" r="3" /><circle cx="200" cy="124" r="3" />
            </g>
          )}
          {(kind === "bomber" || kind === "varsity") && (
            <g fill={kind === "varsity" ? (accent ?? "#EFE8D6") : shade(color, -0.1)} stroke={stroke} strokeWidth="2">
              <rect x="100" y={H - 24} width="200" height="24" />
              {kind === "bomber" ? (
                <>
                  <path d="M26 306 L78 318 L74 342 L22 330Z" /><path d="M374 306 L322 318 L326 342 L378 330Z" />
                </>
              ) : (
                <>
                  <path d="M26 306 L78 318 L74 342 L22 330Z" /><path d="M374 306 L322 318 L326 342 L378 330Z" />
                </>
              )}
              {!back && <path d={`M130 40 C145 ${kind === "bomber" ? 62 : 62} 172 72 200 72 C228 72 255 62 270 40`} fill="none" strokeWidth="7" />}
            </g>
          )}
          {(kind === "bomber" || kind === "windbreaker") && !back && <path d={`M200 74 V${H - 24}`} stroke={stroke} strokeWidth="3" fill="none" />}
          {kind === "varsity" && !back && (
            <g fill={shade(color, 0.2)} stroke={stroke} strokeWidth="1">
              {[110, 170, 230, 290].map((y) => <circle key={y} cx="200" cy={y} r="4" />)}
            </g>
          )}
          {kind === "windbreaker" && (
            <g fill="none" stroke={stroke} strokeWidth="2">
              {!back && <path d="M138 36 L200 30 L262 36 L262 64 C240 78 160 78 138 64Z" fill={dark} />}
              <path d={`M100 ${H - 22} H300`} />
              <path d="M100 160 H300" opacity="0.5" />
            </g>
          )}
        </g>
      )}

      {/* Print area: crop marks mean "a print goes here" */}
      <CropMarks a={area} animate={animate} />
      {showPrint && (
        <PrintContent area={area} text={text} artwork={artwork} method={method} ink={ink} placeholder={placeholder} animate={animate} />
      )}
      {isGarment && hasSleeve && view !== "back" && (
        <g transform={sleeve.rot ? `rotate(${sleeve.rot} ${sleeve.x + sleeve.w / 2} ${sleeve.y + sleeve.h / 2})` : undefined}>
          <rect x={sleeve.x} y={sleeve.y} width={sleeve.w} height={sleeve.h} fill="none" stroke={ink} strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
          <PrintContent area={sleeve} text={text ? text.split(/\s+/)[0] : ""} artwork={artwork} method={method} ink={ink} />
        </g>
      )}
    </svg>
  );
}
