import type { Metadata } from "next";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { CheckoutFlow } from "@/components/CheckoutFlow";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Cart", href: "/cart/" }, { label: "Checkout" }]} />
      <PageHeader title="Checkout" lead="No account needed. You pay after you approve the digital proof." />
      <CheckoutFlow />
    </>
  );
}
