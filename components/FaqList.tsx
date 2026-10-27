import { Icon } from "./Icon";

export interface FaqItem { q: string; a: React.ReactNode }

/** Native <details> accordion: keyboard and screen-reader friendly with no JavaScript. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group py-1">
          <summary className="flex min-h-11 list-none items-center justify-between gap-4 py-2 font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
            {item.q}
            <Icon name="chevron-down" className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="max-w-[68ch] pb-4 pr-8">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
