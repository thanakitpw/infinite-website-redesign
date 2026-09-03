import { renderFragments } from "../../lib/cms/render";
/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/four-plus.html */

export const metadata = {
  title: "สีน้ำพลาสติก Four Plus | ทาภายใน ภายนอก รองพื้นปูน อะคริลิก 100% ราคาโรงงาน",
  description:
    "สีน้ำพลาสติก Four Plus อะคริลิกอิมัลชั่น 100% ครบระบบ รองพื้นปูนกันด่าง สีทาภายใน และสีทาภายนอก ถัง 18.925 ลิตร ทาได้ 150 ตร.ม./เที่ยว ผลิตโดยโรงงาน ISO 9001:2015",
  /* เคยใส่ robots noindex ไว้กันไม่ให้แข่ง ranking กับหน้าสินค้าจริง แต่ Google Ads
     ตีตกหน้า noindex เป็น "ปลายทางใช้งานไม่ได้" ยิงแอดไม่ได้ทั้ง 7 หน้า
     canonical กันชนกันใน organic ได้เหมือนกันโดยที่หน้ายังยิงแอดได้ */
  alternates: { canonical: "/product/four-plus-exterior" },
};

export default async function LandingPage() {
  const html = await renderFragments(["_lp-head.html", "lp/four-plus.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
