import { renderFragments } from "../../lib/cms/render";
/* CSS ของ .lp ถูกแยกไปไว้ที่ _content/_lp-head.html แล้ว เพราะตอนนี้มี landing
   page 6 หน้าที่ใช้ชุดเดียวกัน (pattern เดียวกับ _product-head.html ของหน้าสินค้า) */

export const metadata = {
  title: "สีกันไฟโครงสร้างเหล็ก Neocoat | ทนไฟ 1–3 ชม. ตามกฎกระทรวง 2566 — ประเมินราคาฟรี",
  description:
    "สีกันไฟ Neocoat Intumescent Paint สูตรน้ำมัน/สูตรน้ำ Low VOC ผ่านทดสอบ ISO 834 · ASTM E119 จาก FSRG · TÜV SÜD · จุฬาฯ วิศวกรโยธาคำนวณความหนาและออกเอกสารรับรองให้ ปรึกษาฟรี",
  /* เคยใส่ robots noindex ไว้กันไม่ให้แข่ง ranking กับหน้าสินค้าจริง แต่ Google Ads
     ตีตกหน้า noindex เป็น "ปลายทางใช้งานไม่ได้" ยิงแอดไม่ได้ทั้ง 7 หน้า
     canonical กันชนกันใน organic ได้เหมือนกันโดยที่หน้ายังยิงแอดได้ */
  alternates: { canonical: "/product/neocoat-intumescent-paint-s" },
};

export default async function LandingPage() {
  const html = await renderFragments(["_lp-head.html", "neocoat.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
