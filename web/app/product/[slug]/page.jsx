import { notFound } from "next/navigation";
import { PRODUCTS, bySlug } from "../../_data/products";
import { renderFragments, hasFragment, markNav } from "../../../lib/cms/render";

/* nav + footer อยู่ในไฟล์ _product-head/_product-foot ไฟล์เดียว ไม่ก๊อป 11 รอบ
   เนื้อ body ของแต่ละสินค้าอยู่ _content/products/<slug>.html
   ทั้งสามชิ้นผ่าน renderFragments เพื่อทับค่าที่แก้จากหลังบ้าน — แก้ nav ครั้งเดียว
   มีผลทุกหน้าสินค้า เพราะค่าผูกกับไฟล์ ไม่ใช่หน้า */

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = bySlug(params.slug);
  if (!p) return {};
  return { title: p.title, description: p.description };
}

export default async function Page({ params }) {
  const p = bySlug(params.slug);
  if (!p) notFound();

  const body = `products/${p.slug}.html`;
  if (!hasFragment(body)) notFound();

  const html = markNav(
    await renderFragments(["_product-head.html", body, "_product-foot.html"]),
    "products"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
