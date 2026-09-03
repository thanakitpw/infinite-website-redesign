import { renderFragments } from "../../lib/cms/render";
/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/fireproof-cement.html */

export const metadata = {
  title: "ซีเมนต์พ่นกันไฟ Mandolite CP-2 · Fendolite M II | ทนไฟ 1–3 ชม. ราคาโรงงาน",
  description:
    "ซีเมนต์พ่นกันไฟส่วนผสมเวอร์มิคูไลท์และซีเมนต์ ปราศจาก Asbestos และ Fiber ผ่านทดสอบ U.L. มีทั้ง Mandolite CP-2 งานภายใน 12.5 กก. และ Fendolite M II งานภายนอก 20 กก. ปรึกษาฟรี เสนอราคาใน 24 ชม.",
  /* เคยใส่ robots noindex ไว้กันไม่ให้แข่ง ranking กับหน้าสินค้าจริง แต่ Google Ads
     ตีตกหน้า noindex เป็น "ปลายทางใช้งานไม่ได้" ยิงแอดไม่ได้ทั้ง 7 หน้า
     canonical กันชนกันใน organic ได้เหมือนกันโดยที่หน้ายังยิงแอดได้ */
  alternates: { canonical: "/product/fendolite-m2" },
};

export default async function LandingPage() {
  const html = await renderFragments(["_lp-head.html", "lp/fireproof-cement.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
