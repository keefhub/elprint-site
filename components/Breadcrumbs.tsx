import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="wrap pt-4 lg:pt-6">
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        {all.map((item, i) => {
          const last = i === all.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="inline-flex min-h-11 items-center text-muted no-underline hover:text-teal hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">{item.label}</span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHeader({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="wrap pb-8 pt-2 lg:pb-12">
      <h1 className="max-w-3xl">{title}</h1>
      {lead && <p className="lead mt-3 max-w-2xl">{lead}</p>}
      {children}
    </div>
  );
}
