import fs from "node:fs";
import path from "node:path";

/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/thinner.html */
const read = (...seg) =>
  fs.readFileSync(path.join(process.cwd(), "app", "_content", ...seg), "utf8");

export const metadata = {
  title: "ทินเนอร์ 3A · 2K · น้ำมันสน อินทนิล | ราคาโรงงาน ขายส่ง–ขายปลีก พร้อมส่ง",
  description:
    "ทินเนอร์ AAA (3A) ผสมสีอุตสาหกรรม ทินเนอร์ 2K งานสีพ่นรถยนต์ และน้ำมันสนเชียงใหม่ แบรนด์อินทนิล ขนาด 15 กก. ราคาโรงงาน ขายตรงไม่ผ่านคนกลาง สั่งได้ทั้งขายส่งและขายปลีก",
  // หน้ายิงแอด ไม่ต้องการให้แข่ง ranking กับหน้าสินค้าจริงใน organic
  robots: { index: false, follow: true },
};

export default function LandingPage() {
  const html = read("_lp-head.html") + read("lp", "thinner.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
