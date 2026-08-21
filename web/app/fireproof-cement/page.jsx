import fs from "node:fs";
import path from "node:path";

/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/fireproof-cement.html */
const read = (...seg) =>
  fs.readFileSync(path.join(process.cwd(), "app", "_content", ...seg), "utf8");

export const metadata = {
  title: "ซีเมนต์พ่นกันไฟ Mandolite CP-2 · Fendolite M II | ทนไฟ 1–3 ชม. ราคาโรงงาน",
  description:
    "ซีเมนต์พ่นกันไฟส่วนผสมเวอร์มิคูไลท์และซีเมนต์ ปราศจาก Asbestos และ Fiber ผ่านทดสอบ U.L. มีทั้ง Mandolite CP-2 งานภายใน 12.5 กก. และ Fendolite M II งานภายนอก 20 กก. ปรึกษาฟรี เสนอราคาใน 24 ชม.",
  // หน้ายิงแอด ไม่ต้องการให้แข่ง ranking กับหน้าสินค้าจริงใน organic
  robots: { index: false, follow: true },
};

export default function LandingPage() {
  const html = read("_lp-head.html") + read("lp", "fireproof-cement.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
