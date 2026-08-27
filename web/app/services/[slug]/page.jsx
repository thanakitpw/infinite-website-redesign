import { notFound } from "next/navigation";
import { SERVICES, serviceBySlug } from "../../_data/services";
import { renderFragments, hasFragment, markNav } from "../../../lib/cms/render";

/* หน้าบริการรายตัว — ใช้เมนู/ส่วนท้ายไฟล์เดียวกับหน้าสินค้า (_product-head/_product-foot)
   จะได้ไม่ก๊อปเมนูเพิ่มอีกสามชุด แก้เมนูครั้งเดียวมีผลทั้งหน้าสินค้าและหน้าบริการ
   เนื้อของแต่ละบริการอยู่ _content/services/<slug>.html */

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }) {
  const s = serviceBySlug(params.slug);
  if (!s) return {};
  return { title: s.title, description: s.description };
}

export default async function Page({ params }) {
  const s = serviceBySlug(params.slug);
  if (!s) notFound();

  const body = `services/${s.slug}.html`;
  if (!hasFragment(body)) notFound();

  const html = markNav(
    await renderFragments(["_product-head.html", body, "_product-foot.html"]),
    "services"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
