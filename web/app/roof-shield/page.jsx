import { renderFragments } from "../../lib/cms/render";
/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/roof-shield.html */

export const metadata = {
  title: "สีเซรามิคสะท้อนความร้อน Roof Shield | ลดร้อน 93% ประหยัดไฟ 30% ราคาโรงงาน",
  description:
    "สีเซรามิคโค๊ตติ้ง Roof Shield White อะคริลิคสูตรน้ำ สะท้อนรังสีอินฟราเรด ลดความร้อนสูงสุด 93% ลดอุณหภูมิผิวหลังคากว่า 10 องศา ประหยัดค่าไฟกว่า 30% ปรึกษาฟรี",
  /* เคยใส่ robots noindex ไว้กันไม่ให้แข่ง ranking กับหน้าสินค้าจริง แต่ Google Ads
     ตีตกหน้า noindex เป็น "ปลายทางใช้งานไม่ได้" ยิงแอดไม่ได้ทั้ง 7 หน้า
     canonical กันชนกันใน organic ได้เหมือนกันโดยที่หน้ายังยิงแอดได้ */
  alternates: { canonical: "/product/roof-shield-ceramic" },
};

export default async function LandingPage() {
  const html = await renderFragments(["_lp-head.html", "lp/roof-shield.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
