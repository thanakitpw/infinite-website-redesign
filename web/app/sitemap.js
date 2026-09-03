import { SITE_URL } from "./_data/site";
import { PRODUCTS } from "./_data/products";
import { SERVICES } from "./_data/services";
import { ARTICLES } from "./_content/articles/_shell";

/* หน้า landing ทั้ง 7 (/neocoat, /fireproof-cement, /fire-blanket, /roof-shield,
   /four-plus, /thinner, /engineering) ไม่อยู่ในนี้โดยตั้งใจ — มันชี้ canonical ไป
   หน้าสินค้า/บริการจริงอยู่แล้ว ประกาศซ้ำใน sitemap จะขัดกันเอง */
const STATIC = ["/", "/about", "/products", "/services", "/standards", "/articles", "/contact"];

export default function sitemap() {
  const now = new Date();
  const url = (path, priority) => ({ url: `${SITE_URL}${path}`, lastModified: now, priority });

  return [
    ...STATIC.map((p) => url(p, p === "/" ? 1 : 0.8)),
    ...PRODUCTS.map((p) => url(`/product/${p.slug}`, 0.7)),
    ...SERVICES.map((s) => url(`/services/${s.slug}`, 0.7)),
    ...ARTICLES.map((a) => url(`/articles/${a.slug}`, 0.6)),
  ];
}
