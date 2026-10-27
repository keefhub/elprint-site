import type { Metadata } from "next";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { DesignLab } from "@/components/ProductExperience";

export const metadata: Metadata = {
  title: "Design Lab",
  description: "Upload your artwork, preview it on the garment and see the price as you choose.",
};

export default function DesignPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Design Lab" }]} />
      <PageHeader title="Design Lab" lead="Upload artwork or type your text, then preview it on the garment. The price updates as you choose." />
      <DesignLab />
    </>
  );
}
