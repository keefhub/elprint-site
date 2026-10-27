import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, PageHeader } from "@/components/Breadcrumbs";
import { ProductExperience } from "@/components/ProductExperience";
import { ShopBrowser } from "@/components/ShopBrowser";
import { categories, categoryById, productBySlug, productsIn } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

/** /shop/[slug] serves both category pages (t-shirts) and product pages (heavy-cotton-tee). */
export function generateStaticParams() {
  return [
    ...categories.map((c) => ({ slug: c.id })),
    ...Object.keys(productBySlug).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryById(slug);
  if (category) return { title: category.name, description: category.blurb };
  const product = productBySlug[slug];
  return product ? { title: product.name, description: product.short } : {};
}

export default async function ShopSlugPage({ params }: Props) {
  const { slug } = await params;

  const category = categoryById(slug);
  if (category) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Shop", href: "/shop/" }, { label: category.name }]} />
        <PageHeader title={category.name} lead={category.blurb} />
        <ShopBrowser products={productsIn(category.id)} />
      </>
    );
  }

  const product = productBySlug[slug];
  if (!product) notFound();
  const cat = categoryById(product.category)!;
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Shop", href: "/shop/" }, { label: cat.name, href: `/shop/${cat.id}/` }, { label: product.name }]}
      />
      <div className="wrap pb-16 pt-2">
        <ProductExperience product={product} mode="page" />
      </div>
    </>
  );
}
