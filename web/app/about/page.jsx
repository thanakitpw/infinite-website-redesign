import { renderFragments } from "../../lib/cms/render";

export const metadata = {
  title: "เกี่ยวกับเรา | Infinite Material & Technology ผู้เชี่ยวชาญสีกันไฟ",
  description: "บริษัท อินฟินิท แมททีเรียล แอนด์ เทคโนโลยี จำกัด ผู้ผลิตและจำหน่ายสีกันไฟ Neocoat พร้อมทีมวิศวกรโยธารับรอง",
};

export default async function Page() {
  const html = await renderFragments(["about.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
