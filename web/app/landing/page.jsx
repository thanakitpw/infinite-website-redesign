import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "สีกันไฟโครงสร้างเหล็ก | ประเมินราคาฟรี รับรองโดยวุฒิวิศวกรโยธา — Infinite Material & Technology",
  description: "สีกันไฟ Neocoat Intumescent Paint มาตรฐาน ISO 834 · ASTM E-119 ทดสอบโดยจุฬาฯ และ TUV SUD ราคาโรงงาน ครบวงจร พร้อมวิศวกรโยธารับรองงาน ปรึกษาฟรี",
};

export default function LandingPage() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "app", "_content", "landing.html"),
    "utf8"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
