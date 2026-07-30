import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { PRODUCTS, bySlug } from "../../_data/products";

/* nav + footer อยู่ในไฟล์ _product-head/_product-foot ไฟล์เดียว ไม่ก๊อป 11 รอบ
   เนื้อ body ของแต่ละสินค้าอยู่ _content/products/<slug>.html */
const read = (...seg) =>
  fs.readFileSync(path.join(process.cwd(), "app", "_content", ...seg), "utf8");

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = bySlug(params.slug);
  if (!p) return {};
  return { title: p.title, description: p.description };
}

export default function Page({ params }) {
  const p = bySlug(params.slug);
  if (!p) notFound();

  let body;
  try {
    body = read("products", `${p.slug}.html`);
  } catch {
    notFound();
  }

  const html = read("_product-head.html") + body + read("_product-foot.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
