import { renderFragments } from "../../lib/cms/render";
import { liveArticles, articleCard } from "../_content/articles/_shell";

export const metadata = {
  title: "บทความ & ความรู้เรื่องสีกันไฟ | Infinite Material & Technology",
  description: "บทความให้ความรู้เรื่องสีกันไฟ วิธีเลือก วิธีคำนวณปริมาณ มาตรฐาน ISO 834 · ASTM E119 และการใช้งานวัสดุกันไฟ",
};

// บทที่ตั้งวันเผยแพร่ล่วงหน้าจะโผล่ในรายการเองเมื่อถึงวัน (ดู isLive ใน schedule.js)
export const revalidate = 3600;

const GRID_OPEN = /(<!-- GRID -->\s*<div[^>]*>)/;

export default async function Page() {
  const html = await renderFragments(["articles.html"]);
  /* การ์ดที่เขียนไว้ใน articles.html คงไว้ตามเดิม (หลังบ้านแก้ได้) บทใหม่ที่ไม่มีการ์ดในไฟล์
     ต่อไว้หน้าสุดของกริด ใหม่สุดก่อน — ต่อหลังทับค่าจากหลังบ้านแล้ว เลขบล็อกจึงไม่เลื่อน */
  const fresh = liveArticles()
    .filter((a) => !html.includes(`href="/articles/${a.slug}"`))
    .sort((x, y) => (y.publishAt || "").localeCompare(x.publishAt || ""))
    .map(articleCard)
    .join("\n    ");
  return <div dangerouslySetInnerHTML={{ __html: fresh ? html.replace(GRID_OPEN, `$1\n    ${fresh}`) : html }} />;
}
