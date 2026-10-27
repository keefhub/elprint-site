import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap section">
      <h1>We can&apos;t find that page.</h1>
      <p className="lead mt-3 max-w-xl">The link may be old or mistyped. Try one of these instead.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/shop/" className="btn btn-primary">Browse products</Link>
        <Link href="/services/" className="btn btn-secondary">See services</Link>
        <Link href="/contact/" className="btn btn-secondary">Contact us</Link>
      </div>
    </div>
  );
}
