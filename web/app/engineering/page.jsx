import { renderFragments } from "../../lib/cms/render";
/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/engineering.html
   ต่างจาก landing page อื่นตรงที่หน้านี้ขายบริการ ไม่ใช่สินค้า — เนื้อหาบริการ
   ทั้ง 5 ข้อดึงมาจาก _content/services.html แก้ที่นั่นแล้วต้องแก้ที่นี่ด้วย */

export const metadata = {
  title: "งานรับรองสีกันไฟ ตรวจสอบโครงสร้างอาคาร | วุฒิวิศวกรโยธา — ปรึกษาฟรี",
  description:
    "รับงานวิศวกรรมโยธาครบวงจร รับรองงานสีกันไฟ ตรวจรับรองอาคารและโรงงาน ตรวจสอบและออกแบบโครงสร้าง รับรองงานฐานราก คำนวณความหนาฟิล์มตามค่า Hp/A ลงนามโดยวุฒิวิศวกรโยธา ประเมินฟรีใน 24 ชม.",
  /* เคยใส่ robots noindex ไว้กันไม่ให้แข่ง ranking กับหน้า /services แต่ Google Ads
     ตีตกหน้า noindex เป็น "ปลายทางใช้งานไม่ได้" ยิงแอดไม่ได้ทั้ง 7 หน้า
     canonical กันชนกันใน organic ได้เหมือนกันโดยที่หน้ายังยิงแอดได้ */
  alternates: { canonical: "/services" },
};

export default async function LandingPage() {
  const html = await renderFragments(["_lp-head.html", "lp/engineering.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
