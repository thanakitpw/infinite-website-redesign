import { notFound } from "next/navigation";
import { ARTICLES, renderArticlePage } from "../../_content/articles/_shell";
import { renderFragments, hasFragment } from "../../../lib/cms/render";

const BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const a = BY_SLUG[params.slug];
  if (!a) return {};
  return {
    title: `${a.title} | Infinite Material & Technology`,
    description: a.excerpt,
  };
}

export default async function Page({ params }) {
  const a = BY_SLUG[params.slug];
  if (!a) notFound();

  /* เมนูกับส่วนท้ายของหน้าบทความประกอบใน _shell.js ด้วย template string ไม่ใช่
     ไฟล์ HTML จึงยังไม่เข้าระบบหลังบ้านในเฟสนี้ — เนื้อบทความแก้ได้แล้ว */
  const frag = `articles/${a.slug}.html`;
  if (!hasFragment(frag)) notFound();

  const body = await renderFragments([frag]);
  return <div dangerouslySetInnerHTML={{ __html: renderArticlePage(a, body) }} />;
}
