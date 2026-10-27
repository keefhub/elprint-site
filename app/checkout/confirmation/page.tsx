import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Confirmation } from "@/components/Confirmation";

export const metadata: Metadata = { title: "Order confirmation" };

export default function ConfirmationPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Checkout", href: "/checkout/" }, { label: "Confirmation" }]} />
      <div className="pt-6"><Confirmation /></div>
    </>
  );
}
