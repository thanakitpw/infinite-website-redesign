import fs from "node:fs";
import path from "node:path";

/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/engineering.html
   ต่างจาก landing page อื่นตรงที่หน้านี้ขายบริการ ไม่ใช่สินค้า — เนื้อหาบริการ
   ทั้ง 5 ข้อดึงมาจาก _content/services.html แก้ที่นั่นแล้วต้องแก้ที่นี่ด้วย */
const read = (...seg) =>
  fs.readFileSync(path.join(process.cwd(), "app", "_content", ...seg), "utf8");

export const metadata = {
  title: "งานรับรองสีกันไฟ ตรวจสอบโครงสร้างอาคาร | วุฒิวิศวกรโยธา — ปรึกษาฟรี",
  description:
    "รับงานวิศวกรรมโยธาครบวงจร รับรองงานสีกันไฟ ตรวจรับรองอาคารและโรงงาน ตรวจสอบและออกแบบโครงสร้าง รับรองงานฐานราก คำนวณความหนาฟิล์มตามค่า Hp/A ลงนามโดยวุฒิวิศวกรโยธา ประเมินฟรีใน 24 ชม.",
  // หน้ายิงแอด ไม่ต้องการให้แข่ง ranking กับหน้า /services ใน organic
  robots: { index: false, follow: true },
};

export default function LandingPage() {
  const html = read("_lp-head.html") + read("lp", "engineering.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
