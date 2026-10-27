import type { Metadata } from "next";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <PageHeader title="Your cart" />
      <CartView />
    </>
  );
}
