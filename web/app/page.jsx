import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "สีกันไฟ Neocoat มาตรฐาน ISO 834 | ราคาโรงงาน รับรองโดยวิศวกร",
  description: "สีกันไฟโครงสร้างเหล็ก Neocoat Intumescent Paint สูตรน้ำ/น้ำมัน ทนไฟ 1–3 ชม. มาตรฐาน ISO 834 · ASTM E119 รับรองโดยวิศวกรโยธา",
};

export default function Page() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "app", "_content", "home.html"),
    "utf8"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
