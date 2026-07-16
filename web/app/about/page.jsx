import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "เกี่ยวกับเรา | Infinite Material & Technology ผู้เชี่ยวชาญสีกันไฟ",
  description: "บริษัท อินฟินิท แมททีเรียล แอนด์ เทคโนโลยี จำกัด ผู้ผลิตและจำหน่ายสีกันไฟ Neocoat พร้อมทีมวิศวกรโยธารับรอง",
};

export default function Page() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "app", "_content", "about.html"),
    "utf8"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
