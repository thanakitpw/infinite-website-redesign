import { notFound } from "next/navigation";
import { ARTICLES, renderArticlePage, unlinkUnpublished, faqSchema } from "../../_content/articles/_shell";
import { renderFragments, hasFragment } from "../../../lib/cms/render";

const BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

/* บทที่ตั้งวันเผยแพร่ล่วงหน้าก็ prerender เป็นหน้าเต็มไว้ตั้งแต่ build — middleware.js
   เป็นตัวตอบ 404 จนถึงวัน ห้ามเรียก notFound() ตามวันที่ในหน้านี้: ISR เก็บ 404 ไว้
   แล้วไม่ต่ออายุ (ทดสอบแล้ว 2026-10-26) บทจะไม่ขึ้นเองอีกเลยจนกว่าจะ deploy ใหม่
   revalidate ไว้ให้ลิงก์ไปบทอื่นที่เพิ่งถึงวัน กับบทความที่เกี่ยวข้อง อัปเดตตาม */
export const revalidate = 3600;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const a = BY_SLUG[params.slug];
  if (!a) return {};
  const title = `${a.seoTitle || a.title} | Infinite Material & Technology`;
  const description = a.description || a.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/articles/${a.slug}` },
    openGraph: { title, description, type: "article", ...(a.image && { images: [{ url: a.image, width: a.w, height: a.h }] }) },
  };
}

export default async function Page({ params }) {
  const a = BY_SLUG[params.slug];
  if (!a) notFound();

  /* เมนูกับส่วนท้ายของหน้าบทความประกอบใน _shell.js ด้วย template string ไม่ใช่
     ไฟล์ HTML จึงยังไม่เข้าระบบหลังบ้านในเฟสนี้ — เนื้อบทความแก้ได้แล้ว */
  const frag = `articles/${a.slug}.html`;
  if (!hasFragment(frag)) notFound();

  const body = unlinkUnpublished(await renderFragments([frag]));
  const faq = faqSchema(a);
  return (
    <>
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />}
      <div dangerouslySetInnerHTML={{ __html: renderArticlePage(a, body) }} />
    </>
  );
}
